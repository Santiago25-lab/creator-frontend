import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { API_URLS } from './services/api';
import { useCvData } from './hooks/useCvData';
import { useChatIA } from './hooks/useChatIA';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import { mergeExtractedData } from './utils/mergeCvData';
import { customConfirm, customPrompt } from './utils/dialogs';
import ResumeA from './templates/ResumeA';
import ResumeB from './templates/ResumeB';
import ResumeC from './templates/ResumeC';
import ResumeD from './templates/ResumeD';
import ResumeE from './templates/ResumeE';
import ResumeF from './templates/ResumeF';
import DocumentsPanel from './DocumentsPanel';
import CertificatePage from './CertificatePage';
import ComposedTemplate from './templates/engine/ComposedTemplate';
import ComposerPanel, { STORAGE_KEY } from './templates/engine/ComposerPanel';
import { DEFAULT_RECIPE } from './templates/engine/registry';
import ProfileModal from './components/ProfileModal';
import './CVTemplate.css';

/* ═══════════════════════════════════════════════════
   CATÁLOGO
   ═══════════════════════════════════════════════════ */
const TEMPLATES = [
  { id: 'resume-a', name: 'Professional', tag: 'Sidebar · ATS', accent: '#3b82f6', icon: 'fa-table-columns' },
  { id: 'resume-b', name: 'Clean Minimal', tag: 'Centrada · ATS', accent: '#10b981', icon: 'fa-file-lines' },
  { id: 'resume-c', name: 'Elegant Serif', tag: 'Ejecutivo · Editorial', accent: '#f59e0b', icon: 'fa-feather-pointed' },
  { id: 'resume-d', name: 'Creative Designer', tag: 'Bold · Creativo', accent: '#7c3aed', icon: 'fa-paintbrush' },
  { id: 'resume-e', name: 'Warm Creative', tag: 'Granáte · Display', accent: '#8B1A1A', icon: 'fa-star' },
  { id: 'resume-f', name: 'Dark Impact', tag: 'Oscuro · Foto', accent: '#64748b', icon: 'fa-moon' },
];

const SAVED_DESIGNS_KEY = 'creator_cv_saved_designs';

/* ═══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════ */
const CVTemplate = ({ initialTab = 'templates', onBack, initialDesign, projectId }) => {
  const { user, signOut } = useAuth();

  // ── Estado del CV (hook extraído con soporte Supabase) ──
  const cv = useCvData(user, projectId);
  const { cvData, setCvData, isSaving } = cv;

  // ── Chat IA (hook extraído) ──
  const chat = useChatIA(cvData, (newCvData) => {
    setCvData(newCvData);
    cv.setHasUnsavedChanges(true);
  }, user, projectId);

  // ── UI State ──
  const [activeTemplate, setActiveTemplate] = useState('resume-a');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [zoom, setZoom] = useState(1.0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [shareLink, setShareLink] = useState('');

  // ── Composition Engine ──
  const [composerMode, setComposerMode] = useState(false);
  const [recipe, setRecipe] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_RECIPE;
    } catch { return DEFAULT_RECIPE; }
  });



  // Load layout configurations from cvData if available
  useEffect(() => {
    if (cv.cvData) {
      if (cv.cvData.recipe) setRecipe(cv.cvData.recipe);
      if (cv.cvData.activeTemplate) setActiveTemplate(cv.cvData.activeTemplate);
      if (cv.cvData.composerMode !== undefined) setComposerMode(cv.cvData.composerMode);
    }
  }, [cv.cvData?.recipe, cv.cvData?.activeTemplate, cv.cvData?.composerMode]);

  // ── Diseños Guardados ──
  const [savedDesigns, setSavedDesigns] = useState([]);

  // Cargar diseños desde Supabase
  useEffect(() => {
    if (!user) return;

    const fetchDesigns = async () => {
      const { data, error } = await supabase
        .from('saved_designs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) setSavedDesigns(data);
    };

    fetchDesigns();
  }, [user]);

  const saveCurrentDesign = async (name = "Mi Diseño") => {
    if (!user) return;

    const newDesign = {
      user_id: user.id,
      name,
      recipe: { ...recipe, activeTemplate, composerMode },
    };

    const { data, error } = await supabase
      .from('saved_designs')
      .insert(newDesign)
      .select()
      .single();

    if (data && !error) {
      setSavedDesigns(prev => [data, ...prev]);
    }
  };

  const deleteDesign = async (id) => {
    if (!user) return;

    const { error } = await supabase
      .from('saved_designs')
      .delete()
      .eq('id', id);

    if (!error) {
      setSavedDesigns(prev => prev.filter(d => d.id !== id));
    }
  };

  const applyDesign = (design) => {
    if (!design) return;
    const configUpdate = {};
    if (design.recipe) {
      setRecipe(design.recipe);
      configUpdate.recipe = design.recipe;
      if (design.recipe.activeTemplate) {
        setActiveTemplate(design.recipe.activeTemplate);
        configUpdate.activeTemplate = design.recipe.activeTemplate;
      }
      if (design.recipe.composerMode !== undefined) {
        setComposerMode(design.recipe.composerMode);
        configUpdate.composerMode = design.recipe.composerMode;
      } else {
        setComposerMode(true); // Fallback for old saved designs
        configUpdate.composerMode = true;
      }
    }
    cv.updateConfig(configUpdate);
    setActiveTab('templates');
  };

  useEffect(() => {
    if (initialDesign) {
      applyDesign(initialDesign);
    }
  }, [initialDesign]);

  // ── Historial de Versiones ──
  const [historyVersions, setHistoryVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [activeVersionId, setActiveVersionId] = useState(null);

  useEffect(() => {
    if (activeTab === 'history' && user) {
      const fetchHistory = async () => {
        setLoadingVersions(true);
        const { data, error } = await supabase
          .from('cv_versions')
          .select('id, name, created_at, content')
          .eq('user_id', user.id)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        if (data && !error) setHistoryVersions(data);
        setLoadingVersions(false);
      };
      fetchHistory();
    }
  }, [activeTab, user, projectId]);

  const restoreVersion = async (version) => {
    const confirm = await customConfirm("¿Seguro que quieres restaurar esta versión? Se reemplazará el contenido actual de este proyecto.");
    if (confirm) {
      setActiveVersionId(version.id);
      cv.setCvData(version.content);
      cv.setHasUnsavedChanges(true);
      if (version.content.recipe) setRecipe(version.content.recipe);
      if (version.content.activeTemplate) {
        cv.updateConfig({ activeTemplate: version.content.activeTemplate });
        setActiveTemplate(version.content.activeTemplate);
      }
      if (version.content.composerMode !== undefined) {
        setComposerMode(version.content.composerMode);
      }
      setActiveTab('editor');
    }
  };

  const deleteVersion = async (id) => {
    const confirm = await customConfirm("¿Seguro que quieres eliminar esta versión? Esta acción no se puede deshacer.");
    if (confirm) {
      setHistoryVersions(prev => prev.filter(v => v.id !== id));
      if (activeVersionId === id) setActiveVersionId(null);
      await supabase.from('cv_versions').delete().eq('id', id);
    }
  };

  // ── Alerta de Cambios Sin Guardar ──
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (cv.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Muestra el diálogo predeterminado del navegador
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cv.hasUnsavedChanges]);

  const cvRef = useRef(null);

  // ── Documentos adjuntos ──
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URLS.documents}?userId=${user.id}`);
      if (res.ok) setDocuments(await res.json());
    } catch {}
  };

  useEffect(() => {
    if (user) fetchDocuments();
  }, [user]); // Re-ejecutar cuando el usuario cambie o se cargue

  // ── UI helpers ──
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const photoInputRef = React.useRef(null);

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Comprimir a JPEG con 70% calidad
      };
    });
  };

  // ── WhatsApp-Style Cropper State & Logic ──
  const [showCropper, setShowCropper] = useState(false);
  const [cropperSrc, setCropperSrc] = useState(null);
  const [cropZoom, setCropZoom] = useState(1.0);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });

  useEffect(() => {
    if (!cropperSrc) return;
    const img = new Image();
    img.src = cropperSrc;
    img.onload = () => {
      const imgRatio = img.width / img.height;
      let renderWidth, renderHeight;
      if (imgRatio > 1) {
        renderHeight = 300;
        renderWidth = 300 * imgRatio;
      } else {
        renderWidth = 300;
        renderHeight = 300 / imgRatio;
      }
      setImgDimensions({
        width: renderWidth,
        height: renderHeight,
        naturalWidth: img.width,
        naturalHeight: img.height
      });
    };
  }, [cropperSrc]);

  const constrainPan = (x, y, zoomValue = cropZoom) => {
    if (!imgDimensions.width) return { x, y };
    const visualWidth = imgDimensions.width * zoomValue;
    const visualHeight = imgDimensions.height * zoomValue;
    
    // Bounds for X
    const maxX = Math.max(0, (visualWidth - 300) / 2);
    const minX = Math.min(0, (300 - visualWidth) / 2);
    
    // Bounds for Y
    const maxY = Math.max(0, (visualHeight - 300) / 2);
    const minY = Math.min(0, (300 - visualHeight) / 2);
    
    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y))
    };
  };

  const handleZoomChange = (e) => {
    const z = parseFloat(e.target.value);
    setCropZoom(z);
    setCropPan(prev => constrainPan(prev.x, prev.y, z));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPan.x,
      y: e.clientY - cropPan.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setCropPan(constrainPan(rawX, rawY));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - cropPan.x,
      y: e.touches[0].clientY - cropPan.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const rawX = e.touches[0].clientX - dragStart.x;
    const rawY = e.touches[0].clientY - dragStart.y;
    setCropPan(constrainPan(rawX, rawY));
  };

  const handleApplyCrop = () => {
    if (!cropperSrc || !imgDimensions.width) return;
    
    const img = new Image();
    img.src = cropperSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');
      
      // Background base
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 640, 640);
      
      // Calculate drawing dimensions relative to 300x300 viewport scaled up by 640/300
      const scaleFactor = 640 / 300;
      const visualWidth = imgDimensions.width * cropZoom;
      const visualHeight = imgDimensions.height * cropZoom;
      
      const visualLeft = (300 - visualWidth) / 2 + cropPan.x;
      const visualTop = (300 - visualHeight) / 2 + cropPan.y;
      
      const canvasLeft = visualLeft * scaleFactor;
      const canvasTop = visualTop * scaleFactor;
      const canvasWidth = visualWidth * scaleFactor;
      const canvasHeight = visualHeight * scaleFactor;
      
      ctx.drawImage(img, canvasLeft, canvasTop, canvasWidth, canvasHeight);
      
      // Compression high quality 0.95
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);
      cv.setPhoto(croppedBase64);
      setShowCropper(false);
    };
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropperSrc(reader.result);
      setCropZoom(1.0);
      setCropPan({ x: 0, y: 0 });
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    cv.removePhoto();
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleShare = () => {
    const url = `${window.location.origin}/share/${projectId}`;
    setShareLink(url);
    navigator.clipboard.writeText(url);
    
    setShowShareToast(true);
  };

  /* ── Exportar PDF ── */
  const exportPDF = async () => {
    const wrapper = cvRef.current;
    if (!wrapper) return;

    // Guardamos el transform actual y lo reseteamos a escala 1:1 para captura limpia
    const prevTransform = wrapper.style.transform;
    wrapper.style.transform = 'scale(1)';
    wrapper.style.transformOrigin = 'top left';

    const opt = {
      margin: 0,
      filename: `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, allowTaint: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(wrapper).save();
    } finally {
      // Restauramos el transform visual original después de exportar
      wrapper.style.transform = prevTransform;
      wrapper.style.transformOrigin = 'top center';
    }
  };

  /* ── Render plantilla ── */
  const renderTemplate = () => {
    if (composerMode) {
      return <ComposedTemplate data={cvData} recipe={recipe} />;
    }
    switch (activeTemplate) {
      case 'resume-a': return <ResumeA data={cvData} />;
      case 'resume-b': return <ResumeB data={cvData} />;
      case 'resume-c': return <ResumeC data={cvData} />;
      case 'resume-d': return <ResumeD data={cvData} />;
      case 'resume-e': return <ResumeE data={cvData} />;
      case 'resume-f': return <ResumeF data={cvData} />;
      default: return <ResumeA data={cvData} />;
    }
  };

  return (
    <div className="app">

      {/* ═══ TOOL BAR ═══ */}
      <nav className="app__tools">
        {onBack ? (
          <button className="app__logo" onClick={onBack} title="Volver al Menú" style={{ cursor: 'pointer', border: 'none' }}>
            <i className="fa-solid fa-arrow-left" style={{ color: '#0f0d15' }} />
          </button>
        ) : (
          <div className="app__logo"><i className="fa-solid fa-pen-ruler" /></div>
        )}
        <ToolBtn icon="fa-layer-group" label="Diseños" active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} />
        <ToolBtn icon="fa-user-pen" label="Datos" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
        <ToolBtn icon="fa-comment-dots" label="IA" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <ToolBtn icon="fa-paperclip" label="Docs" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
        <ToolBtn icon="fa-clock-rotate-left" label="Versiones" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        
        <div className="app__tools-footer">
          <div 
            className="app__user-badge" 
            title="Ver Perfil" 
            onClick={() => setShowProfile(true)}
            style={{ cursor: 'pointer' }}
          >
            {user?.email?.[0].toUpperCase()}
          </div>
          <button className="app__logout-btn" onClick={signOut} title="Cerrar Sesión">
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </nav>

      {/* ═══ PANEL ═══ */}
      <aside className="app__panel">
        <h2 className="app__panel-title">
          {activeTab === 'templates' && !composerMode && 'Catálogo'}
          {activeTab === 'templates' && composerMode && 'Compositor'}
          {activeTab === 'editor' && 'Editar CV'}
          {activeTab === 'chat' && 'Redactor IA'}
          {activeTab === 'docs' && 'Documentos'}
          {activeTab === 'history' && 'Historial'}
          {isSaving && <span className="app__saving-indicator">Guardando...</span>}
        </h2>

        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* TAB: Plantillas */}
          {activeTab === 'templates' && !composerMode && (
            <div className="app__gallery">
              {/* Botón Crear Diseño de Plantilla - PRIMERO Y RELEVANTE */}
              <button className="app__create-design-btn" onClick={() => { setComposerMode(true); cv.updateConfig({ composerMode: true }); }}>
                <i className="fa-solid fa-wand-magic-sparkles" />
                <span>Crear Diseño de Plantilla</span>
              </button>

              {/* Botón Toggle para desplegar Plantillas Estáticas */}
              <button 
                className={`app__toggle-templates-btn ${showTemplates ? 'app__toggle-templates-btn--active' : ''}`}
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-clone" style={{ color: 'var(--color-primary)' }} />
                  <span>Plantillas Estáticas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="app__toggle-active-name">
                    {TEMPLATES.find(t => t.id === activeTemplate)?.name || 'Seleccionar'}
                  </span>
                  <i className={`fa-solid fa-chevron-${showTemplates ? 'up' : 'down'}`} />
                </div>
              </button>

              {showTemplates && (
                <div className="app__gallery-collapsible">
                  {TEMPLATES.map(t => (
                    <div key={t.id} className={`app__card ${activeTemplate === t.id && !composerMode ? 'app__card--active' : ''}`} onClick={() => { setActiveTemplate(t.id); setComposerMode(false); cv.updateConfig({ activeTemplate: t.id, composerMode: false }); }}>
                      <div className="app__card-preview" style={{ borderColor: t.accent }}>
                        <i className={`fa-solid ${t.icon}`} style={{ color: t.accent }} />
                      </div>
                      <div className="app__card-info">
                        <strong>{t.name}</strong>
                        <span className="app__card-tag" style={{ color: t.accent }}>{t.tag}</span>
                      </div>
                      {activeTemplate === t.id && !composerMode && <div className="app__card-check" style={{ background: t.accent }}><i className="fa-solid fa-check" /></div>}
                    </div>
                  ))}
                </div>
              )}

              {/* MIS DISEÑOS GUARDADOS */}
              {savedDesigns.length > 0 && (
                <>
                  <div className="app__editor-section-header" style={{ marginTop: '30px' }}>
                    <span>Mis Diseños Guardados</span>
                  </div>
                  <div className="app__saved-grid">
                    {savedDesigns.map(d => (
                      <div key={d.id} className="app__saved-card">
                        <div className="app__saved-preview" onClick={() => applyDesign(d)} style={{ borderColor: d.recipe.theme.primaryColor }}>
                          <i className="fa-solid fa-layer-group" style={{ color: d.recipe.theme.primaryColor }} />
                        </div>
                        <div className="app__saved-info">
                          <strong onClick={() => applyDesign(d)}>{d.name}</strong>
                          <button className="app__saved-delete" onClick={(e) => { e.stopPropagation(); deleteDesign(d.id); }} title="Eliminar diseño">
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: Compositor */}
          {activeTab === 'templates' && composerMode && (
            <ComposerPanel
              recipe={recipe}
              onRecipeChange={(newRecipe) => { setRecipe(newRecipe); cv.updateConfig({ recipe: newRecipe }); }}
              onBack={() => { setComposerMode(false); cv.updateConfig({ composerMode: false }); }}
              onSave={saveCurrentDesign}
            />
          )}

          {/* TAB: Editor completo */}
          {activeTab === 'editor' && (
            <div className="app__editor">
              {/* ── Foto de perfil ── */}
              <div className="app__photo-upload">
                <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                <div className="app__photo-preview" onClick={() => photoInputRef.current.click()}>
                  {cvData.personalInfo.photo
                    ? <img src={cvData.personalInfo.photo} alt="Foto" />
                    : <div className="app__photo-placeholder"><i className="fa-solid fa-camera" /><span>Subir foto</span></div>
                  }
                </div>
                <div className="app__photo-actions">
                  <button className="app__photo-btn" onClick={() => photoInputRef.current.click()}>
                    <i className="fa-solid fa-upload" /> {cvData.personalInfo.photo ? 'Cambiar foto' : 'Subir foto'}
                  </button>
                  {cvData.personalInfo.photo && (
                    <button className="app__photo-btn app__photo-btn--remove" onClick={handleRemovePhoto}>
                      <i className="fa-solid fa-trash-can" /> Eliminar
                    </button>
                  )}
                </div>
              </div>

              {/* ── Datos Personales ── */}
              <SectionHeader title="Datos Personales" />
              <EditorField label="Nombre" value={cvData.personalInfo.name} onChange={v => cv.updatePersonal('name', v)} />
              <EditorField label="Cargo" value={cvData.personalInfo.title} onChange={v => cv.updatePersonal('title', v)} />
              <EditorField label="Email" value={cvData.personalInfo.email} onChange={v => cv.updatePersonal('email', v)} />
              <EditorField label="Teléfono" value={cvData.personalInfo.phone} onChange={v => cv.updatePersonal('phone', v)} />
              <EditorField label="Ciudad" value={cvData.personalInfo.address} onChange={v => cv.updatePersonal('address', v)} />
              <EditorField label="Web" value={cvData.personalInfo.website} onChange={v => cv.updatePersonal('website', v)} />
              <EditorField label="Perfil Profesional" value={cvData.personalInfo.aboutMe} onChange={v => cv.updatePersonal('aboutMe', v)} textarea />

              {/* ── Experiencia ── */}
              <SectionHeader title="Experiencia" onAdd={cv.addExperience} />
              {cvData.experience.map((exp, i) => (
                <div key={i} className="app__editor-card">
                  <button className="app__editor-remove" onClick={() => cv.removeExperience(i)} title="Eliminar"><i className="fa-solid fa-trash-can" /></button>
                  <EditorField label="Cargo · Empresa" value={exp.title} onChange={v => cv.updateExperience(i, 'title', v)} />
                  <EditorField label="Período" value={exp.period} onChange={v => cv.updateExperience(i, 'period', v)} />
                  <EditorField label="Descripción" value={exp.description} onChange={v => cv.updateExperience(i, 'description', v)} textarea />
                </div>
              ))}

              {/* ── Educación ── */}
              <SectionHeader title="Educación" onAdd={cv.addEducation} />
              {cvData.education.map((edu, i) => (
                <div key={i} className="app__editor-card">
                  <button className="app__editor-remove" onClick={() => cv.removeEducation(i)} title="Eliminar"><i className="fa-solid fa-trash-can" /></button>
                  <EditorField label="Título" value={edu.degree} onChange={v => cv.updateEducation(i, 'degree', v)} />
                  <EditorField label="Institución" value={edu.institution} onChange={v => cv.updateEducation(i, 'institution', v)} />
                  <EditorField label="Período" value={edu.period} onChange={v => cv.updateEducation(i, 'period', v)} />
                </div>
              ))}

              {/* ── Skills ── */}
              <SectionHeader title="Habilidades" />
              <div className="app__editor-tags">
                {cvData.skills.map((s, i) => (
                  <span key={i} className="app__editor-tag">
                    {s} <button onClick={() => cv.removeSkill(i)}>×</button>
                  </span>
                ))}
              </div>
              <div className="app__inline-add">
                <input className="app__inline-input" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (cv.addSkill(newSkill), setNewSkill(''))} placeholder="Escribe una habilidad..." />
                <button className="app__inline-btn" onClick={() => { cv.addSkill(newSkill); setNewSkill(''); }} title="Agregar"><i className="fa-solid fa-plus" /></button>
                <button className="app__suggest-btn" onClick={chat.suggestSkills} title="Sugerencias IA"><i className="fa-solid fa-wand-magic-sparkles" /></button>
              </div>
              {chat.skillSuggestions.length > 0 && (
                <div className="app__suggestions">
                  <span className="app__suggestions-label"><i className="fa-solid fa-lightbulb" /> Sugerencias IA:</span>
                  <div className="app__editor-tags">
                    {chat.skillSuggestions.map((s, i) => (
                      <span key={i} className="app__editor-tag app__editor-tag--suggest" onClick={() => { cv.addSkill(s); chat.setSkillSuggestions(prev => prev.filter((_, idx) => idx !== i)); }}>
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Idiomas ── */}
              <SectionHeader title="Idiomas" />
              <div className="app__editor-tags">
                {cvData.languages.map((l, i) => (
                  <span key={i} className="app__editor-tag">
                    {l} <button onClick={() => cv.removeLanguage(i)}>×</button>
                  </span>
                ))}
              </div>
              <div className="app__inline-add">
                <input className="app__inline-input" value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => e.key === 'Enter' && (cv.addLanguage(newLang), setNewLang(''))} placeholder="Ej: Francés (A2)" />
                <button className="app__inline-btn" onClick={() => { cv.addLanguage(newLang); setNewLang(''); }} title="Agregar"><i className="fa-solid fa-plus" /></button>
                <button className="app__suggest-btn" onClick={chat.suggestLanguages} title="Sugerencias IA"><i className="fa-solid fa-wand-magic-sparkles" /></button>
              </div>
              {chat.langSuggestions.length > 0 && (
                <div className="app__suggestions">
                  <span className="app__suggestions-label"><i className="fa-solid fa-lightbulb" /> Sugerencias IA:</span>
                  <div className="app__editor-tags">
                    {chat.langSuggestions.map((l, i) => (
                      <span key={i} className="app__editor-tag app__editor-tag--suggest" onClick={() => { cv.addLanguage(l); chat.setLangSuggestions(prev => prev.filter((_, idx) => idx !== i)); }}>
                        + {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: Chat IA */}
          {activeTab === 'chat' && (
            <div className="app__chat">
              <div className="app__chat-messages">
                {chat.chatMessages.map((m, i) => (
                  <div key={i} className={`app__msg ${m.role === 'user' ? 'app__msg--user' : 'app__msg--ai'}`}>{m.content}</div>
                ))}
                {chat.isLoading && <div className="app__msg app__msg--ai app__msg--loading">Pensando<span className="dots" /></div>}
                <div ref={chat.chatEndRef} />
              </div>
              <div className="app__chat-input-wrap">
                <textarea 
                  className="app__chat-input" 
                  value={chat.userInput} 
                  onChange={e => chat.setUserInput(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      chat.sendMessage();
                    }
                  }} 
                  placeholder="Cuéntame sobre tu experiencia..." 
                  disabled={chat.isLoading} 
                  rows={1}
                />
                <button className="app__chat-send" onClick={chat.sendMessage} disabled={chat.isLoading}><i className="fa-solid fa-paper-plane" /></button>
              </div>
            </div>
          )}

          {/* TAB: Documentos */}
          {activeTab === 'docs' && (
            <div style={{ padding: '4px 0' }}>
              <DocumentsPanel
                projectId={projectId}
                linkedDocs={cvData.linkedDocs || []}
                onLinkDoc={(docId) => {
                  cv.updateConfig({ linkedDocs: [...(cvData.linkedDocs || []), docId] });
                }}
                onBeforeUpload={() => cv.saveToBackend()}
                onApplyData={(extracted) => {
                  setCvData(prev => mergeExtractedData(prev, extracted));
                }}
              />
            </div>
          )}

          {/* TAB: Historial */}
          {activeTab === 'history' && (
            <div className="app__history" style={{ padding: '20px', background: 'var(--bg-body)', borderRadius: '12px', margin: '0' }}>
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
                  El autoguardado mantiene tu proyecto siempre al día. Usa esta sección para guardar <strong>copias de seguridad (versiones)</strong> en momentos clave y regresar a ellas cuando quieras.
                </p>
              </div>
              
              <button 
                onClick={async () => {
                  const name = await customPrompt("Nombre de esta versión:", `Versión ${new Date().toLocaleDateString()}`);
                  if (name) {
                    await cv.saveToBackend(name, recipe, activeTemplate, composerMode);
                    // Refresh history
                    if (user) {
                      setLoadingVersions(true);
                      const { data } = await supabase.from('cv_versions')
                        .select('id, name, created_at, content')
                        .eq('user_id', user.id)
                        .eq('project_id', projectId)
                        .order('created_at', { ascending: false });
                      if (data) {
                        setHistoryVersions(data);
                        if (data.length > 0) setActiveVersionId(data[0].id);
                      }
                      setLoadingVersions(false);
                    }
                  }
                }}
                disabled={cv.isSaving}
                style={{ width: '100%', padding: '14px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.3)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)'; }}
              >
                <i className="fa-solid fa-camera-retro" style={{ fontSize: '16px' }} /> Tomar Fotografía del CV (Guardar)
              </button>

              <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-timeline" style={{ color: 'var(--color-primary)' }}/> Línea de tiempo
              </h3>

              {loadingVersions ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-primary)' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px' }} />
                  <p style={{ marginTop: '10px', fontSize: '13px' }}>Cargando línea de tiempo...</p>
                </div>
              ) : historyVersions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                  {/* Línea conectora */}
                  <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
                  
                  {historyVersions.map((version, idx) => {
                    const isActive = activeVersionId === version.id || (idx === 0 && activeVersionId === null);
                    return (
                      <div key={version.id} style={{ position: 'relative', paddingLeft: '40px', zIndex: 1 }}>
                        {/* Punto en la línea de tiempo */}
                        <div style={{ position: 'absolute', left: '11px', top: '16px', width: '12px', height: '12px', borderRadius: '50%', background: isActive ? 'var(--color-primary)' : 'var(--bg-card)', border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--border-color)'}`, boxShadow: '0 0 0 4px var(--bg-body)' }}></div>
                        
                        <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--border-color)'}`, background: 'var(--bg-card)', boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.05)' : 'none', transition: 'all 0.2s' }}
                             onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                             onMouseOut={e => { e.currentTarget.style.borderColor = isActive ? 'var(--color-primary)' : 'var(--border-color)'; }}
                        >
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: 'var(--text-primary)' }}>{version.name || 'Versión guardada'}</h4>
                          <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-regular fa-clock" /> {new Date(version.created_at).toLocaleString()}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button 
                              onClick={() => restoreVersion(version)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: 0, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s', fontWeight: isActive ? 'bold' : 'normal' }}
                              onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
                              onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}
                            >
                              <i className="fa-solid fa-rotate-left" /> Restaurar esta versión
                            </button>
                            <button 
                              onClick={() => deleteVersion(version.id)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', padding: 0, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                              onMouseOut={e => e.currentTarget.style.color = 'var(--text-dim)'}
                            >
                              <i className="fa-solid fa-trash-can" /> Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                  <div style={{ width: '60px', height: '60px', background: 'var(--bg-body)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-dim)' }}>
                    <i className="fa-solid fa-camera-retro" style={{ fontSize: '24px' }} />
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Aún no hay fotografías</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-dim)' }}>Toma tu primera foto para guardar un punto seguro en tu diseño.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ═══ LIENZO ═══ */}
      <main className="app__canvas">
        <div className="app__topbar">
          <span className="app__topbar-label">Vista previa en tiempo real</span>
          <div className="app__zoom">
            <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}>−</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>+</button>
          </div>
          <button className="app__regen-btn" onClick={chat.regenerateCV} disabled={chat.isRegenerating}>
            <i className={`fa-solid ${chat.isRegenerating ? 'fa-spinner fa-spin' : 'fa-rotate'}`} /> {chat.isRegenerating ? 'Regenerando...' : 'Regenerar'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', color: cv.isSaving ? 'var(--text-primary)' : (cv.hasUnsavedChanges ? 'var(--text-dim)' : '#10b981'), padding: '0 12px' }}>
            {cv.isSaving ? (
              <><i className="fa-solid fa-spinner fa-spin" /> Guardando...</>
            ) : cv.hasUnsavedChanges ? (
              <><i className="fa-solid fa-circle-dot" /> Cambios sin guardar</>
            ) : (
              <><i className="fa-solid fa-cloud-check" /> Guardado en la nube</>
            )}
          </div>
          
          <button className="app__share-btn" onClick={handleShare}>
            <i className="fa-solid fa-link" /> Compartir
          </button>

          <button className="app__export-btn" onClick={exportPDF}>
            <i className="fa-solid fa-file-pdf" /> Exportar PDF
          </button>
        </div>

        <div className="app__viewport">
          <div className="app__paper-wrap" style={{ transform: `scale(${zoom})` }} ref={cvRef}>
            {renderTemplate()}
            {documents.map((doc, i) => (
              <CertificatePage
                key={doc.id}
                doc={doc}
                accentColor={TEMPLATES.find(t => t.id === activeTemplate)?.accent || '#3b82f6'}
                cvData={cvData}
                userId={user?.id}
              />
            ))}
          </div>
        </div>
      </main>
      
      {/* ── WhatsApp-Style Cropper Modal ── */}
      {showCropper && (
        <div 
          className="cropper-modal" 
          onMouseUp={handleMouseUp} 
          onMouseMove={handleMouseMove} 
          onTouchEnd={handleMouseUp} 
          onTouchMove={handleTouchMove}
        >
          <div className="cropper-modal__content" onClick={e => e.stopPropagation()}>
            <h3 className="cropper-modal__title">Ajustar Foto de Perfil</h3>
            <p className="cropper-modal__subtitle">Arrastra la foto para encuadrarla dentro del círculo</p>
            
            {/* Viewport de recorte circular */}
            <div 
              className="cropper-modal__viewport-wrap"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="cropper-modal__viewport">
                {cropperSrc && (
                  <img
                    src={cropperSrc}
                    alt="Original"
                    style={{
                      position: 'absolute',
                      width: `${imgDimensions.width}px`,
                      height: `${imgDimensions.height}px`,
                      left: `${(300 - imgDimensions.width) / 2}px`,
                      top: `${(300 - imgDimensions.height) / 2}px`,
                      transform: `translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropZoom})`,
                      transformOrigin: 'center',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                {/* Máscara oscura con hueco circular */}
                <div className="cropper-modal__mask" />
              </div>
            </div>
            
            {/* Slider de Zoom con iconos */}
            <div className="cropper-modal__controls">
              <i className="fa-solid fa-image cropper-modal__icon-small" />
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.01"
                value={cropZoom}
                onChange={handleZoomChange}
                className="cropper-modal__slider"
              />
              <i className="fa-solid fa-image cropper-modal__icon-large" style={{ fontSize: '1.4rem' }} />
            </div>
            
            {/* Botones de acción */}
            <div className="cropper-modal__actions">
              <button className="cropper-modal__btn cropper-modal__btn--cancel" onClick={() => setShowCropper(false)}>
                Cancelar
              </button>
              <button className="cropper-modal__btn cropper-modal__btn--apply" onClick={handleApplyCrop}>
                Aplicar Encuadre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div 
          onClick={() => setShowShareToast(false)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '80px', pointerEvents: 'auto', background: 'transparent' }}
        >
          <div className="share-toast" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderRadius: '12px', animation: 'slideDown 0.3s ease-out' }}>
            <div className="share-toast-icon" style={{ background: '#10b98120', color: '#10b981', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <div className="share-toast-content">
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>¡Enlace copiado!</h4>
              <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '14px' }}>
                Comparte tu CV en línea: <span style={{ background: 'var(--bg-body)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '4px', marginLeft: '6px' }}>{shareLink}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTES
   ═══════════════════════════════════════════════════ */
const ToolBtn = ({ icon, label, active, onClick }) => (
  <button className={`app__tool-btn ${active ? 'app__tool-btn--active' : ''}`} onClick={onClick} title={label}>
    <i className={`fa-solid ${icon}`} />
    <span>{label}</span>
  </button>
);

const SectionHeader = ({ title, onAdd }) => (
  <div className="app__editor-section-header">
    <span>{title}</span>
    {onAdd && <button onClick={onAdd} title="Agregar"><i className="fa-solid fa-plus" /></button>}
  </div>
);

const EditorField = ({ label, value, onChange, textarea }) => (
  <div className="app__field">
    <label>{label}</label>
    {textarea
      ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} />
      : <input value={value || ''} onChange={e => onChange(e.target.value)} />
    }
  </div>
);

export default CVTemplate;

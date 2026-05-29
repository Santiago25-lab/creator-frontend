import React, { useState, useEffect, useRef } from 'react';
import { API_URLS, getDocumentAnalyzeUrl } from './services/api';
import { formatSize, formatDateShort as formatDate, getFileIcon, getFileColor } from './utils/formatters';
import './DocumentsPanel.css';
import { useAuth } from './context/AuthContext';

// Filtra campos vacíos del objeto extraído
const hasContent = (val) => {
  if (!val) return false;
  if (typeof val === 'string') return val.trim() !== '';
  if (Array.isArray(val)) return val.some(v => hasContent(v));
  if (typeof val === 'object') return Object.values(val).some(hasContent);
  return false;
};

const DocumentsPanel = ({ projectId, onApplyData, onDocumentChange, onBeforeUpload, linkedDocs = [], onLinkDoc }) => {
  const { user } = useAuth(); // Obtener el usuario actual
  const [documents, setDocuments] = useState([]);
  const [viewMode, setViewMode] = useState('project'); // 'project' | 'global'
  const [showToast, setShowToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewer, setViewer] = useState(null); // { url, type, name }
  const [sessionDocIds, setSessionDocIds] = useState([]); // IDs de docs subidos en esta sesión
  const [uploadError, setUploadError] = useState('');
  const [description, setDescription] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);   
  const [analysisResult, setAnalysisResult] = useState(null); 
  const fileInputRef = useRef(null);

  useEffect(() => { 
    if (user) fetchDocuments(); 
  }, [user, viewMode, projectId, linkedDocs]);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const url = viewMode === 'project' && projectId 
        ? `${API_URLS.documents}?userId=${user.id}&projectId=${projectId}`
        : `${API_URLS.documents}?userId=${user.id}`;
      const res = await fetch(url);
      if (res.ok) {
        let docs = await res.json();
        if (viewMode === 'project' && projectId) {
          docs = docs.filter(d => 
            String(d.projectId) === String(projectId) || 
            String(d.project_id) === String(projectId) ||
            sessionDocIds.includes(d.id) ||
            linkedDocs.includes(d.id)
          );
        }
        setDocuments(docs);
      }
    } catch {}
  };

  const uploadFile = async (file) => {
    if (!user) return;
    setUploadError('');
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { setUploadError('❌ Tipo no permitido. Solo PDF, JPG y PNG.'); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError('❌ El archivo supera 10MB.'); return; }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id); // Enviar el ID del dueño
    if (projectId) {
      formData.append('projectId', projectId); // Vincular al proyecto actual
      formData.append('project_id', projectId); // Por si el backend usa snake_case
    }
    if (description.trim()) formData.append('description', description.trim());

    try {
      // Registrar documentos antes de subir
      const preRes = await fetch(`${API_URLS.documents}?userId=${user.id}`);
      const preDocs = preRes.ok ? await preRes.json() : [];

      const res = await fetch(`${API_URLS.documents}/upload`, { method: 'POST', body: formData });
      
      if (res.ok) { 
        setDescription(''); 
        
        // Intentar atrapar el ID directamente del JSON de respuesta por si el backend lo devuelve
        try {
          const jsonRes = await res.clone().json();
          const newDocId = jsonRes.id || jsonRes.document?.id || jsonRes.data?.id || jsonRes._id;
          if (newDocId) {
            setSessionDocIds(prev => [...prev, newDocId]);
            if (onLinkDoc) onLinkDoc(newDocId);
          }
        } catch (e) {
          // Fallback silencioso
        }

        // Registrar documentos después de subir para encontrar el nuevo (fallback si la respuesta no tenía el ID explícito)
        const postRes = await fetch(`${API_URLS.documents}?userId=${user.id}`);
        const postDocs = postRes.ok ? await postRes.json() : [];
        const oldIds = new Set(preDocs.map(d => d.id));
        const newIds = postDocs.filter(d => !oldIds.has(d.id)).map(d => d.id);
        
        if (newIds.length > 0) {
          setSessionDocIds(prev => [...prev, ...newIds]);
          if (onLinkDoc) newIds.forEach(id => onLinkDoc(id));
        }

        await fetchDocuments(); 
        if (onDocumentChange) onDocumentChange();
      }
      else { const err = await res.json(); setUploadError(err.error || '❌ Error al subir.'); }
    } catch { setUploadError('❌ Sin conexión con el servidor.'); }
    setIsUploading(false);
  };

  const handleFileSelect = (e) => { 
    const f = e.target.files[0]; 
    if (f) uploadFile(f); 
    e.target.value = ''; 
  };

  const handleDrop = async (e) => { 
    e.preventDefault(); 
    setIsDragging(false); 
    const f = e.dataTransfer.files[0]; 
    if (!f) return;
    setIsUploading(true);
    if (onBeforeUpload) await onBeforeUpload();
    uploadFile(f); 
  };

  const handleDelete = async (id) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URLS.documents}/${id}?userId=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        if (onDocumentChange) onDocumentChange();
      }
    } catch (e) { console.error('Error eliminando:', e); }
    finally { setConfirmDeleteId(null); }
  };

  const openViewer = (doc) => {
    // Añadir el userId a la URL de vista para validación
    const viewUrlWithAuth = `${doc.viewUrl}?userId=${user.id}`;
    setViewer({ url: viewUrlWithAuth, type: doc.contentType, name: doc.originalName });
  };

  const analyzeDocument = async (doc) => {
    if (!user) return;
    setAnalyzingId(doc.id);
    setAnalysisResult(null);
    try {
      const res = await fetch(`${getDocumentAnalyzeUrl(doc.id)}?userId=${user.id}`, { method: 'POST' });
      const text = await res.text();
      const json = JSON.parse(text);
      if (json.error) {
        setAnalysisResult({ doc, error: json.error });
      } else {
        setAnalysisResult({ doc, result: json });
      }
    } catch (e) {
      setAnalysisResult({ doc, error: 'No se pudo analizar el documento.' });
    }
    setAnalyzingId(null);
  };

  const applyAnalysis = () => {
    if (!analysisResult?.result?.extractedData || !onApplyData) return;
    onApplyData(analysisResult.result.extractedData);
    setAnalysisResult(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="docs">

      {/* ── Zona de carga ── */}
      <div
        className={`docs__dropzone ${isDragging ? 'docs__dropzone--active' : ''} ${isUploading ? 'docs__dropzone--loading' : ''}`}
        onClick={async () => {
          if (!isUploading) {
            setIsUploading(true);
            try {
              if (onBeforeUpload) await onBeforeUpload();
            } finally {
              setIsUploading(false);
              fileInputRef.current.click();
            }
          }
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" style={{ display: 'none' }}
          accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleFileSelect} />
        {isUploading ? (
          <><i className="fa-solid fa-spinner fa-spin docs__drop-icon" /><span className="docs__drop-text">Subiendo...</span></>
        ) : (
          <>
            <i className={`fa-solid fa-cloud-arrow-up docs__drop-icon ${isDragging ? 'docs__drop-icon--active' : ''}`} />
            <span className="docs__drop-text">{isDragging ? 'Suelta aquí' : 'Arrastra o haz clic para subir'}</span>
            <span className="docs__drop-hint">PDF · JPG · PNG · máx 10MB</span>
          </>
        )}
      </div>

      <input className="docs__desc-input" value={description} onChange={e => setDescription(e.target.value)}
        placeholder="Descripción del documento (opcional)..." />
      {uploadError && <div className="docs__error">{uploadError}</div>}

      {/* ── Lista ── */}
      <div className="docs__section-header" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Mis documentos</span>
          <span className="docs__count">{documents.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-body)', padding: '4px', borderRadius: '8px' }}>
          <button 
            style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: viewMode === 'project' ? 'var(--bg-card)' : 'transparent', color: viewMode === 'project' ? 'var(--text-primary)' : 'var(--text-dim)', fontWeight: viewMode === 'project' ? '600' : 'normal', cursor: 'pointer', boxShadow: viewMode === 'project' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            onClick={() => setViewMode('project')}
          >
            Este proyecto
          </button>
          <button 
            style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: viewMode === 'global' ? 'var(--bg-card)' : 'transparent', color: viewMode === 'global' ? 'var(--text-primary)' : 'var(--text-dim)', fontWeight: viewMode === 'global' ? '600' : 'normal', cursor: 'pointer', boxShadow: viewMode === 'global' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            onClick={() => setViewMode('global')}
          >
            Global
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="docs__empty"><i className="fa-solid fa-folder-open" /><span>No hay documentos {viewMode === 'project' ? 'en este proyecto' : 'subidos'}</span></div>
      ) : (
        <div className="docs__list">
          {documents.map(doc => (
            <div key={doc.id} className="docs__item">
              <div className="docs__item-icon" style={{ color: getFileColor(doc.contentType) }}>
                <i className={`fa-solid ${getFileIcon(doc.contentType)}`} />
              </div>
              <div className="docs__item-info">
                <span className="docs__item-name" title={doc.originalName}>{doc.originalName}</span>
                {doc.description && <span className="docs__item-desc">{doc.description}</span>}
                <span className="docs__item-meta">{formatSize(doc.fileSize)} · {formatDate(doc.uploadedAt)}</span>
              </div>

              {confirmDeleteId === doc.id ? (
                <div className="docs__item-confirm">
                  <span className="docs__confirm-text">¿Eliminar?</span>
                  <button className="docs__btn docs__btn--danger" onClick={() => handleDelete(doc.id)}>
                    <i className="fa-solid fa-check" /> Sí
                  </button>
                  <button className="docs__btn docs__btn--cancel" onClick={() => setConfirmDeleteId(null)}>
                    <i className="fa-solid fa-xmark" /> No
                  </button>
                </div>
              ) : (
                <div className="docs__item-actions">
                  {/* NUEVO: Botón Analizar IA */}
                  <button
                    className={`docs__btn docs__btn--ai ${analyzingId === doc.id ? 'docs__btn--analyzing' : ''}`}
                    onClick={() => analyzeDocument(doc)}
                    disabled={analyzingId !== null}
                    title="Analizar con IA y completar CV"
                  >
                    {analyzingId === doc.id
                      ? <i className="fa-solid fa-spinner fa-spin" />
                      : <i className="fa-solid fa-wand-magic-sparkles" />
                    }
                  </button>
                  <button className="docs__btn docs__btn--view" onClick={() => openViewer(doc)} title="Ver documento">
                    <i className="fa-solid fa-eye" />
                  </button>
                  <button className="docs__btn docs__btn--delete" onClick={() => setConfirmDeleteId(doc.id)} title="Eliminar">
                    <i className="fa-solid fa-trash-can" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Modal resultado de análisis IA ── */}
      {analysisResult && (
        <div className="docs__modal" onClick={() => setAnalysisResult(null)}>
          <div className="docs__modal-inner docs__modal-analysis" onClick={e => e.stopPropagation()}>
            <div className="docs__modal-header">
              <span className="docs__modal-title">
                <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#a855f7' }} />
                Análisis IA — {analysisResult.doc.originalName}
              </span>
              <button className="docs__btn docs__btn--delete" onClick={() => setAnalysisResult(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {analysisResult.error ? (
              <div className="docs__analysis-error">
                <i className="fa-solid fa-triangle-exclamation" />
                <span>{analysisResult.error}</span>
              </div>
            ) : (
              <div className="docs__analysis-body">
                {/* Tipo y resumen */}
                <div className="docs__analysis-summary">
                  <span className="docs__analysis-type">
                    <i className="fa-solid fa-tag" /> {analysisResult.result.documentType}
                  </span>
                  <p className="docs__analysis-desc">{analysisResult.result.summary}</p>
                </div>

                {/* Datos extraídos */}
                <div className="docs__analysis-label">Datos encontrados:</div>
                <div className="docs__analysis-fields">
                  {(() => {
                    const d = analysisResult.result.extractedData;
                    const items = [];
                    if (d?.personalInfo) {
                      Object.entries(d.personalInfo).forEach(([k, v]) => {
                        if (v) items.push({ icon: 'fa-user', label: k, value: v });
                      });
                    }
                    d?.education?.forEach(e => {
                      if (e.degree || e.institution) items.push({
                        icon: 'fa-graduation-cap',
                        label: 'Educación',
                        value: [e.degree, e.institution, e.period].filter(Boolean).join(' · ')
                      });
                    });
                    d?.experience?.forEach(e => {
                      if (e.title) items.push({
                        icon: 'fa-briefcase',
                        label: 'Experiencia',
                        value: [e.title, e.period].filter(Boolean).join(' · ')
                      });
                    });
                    d?.skills?.forEach(s => { if (s) items.push({ icon: 'fa-star', label: 'Habilidad', value: s }); });
                    d?.languages?.forEach(l => { if (l) items.push({ icon: 'fa-language', label: 'Idioma', value: l }); });
                    return items.length > 0 ? items.map((item, i) => (
                      <div key={i} className="docs__analysis-field">
                        <i className={`fa-solid ${item.icon}`} />
                        <span className="docs__field-label">{item.label}:</span>
                        <span className="docs__field-value">{item.value}</span>
                      </div>
                    )) : <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>No se encontraron datos específicos del CV.</p>;
                  })()}
                </div>

                {/* Botón Aplicar */}
                {onApplyData && (
                  <button className="docs__apply-btn" onClick={applyAnalysis}>
                    <i className="fa-solid fa-check-circle" />
                    Aplicar datos al CV
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal visor de archivo ── */}
      {viewer && (
        <div className="docs__modal" onClick={() => setViewer(null)}>
          <div className="docs__modal-inner" onClick={e => e.stopPropagation()}>
            <div className="docs__modal-header">
              <span className="docs__modal-title">
                <i className={`fa-solid ${getFileIcon(viewer.type)}`} style={{ color: getFileColor(viewer.type) }} />
                {viewer.name}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a className="docs__btn docs__btn--view" href={viewer.url} target="_blank" rel="noreferrer" title="Abrir en nueva pestaña">
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
                <button className="docs__btn docs__btn--delete" onClick={() => setViewer(null)} title="Cerrar">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
            <div className="docs__modal-body">
              {viewer.type === 'application/pdf'
                ? <iframe src={viewer.url} title={viewer.name} className="docs__iframe" />
                : <img src={viewer.url} alt={viewer.name} className="docs__preview-img" />
              }
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      {showToast && (
        <div className="docs__toast">
          <i className="fa-solid fa-check-circle" /> Datos aplicados al CV
        </div>
      )}
    </div>
  );
};

export default DocumentsPanel;

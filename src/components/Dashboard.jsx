import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ProfileModal from './ProfileModal';
import './Dashboard.css';

const Dashboard = ({ onSelectMode }) => {
  const { user, signOut } = useAuth();
  const [showPopup, setShowPopup] = useState(() => {
    return sessionStorage.getItem('showSuccessPopup') === 'true';
  });
  const [showProfile, setShowProfile] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  
  // Estado para creación de proyecto
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Papelera
  const [trashProjects, setTrashProjects] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  const [draggedProjectId, setDraggedProjectId] = useState(null);
  const [isDragOverTrash, setIsDragOverTrash] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoadingDesigns(true);
      
      // Fetch Projects (con content para deleted_at)
      const { data: projectsData } = await supabase
        .from('cv_projects')
        .select('id, name, updated_at, content')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (projectsData) {
        const now = new Date();
        const active = [];
        const trash = [];
        for (const p of projectsData) {
          const deletedAt = p.content?.deleted_at;
          if (deletedAt) {
            const days = (now - new Date(deletedAt)) / (1000 * 60 * 60 * 24);
            if (days > 30) {
              await supabase.from('cv_projects').delete().eq('id', p.id);
            } else {
              trash.push(p);
            }
          } else {
            active.push(p);
          }
        }
        setProjects(active);
        setTrashProjects(trash);
      }

      // Fetch Saved Designs (Templates)
      const { data: designsData } = await supabase
        .from('saved_designs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (designsData) {
        setSavedDesigns(designsData);
      }
      
      setLoadingDesigns(false);
    };

    fetchData();
  }, [user]);

  const closePopup = () => {
    setShowPopup(false);
    sessionStorage.removeItem('showSuccessPopup');
  };

  // Papelera handlers
  const handleDragStart = (e, id) => {
    setDraggedProjectId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOverTrash(false);
    if (!draggedProjectId) return;
    
    const proj = projects.find(p => p.id === draggedProjectId);
    if (!proj) return;
    
    const updatedContent = { ...proj.content, deleted_at: new Date().toISOString() };
    setProjects(prev => prev.filter(p => p.id !== draggedProjectId));
    setTrashProjects(prev => [ { ...proj, content: updatedContent }, ...prev ]);
    
    await supabase.from('cv_projects').update({ content: updatedContent }).eq('id', draggedProjectId);
    setDraggedProjectId(null);
  };

  const handleRestore = async (id) => {
    const proj = trashProjects.find(p => p.id === id);
    if (!proj) return;
    
    const updatedContent = { ...proj.content };
    delete updatedContent.deleted_at;
    
    setTrashProjects(prev => prev.filter(p => p.id !== id));
    setProjects(prev => [ { ...proj, content: updatedContent }, ...prev ]);
    
    await supabase.from('cv_projects').update({ content: updatedContent }).eq('id', id);
  };
  
  const handleHardDelete = async (id) => {
    if (window.confirm('¿Eliminar permanentemente este proyecto? No podrá ser recuperado.')) {
      setTrashProjects(prev => prev.filter(p => p.id !== id));
      await supabase.from('cv_projects').delete().eq('id', id);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-logo">
          <span className="material-symbols-outlined logo-icon">auto_awesome</span>
          <span className="logo-text">CreatorCV</span>
        </div>
        <div className="dashboard-user">
          <div 
            className="user-avatar" 
            onClick={() => setShowProfile(true)}
            title="Ver Perfil"
            style={{ cursor: 'pointer' }}
          >
            {user?.email?.[0].toUpperCase()}
          </div>
          <span className="user-email">{user?.email}</span>
          <button className="dashboard-logout-btn" onClick={signOut} title="Cerrar Sesión">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {!isCreatingProject ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 className="dashboard-title" style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0', background: 'linear-gradient(135deg, var(--color-primary), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
                  ¡Bienvenido a CreatorCV!
                </h1>
                <p className="dashboard-subtitle" style={{ margin: 0, fontSize: '16px', color: 'var(--text-dim)', fontWeight: '500' }}>
                  Aquí están tus proyectos. ¿En qué vamos a trabajar hoy?
                </p>
              </div>
              <button 
                className="dashboard-create-btn" 
                onClick={() => setIsCreatingProject(true)}
                style={{ 
                  padding: '14px 28px', 
                  background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  fontWeight: '700',
                  fontSize: '15px',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)'; }}
              >
                <i className="fa-solid fa-plus"></i> Nuevo Proyecto
              </button>
            </div>

            <div className="dashboard-extra-sections">
              <div className="dashboard-extra">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3><i className="fa-solid fa-folder-open"></i> Mis Proyectos</h3>
                  <button 
                    onClick={() => setShowTrash(!showTrash)}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-dim)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}
                  >
                    <i className="fa-solid fa-trash-can"></i> {showTrash ? 'Ocultar Papelera' : 'Ver Papelera'}
                  </button>
                </div>
                
                {/* Zona de la papelera (drag & drop) */}
                {showTrash && (
                  <div 
                    onDragOver={e => { e.preventDefault(); setIsDragOverTrash(true); }}
                    onDragLeave={() => setIsDragOverTrash(false)}
                    onDrop={handleDrop}
                    style={{ 
                      marginTop: '16px', marginBottom: '32px', padding: '24px', 
                      borderRadius: '16px', 
                      background: isDragOverTrash ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.02)', 
                      border: `2px dashed ${isDragOverTrash ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', minHeight: '160px',
                      boxShadow: isDragOverTrash ? '0 10px 25px -5px rgba(239, 68, 68, 0.2)' : 'inset 0 0 20px rgba(0,0,0,0.02)',
                      position: 'relative', overflow: 'hidden'
                    }}
                  >
                    {/* Decoración de fondo */}
                    <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.03, pointerEvents: 'none' }}>
                      <i className="fa-solid fa-trash-can" style={{ fontSize: '180px' }}></i>
                    </div>

                    <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                      <i className="fa-solid fa-trash-can" style={{ color: '#ef4444' }}></i> Papelera de reciclaje ({trashProjects.length})
                    </h4>
                    
                    <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--text-dim)', maxWidth: '600px', lineHeight: '1.5' }}>
                      Arrastra aquí tus proyectos para eliminarlos. Los elementos en la papelera se conservarán durante 30 días antes de ser eliminados definitivamente para liberar espacio.
                    </p>
                    
                    {trashProjects.length > 0 ? (
                      <div className="dashboard-recent-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', position: 'relative', zIndex: 1 }}>
                        {trashProjects.map(proj => (
                          <div key={proj.id} style={{ background: 'var(--bg-body)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <h5 style={{ margin: '0 0 6px 0', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{proj.name}</h5>
                            <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '16px' }}>
                              Eliminado: {proj.content?.deleted_at ? new Date(proj.content.deleted_at).toLocaleDateString() : 'Desconocido'}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleRestore(proj.id)} style={{ flex: 1, padding: '8px', fontSize: '12px', fontWeight: '500', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onMouseOver={e=>e.currentTarget.style.opacity=0.9} onMouseOut={e=>e.currentTarget.style.opacity=1}>
                                <i className="fa-solid fa-rotate-left"></i> Restaurar
                              </button>
                              <button onClick={() => handleHardDelete(proj.id)} style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }} title="Borrar permanentemente" onMouseOver={e=>{e.currentTarget.style.background='rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor='rgba(239, 68, 68, 0.4)'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor='rgba(239, 68, 68, 0.2)'}}>
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', color: '#ef4444', opacity: 0.6, transition: 'all 0.3s', transform: isDragOverTrash ? 'scale(1.1)' : 'scale(1)' }}>
                          <i className="fa-solid fa-trash-can" style={{ fontSize: '24px' }}></i>
                        </div>
                        {isDragOverTrash ? <strong style={{ color: '#ef4444' }}>¡Suelta el proyecto aquí!</strong> : 'La papelera está vacía'}
                      </div>
                    )}
                  </div>
                )}
                {loadingDesigns ? (
                  <div className="extra-empty-state">
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--color-primary)' }}></i>
                    <p>Cargando proyectos...</p>
                  </div>
                ) : projects.length > 0 ? (
                  <div className="dashboard-recent-grid">
                    {projects.map(proj => (
                      <div 
                        key={proj.id} 
                        className="recent-card" 
                        onClick={() => onSelectMode({ mode: 'manual', projectId: proj.id })}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, proj.id)}
                        onDragEnd={() => setDraggedProjectId(null)}
                        style={{ cursor: 'grab', opacity: draggedProjectId === proj.id ? 0.5 : 1 }}
                        title="Puedes arrastrar este proyecto a la papelera"
                      >
                        <div className="recent-card-preview" style={{ borderColor: 'var(--color-secondary)' }}>
                          <i className="fa-solid fa-file-user" style={{ color: 'var(--color-secondary)' }}></i>
                        </div>
                        <div className="recent-card-info">
                          <h4>{proj.name}</h4>
                          <span>Editado: {new Date(proj.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="extra-empty-state">
                    <div className="empty-icon">
                      <i className="fa-regular fa-folder-open"></i>
                    </div>
                    <p>Aún no tienes proyectos creados.</p>
                  </div>
                )}
              </div>

          <div className="dashboard-extra">
            <h3><i className="fa-solid fa-layer-group"></i> Plantillas Guardadas</h3>
            {loadingDesigns ? (
              <div className="extra-empty-state">
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--color-primary)' }}></i>
                <p>Cargando plantillas...</p>
              </div>
            ) : savedDesigns.length > 0 ? (
              <div className="dashboard-recent-grid">
                {savedDesigns.map(design => (
                  <div key={design.id} className="recent-card" onClick={() => onSelectMode({ mode: 'manual', design })}>
                    <div className="recent-card-preview" style={{ borderColor: design.recipe?.theme?.primaryColor || 'var(--color-primary)' }}>
                      <i className="fa-solid fa-palette" style={{ color: design.recipe?.theme?.primaryColor || 'var(--color-primary)' }}></i>
                    </div>
                    <div className="recent-card-info">
                      <h4>{design.name || 'Plantilla Personalizada'}</h4>
                      <span>{new Date(design.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="extra-empty-state">
                <div className="empty-icon">
                  <i className="fa-regular fa-folder-open"></i>
                </div>
                <p>No tienes plantillas personalizadas guardadas.</p>
              </div>
            )}
          </div>
          </div>
          </>
        ) : (
          <div className="dashboard-create-project-view">
            <button onClick={() => setIsCreatingProject(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', marginBottom: '20px' }}>
              <i className="fa-solid fa-arrow-left"></i> Volver a Mis Proyectos
            </button>
            
            <h2 style={{ marginBottom: '10px' }}>Configuración Básica del Proyecto</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>Asigna un nombre a tu nuevo CV y elige cómo quieres empezarlo.</p>
            
            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Nombre del Proyecto</label>
              <input 
                type="text" 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Ej. CV para Google, CV Diseño Gráfico..."
                style={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '2px solid #cbd5e1', 
                  outline: 'none',
                  background: 'var(--bg-card)', 
                  color: 'var(--text-primary)', 
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
            
            <h3 style={{ marginBottom: '20px' }}>¿Cómo te gustaría crearlo?</h3>
            <div className="dashboard-options">
              <div className="dashboard-card" onClick={async () => {
                if (!newProjectName.trim()) { alert('Por favor, ingresa un nombre para el proyecto.'); return; }
                const { data, error } = await supabase.from('cv_projects').insert({ user_id: user.id, name: newProjectName }).select().single();
                if (error) {
                  alert('Error al crear el proyecto. ¿Ejecutaste el script SQL de la tabla cv_projects en Supabase?\nDetalle: ' + error.message);
                  return;
                }
                if (data) onSelectMode({ mode: 'ia', projectId: data.id });
              }}>
                <div className="card-icon ia-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                <h2>Crear con IA</h2>
                <p>Deja que nuestra Inteligencia Artificial redacte y estructure tu CV automáticamente mediante un chat interactivo.</p>
                <button className="card-btn ia-btn">Iniciar Chat IA</button>
              </div>
              
              <div className="dashboard-card" onClick={async () => {
                if (!newProjectName.trim()) { alert('Por favor, ingresa un nombre para el proyecto.'); return; }
                const { data, error } = await supabase.from('cv_projects').insert({ user_id: user.id, name: newProjectName }).select().single();
                if (error) {
                  alert('Error al crear el proyecto. ¿Ejecutaste el script SQL de la tabla cv_projects en Supabase?\nDetalle: ' + error.message);
                  return;
                }
                if (data) onSelectMode({ mode: 'manual', projectId: data.id });
              }}>
                <div className="card-icon manual-icon"><i className="fa-solid fa-user-pen"></i></div>
                <h2>Crear Manualmente</h2>
                <p>Toma el control total. Ingresa tus datos paso a paso en nuestro editor clásico y personaliza cada detalle.</p>
                <button className="card-btn manual-btn">Ir al Editor</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {/* Success Popup Overlay */}
      {showPopup && (
        <div className="auth-popup-overlay">
          <div className="auth-popup-card">
            <div className="auth-popup-icon">
              <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>check_circle</span>
            </div>
            <h3 className="auth-popup-title">¡Registro Exitoso!</h3>
            <p className="auth-popup-message">
              Tu cuenta ha sido creada. Por favor revisa tu correo electrónico para confirmarla y empezar a diseñar.
            </p>
            <button 
              className="auth-popup-btn"
              onClick={closePopup}
            >
              Comenzar a Crear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

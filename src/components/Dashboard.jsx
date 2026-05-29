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

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoadingDesigns(true);
      
      // Fetch Projects (en lugar de solo el cv principal)
      const { data: projectsData } = await supabase
        .from('cv_projects')
        .select('id, name, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (projectsData) {
        setProjects(projectsData);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h1 className="dashboard-title">¡Bienvenido a CreatorCV!</h1>
                <p className="dashboard-subtitle">Aquí están tus proyectos. ¿En qué vamos a trabajar hoy?</p>
              </div>
              <button 
                className="dashboard-create-btn" 
                onClick={() => setIsCreatingProject(true)}
                style={{ padding: '12px 24px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                <i className="fa-solid fa-plus"></i> Nuevo Proyecto
              </button>
            </div>

            <div className="dashboard-extra-sections">
              <div className="dashboard-extra">
                <h3><i className="fa-solid fa-folder-open"></i> Mis Proyectos</h3>
                {loadingDesigns ? (
                  <div className="extra-empty-state">
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--color-primary)' }}></i>
                    <p>Cargando proyectos...</p>
                  </div>
                ) : projects.length > 0 ? (
                  <div className="dashboard-recent-grid">
                    {projects.map(proj => (
                      <div key={proj.id} className="recent-card" onClick={() => onSelectMode({ mode: 'manual', projectId: proj.id })}>
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
                style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '16px' }}
              />
            </div>
            
            <h3 style={{ marginBottom: '20px' }}>¿Cómo te gustaría crearlo?</h3>
            <div className="dashboard-options">
              <div className="dashboard-card" onClick={async () => {
                if (!newProjectName.trim()) { alert('Por favor, ingresa un nombre para el proyecto.'); return; }
                const { data } = await supabase.from('cv_projects').insert({ user_id: user.id, name: newProjectName }).select().single();
                if (data) onSelectMode({ mode: 'ia', projectId: data.id });
              }}>
                <div className="card-icon ia-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                <h2>Crear con IA</h2>
                <p>Deja que nuestra Inteligencia Artificial redacte y estructure tu CV automáticamente mediante un chat interactivo.</p>
                <button className="card-btn ia-btn">Iniciar Chat IA</button>
              </div>
              
              <div className="dashboard-card" onClick={async () => {
                if (!newProjectName.trim()) { alert('Por favor, ingresa un nombre para el proyecto.'); return; }
                const { data } = await supabase.from('cv_projects').insert({ user_id: user.id, name: newProjectName }).select().single();
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

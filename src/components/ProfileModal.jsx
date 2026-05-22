import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accentThemes, modeThemes, applyTheme, getSavedTheme } from '../utils/theme';
import './ProfileModal.css';

const ProfileModal = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'plans', 'security', 'appearance'
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Apariencia
  const saved = getSavedTheme();
  const [currentAccent, setCurrentAccent] = useState(saved.accent);
  const [currentMode, setCurrentMode] = useState(saved.mode);

  // Datos Básicos
  const [name, setName] = useState(user?.user_metadata?.full_name || 'Usuario Creator');
  const [jobTitle, setJobTitle] = useState('Profesional Creativo');

  // Seguridad
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      if (activeTab === 'appearance') {
        applyTheme(currentAccent, currentMode);
      } else if (activeTab === 'security') {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    }, 1000);
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="profile-tab-content fade-in">
            <h2 className="profile-section-title">Datos Básicos</h2>
            <p className="profile-section-subtitle">Gestiona tu información pública y de contacto.</p>
            
            <div className="profile-form">
              <div className="profile-field">
                <label>Nombre a mostrar</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              
              <div className="profile-field">
                <label>Cargo / Profesión actual</label>
                <input 
                  type="text" 
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="Ej. Desarrollador Frontend"
                />
              </div>

              <div className="profile-field">
                <label>Correo electrónico (solo lectura)</label>
                <input 
                  type="email" 
                  value={user?.email || 'usuario@ejemplo.com'}
                  disabled
                  className="profile-input-disabled"
                />
                <span className="field-hint">Tu correo electrónico se utiliza para el inicio de sesión y no puede modificarse aquí.</span>
              </div>
            </div>
          </div>
        );
      
      case 'plans':
        return (
          <div className="profile-tab-content fade-in">
            <h2 className="profile-section-title">Planes y Suscripción</h2>
            <p className="profile-section-subtitle">Elige el plan que mejor se adapte a tu nivel profesional.</p>

            <div className="plans-grid">
              {/* Basic Plan */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3>Básico</h3>
                  <div className="plan-price">Gratis</div>
                </div>
                <ul className="plan-features">
                  <li><i className="fa-solid fa-check"></i> 1 Plantilla estándar</li>
                  <li><i className="fa-solid fa-check"></i> Exportación PDF con marca de agua</li>
                  <li><i className="fa-solid fa-xmark text-disabled"></i> Redactor IA</li>
                </ul>
                <button className="plan-action-btn plan-btn-outline">Plan Actual</button>
              </div>

              {/* Pro Plan (Highlighted) */}
              <div className="plan-card plan-card-highlight">
                <div className="plan-badge">Recomendado</div>
                <div className="plan-header">
                  <h3>Pro <i className="fa-solid fa-wand-magic-sparkles"></i></h3>
                  <div className="plan-price">$9<span>/mes</span></div>
                </div>
                <ul className="plan-features">
                  <li><i className="fa-solid fa-check"></i> Todas las plantillas ATS</li>
                  <li><i className="fa-solid fa-check"></i> Exportación PDF en alta calidad</li>
                  <li><i className="fa-solid fa-check"></i> Redactor IA Ilimitado</li>
                  <li><i className="fa-solid fa-check"></i> Soporte prioritario</li>
                </ul>
                <button className="plan-action-btn plan-btn-primary">Actualizar a Pro</button>
              </div>

              {/* Enterprise Plan */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3>Vitalicio</h3>
                  <div className="plan-price">$49<span>/pago único</span></div>
                </div>
                <ul className="plan-features">
                  <li><i className="fa-solid fa-check"></i> Beneficios del plan Pro</li>
                  <li><i className="fa-solid fa-check"></i> Acceso de por vida</li>
                  <li><i className="fa-solid fa-check"></i> Nuevas plantillas gratis</li>
                </ul>
                <button className="plan-action-btn plan-btn-outline">Adquirir</button>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="profile-tab-content fade-in">
            <h2 className="profile-section-title">Seguridad</h2>
            <p className="profile-section-subtitle">Actualiza tu contraseña y protege tu cuenta.</p>
            
            <div className="profile-form profile-form-narrow">
              <div className="profile-field">
                <label>Contraseña actual</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="profile-field">
                <label>Nueva contraseña</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div className="profile-field">
                <label>Confirmar nueva contraseña</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
          </div>
        );
      
      case 'appearance':
        return (
          <div className="profile-tab-content fade-in">
            <h2 className="profile-section-title">Apariencia</h2>
            <p className="profile-section-subtitle">Personaliza la luz y el color de CreatorCV.</p>
            
            <h3 className="theme-group-title"><i className="fa-solid fa-circle-half-stroke"></i> Tema Base</h3>
            <div className="theme-grid mode-grid">
              {Object.entries(modeThemes).map(([key, mode]) => (
                <div 
                  key={key} 
                  className={`theme-card ${currentMode === key ? 'active' : ''}`}
                  onClick={() => setCurrentMode(key)}
                  style={{ background: mode.colors['--bg-app'] }}
                >
                  <span style={{ color: mode.colors['--text-on-surface'] }}>{mode.name}</span>
                  {currentMode === key && <i className="fa-solid fa-circle-check" style={{ color: mode.colors['--text-on-surface'] }}></i>}
                </div>
              ))}
            </div>

            <h3 className="theme-group-title" style={{ marginTop: '32px' }}><i className="fa-solid fa-palette"></i> Color de Acento</h3>
            <div className="theme-grid">
              {Object.entries(accentThemes).map(([key, theme]) => (
                <div 
                  key={key} 
                  className={`theme-card ${currentAccent === key ? 'active' : ''}`}
                  onClick={() => setCurrentAccent(key)}
                  style={{ '--theme-preview': theme.colors['--color-primary'] }}
                >
                  <div className="theme-preview-circle"></div>
                  <span>{theme.name}</span>
                  {currentAccent === key && <i className="fa-solid fa-circle-check"></i>}
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal-large" onClick={e => e.stopPropagation()}>
        
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-avatar">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-info">
              <h4>{name}</h4>
              <span>{user?.email}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`sidebar-nav-btn ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              <i className="fa-regular fa-id-badge"></i> Datos Básicos
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('plans')}
            >
              <i className="fa-solid fa-gem"></i> Suscripción
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fa-solid fa-shield-halved"></i> Seguridad
            </button>
            <button 
              className={`sidebar-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <i className="fa-solid fa-palette"></i> Apariencia
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="profile-main">
          <div className="profile-main-header">
            <button className="profile-close-btn" onClick={onClose} title="Cerrar">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="profile-main-scroll">
            {renderContent()}
          </div>

          {/* Footer Action Bar (only for basic, security and appearance) */}
          {['basic', 'security', 'appearance'].includes(activeTab) && (
            <div className="profile-main-footer">
              <button className="profile-save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Guardando...</>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="profile-toast">
            <i className="fa-solid fa-check-circle"></i> Cambios guardados correctamente
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;

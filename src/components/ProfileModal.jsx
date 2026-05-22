import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfileModal.css';

const ProfileModal = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // In a real app, you would fetch these from Supabase metadata
  // Here we just use local state for demonstration
  const [name, setName] = useState(user?.user_metadata?.full_name || 'Usuario Creator');
  const [jobTitle, setJobTitle] = useState('Profesional Creativo');

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h2>{name}</h2>
            <p>{user?.email}</p>
          </div>
          <button className="profile-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="profile-body">
          <div className="profile-section">
            <h3>Datos de la Cuenta</h3>
            
            <div className="profile-field">
              <label>Nombre a mostrar</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div className="profile-field">
              <label>Cargo / Profesión actual</label>
              <input 
                type="text" 
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label>Correo electrónico (solo lectura)</label>
              <input 
                type="email" 
                value={user?.email}
                disabled
                className="profile-input-disabled"
              />
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Suscripción y Plan</h3>
            <div className="profile-plan-card">
              <div className="plan-icon">
                <i className="fa-solid fa-gem"></i>
              </div>
              <div className="plan-info">
                <strong>Plan Pro (Gratuito Beta)</strong>
                <span>Acceso a plantillas ATS y Redactor IA ilimitado.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-footer">
          <button className="profile-logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            Cerrar Sesión
          </button>
          <button className="profile-save-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <><i className="fa-solid fa-circle-notch fa-spin"></i> Guardando...</>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="profile-toast">
            <i className="fa-solid fa-check-circle"></i> Perfil actualizado
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;

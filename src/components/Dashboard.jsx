import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = ({ onSelectMode }) => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = React.useState(() => {
    return sessionStorage.getItem('showSuccessPopup') === 'true';
  });

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
          <div className="user-avatar">{user?.email?.[0].toUpperCase()}</div>
          <span className="user-email">{user?.email}</span>
        </div>
      </div>
      
      <div className="dashboard-content">
        <h1 className="dashboard-title">¡Bienvenido a CreatorCV!</h1>
        <p className="dashboard-subtitle">¿Cómo te gustaría crear tu hoja de vida hoy?</p>
        
        <div className="dashboard-options">
          <div className="dashboard-card" onClick={() => onSelectMode('ia')}>
            <div className="card-icon ia-icon">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h2>Crear con IA</h2>
            <p>Deja que nuestra Inteligencia Artificial redacte y estructure tu CV automáticamente mediante un chat interactivo.</p>
            <button className="card-btn ia-btn">Iniciar Chat IA</button>
          </div>
          
          <div className="dashboard-card" onClick={() => onSelectMode('manual')}>
            <div className="card-icon manual-icon">
              <i className="fa-solid fa-user-pen"></i>
            </div>
            <h2>Crear Manualmente</h2>
            <p>Toma el control total. Ingresa tus datos paso a paso en nuestro editor clásico y personaliza cada detalle.</p>
            <button className="card-btn manual-btn">Ir al Editor</button>
          </div>
        </div>
      </div>

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

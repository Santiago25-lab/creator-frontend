import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        alert('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-main-layout">
      {/* Left Side: Vibrant Creative Visual */}
      <section className="auth-creative-section">
        {/* Abstract Gradient Background Elements */}
        <div className="auth-creative-gradients">
          <div className="gradient-blob gradient-blob-1"></div>
          <div className="gradient-blob gradient-blob-2"></div>
        </div>
        
        <div className="auth-creative-content">
          <div className="auth-creative-image-container">
            <img 
              alt="Creative Professional Collaboration" 
              className="creative-img" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9oV41kxDDjaQqN9xfsvn1kobr2q7JaQptVkbLF6H1iP4qFR0Rlqn3VAiQSaaW-8UVHkndJ1BNEqxnZknaqmLTec0qeRoPPlf1bgSP2xHslBxX3L230yXHkucmnLJgTl7eHjfKlbu3K0JBwCCzwHxPGX7f3CGV229EM2I8jjQJLIVnMS3afONtqGpGXvmsX9bWiQ9r7x_MX_7o5I-mj9XOlnBuKVl_I7TNclwMEx8Kq_yYSzRs6G6OSllNoIrq6F6g8iG5kcNdaTw"
            />
          </div>
          <h1 className="creative-title">
            Impulsa tu carrera con CreatorCV
          </h1>
          <p className="creative-subtitle">
            Diseña el futuro que mereces con herramientas de vanguardia creadas para profesionales creativos.
          </p>
        </div>

        {/* Floating Decorative Badge */}
        <div className="creative-badge">
          <span className="badge-text">Inspiración</span>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="auth-form-section">
        <div className="auth-form-container">
          {/* Top Header & Logo */}
          <div className="auth-header-wrapper">
            <div className="auth-logo-brand">
              <span className="material-symbols-outlined logo-icon">auto_awesome</span>
              <span className="logo-text">CreatorCV</span>
            </div>
            <h2 className="auth-welcome-title">
              {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
            </h2>
            <p className="auth-welcome-subtitle">
              {isLogin ? 'Ingresa tus datos para continuar' : 'Únete para guardar tus diseños en la nube'}
            </p>
          </div>

          {/* Form Card */}
          <div className="auth-card-panel">
            {/* Social Logins */}
            <div className="social-logins-grid">
              <button type="button" className="social-btn">
                <img 
                  alt="Google" 
                  className="social-logo-img" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFG8dq_eWsVGMT-JocSiLczXgT3CuiZ6ELtheKEk0-1F5m4fsteuNQD4fokZkCIv6ZlbnQ8neQ1xYpl9pKeM7SSfZgivmx_9G7FSKJe-j79vQ9HJ3Jr4YH1dtg2ZnVP2gKidwhL2mCN_YK_OQnvM0VGSCCQJlcrBbOkxKle9bXWrF1CHZuT_pVWW1VAfTOm61lWNgrYPhkKscJf2xI6o-JMiSiTs_GnSpWChyF0HpBGLoy-SEZVE2d2Y6fVPbX3UcVaIP0bRMuDAE"
                />
                Google
              </button>
              <button type="button" className="social-btn">
                <span className="material-symbols-outlined social-icon">account_circle</span>
                LinkedIn
              </button>
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <div className="divider-line"></div>
              <span className="divider-text">o ingresa con tu correo</span>
              <div className="divider-line"></div>
            </div>

            {/* Input Fields */}
            <form className="real-auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="input-field-group">
                  <label className="input-label" htmlFor="fullName">Nombre Completo</label>
                  <input 
                    id="fullName"
                    className="auth-input-element" 
                    placeholder="Juan Pérez" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="input-field-group">
                <label className="input-label" htmlFor="email">Correo Electrónico</label>
                <input 
                  id="email"
                  className="auth-input-element" 
                  placeholder="ejemplo@correo.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-field-group">
                <label className="input-label" htmlFor="password">Contraseña</label>
                <div className="password-input-wrapper">
                  <input 
                    id="password"
                    className="auth-input-element" 
                    placeholder="••••••••" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="password-toggle-btn" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {error && <div className="auth-error-message">{error}</div>}

              {/* Utils Row */}
              {isLogin && (
                <div className="auth-utils-row">
                  <label className="remember-me-checkbox">
                    <input className="checkbox-input" type="checkbox"/>
                    <span className="checkbox-label">Recordarme</span>
                  </label>
                  <a className="forgot-password-link" href="#" onClick={(e) => e.preventDefault()}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              {/* CTA Button */}
              <button 
                className="auth-primary-submit-btn" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
              </button>
            </form>
          </div>

          {/* Secondary Actions Footer */}
          <div className="auth-switch-footer">
            <p className="switch-text">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
              <button 
                className="switch-link-btn" 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>

          {/* Legal / Footer Mini */}
          <div className="auth-mini-footer">
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Ayuda</a>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Privacidad</a>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Términos</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;

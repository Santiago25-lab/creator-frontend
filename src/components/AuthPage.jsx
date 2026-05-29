import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const { signIn, signUp } = useAuth();

  const commonPasswords = new Set(['12345678', 'password', 'qwertyui', 'admin123', '123456789', 'password123', '11111111', '12345678aA!', 'Password123!']);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'transparent', checks: { length: false, upper: false, lower: false, num: false, spec: false } };
    
    const checks = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      num: /[0-9]/.test(pwd),
      spec: /[^A-Za-z0-9]/.test(pwd)
    };
    
    const score = Object.values(checks).filter(Boolean).length;

    let text = 'Débil';
    let color = '#ef4444';
    if (score >= 3 && score < 5) { text = 'Media'; color = '#f59e0b'; }
    if (score === 5) { text = 'Fuerte'; color = '#10b981'; }

    return { score, text, color, checks };
  };

  const handleOAuth = async (provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Prevenir inyecciones XSS / caracteres no deseados en registro y controlar longitudes
    if (!isLogin) {
      if (fullName.length > 50) return setError("El nombre no puede exceder 50 caracteres.");
      if (/[<>{}[\]\\]/.test(fullName)) return setError("El nombre contiene caracteres inválidos.");
      if (email.length > 100) return setError("El correo es demasiado largo.");
      if (commonPasswords.has(password.toLowerCase()) || commonPasswords.has(password)) {
        return setError("Esa contraseña es demasiado común. Por favor, elige una más segura.");
      }
      
      const pwdStatus = getPasswordStrength(password);
      if (pwdStatus.score < 5) {
        return setError("Tu contraseña aún no cumple todos los requisitos de seguridad.");
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        sessionStorage.setItem('showSuccessPopup', 'true');
        setShowSuccessPopup(true);
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
          <div className="auth-header-wrapper" style={{ paddingTop: '10px' }}>
            <div className="auth-logo-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="material-symbols-outlined logo-icon" style={{ color: 'var(--color-primary)', fontSize: '28px', background: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '10px' }}>auto_awesome</span>
              <span className="logo-text" style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, var(--color-primary), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px', margin: 0 }}>CreatorCV</span>
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
              <button type="button" className="social-btn" onClick={() => handleOAuth('google')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '500' }}>
                <i className="fa-brands fa-google" style={{ color: '#ea4335', fontSize: '18px' }}></i>
                Google
              </button>
              <button type="button" className="social-btn" onClick={() => handleOAuth('linkedin_oidc')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '500' }}>
                <i className="fa-brands fa-linkedin" style={{ color: '#0a66c2', fontSize: '18px' }}></i>
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
                    maxLength={50}
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
                  maxLength={100}
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
                    maxLength={100}
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
                {/* Evaluador de Contraseña Descriptivo */}
                {!isLogin && password.length > 0 && (() => {
                  const strength = getPasswordStrength(password);
                  const { checks } = strength;
                  return (
                    <div style={{ marginTop: '12px', fontSize: '12px', fontWeight: '500', background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '12px' }}>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div key={level} style={{ flex: 1, background: level <= strength.score ? strength.color : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'all 0.3s' }}></div>
                        ))}
                      </div>
                      <div style={{ color: strength.color, fontWeight: 'bold', marginBottom: '10px', fontSize: '13px' }}>Seguridad: {strength.text}</div>
                      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-dim)' }}>
                        <li style={{ color: checks.length ? '#10b981' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className={`fa-solid ${checks.length ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 8 o más caracteres
                        </li>
                        <li style={{ color: checks.upper ? '#10b981' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className={`fa-solid ${checks.upper ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 1 letra mayúscula
                        </li>
                        <li style={{ color: checks.lower ? '#10b981' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className={`fa-solid ${checks.lower ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 1 letra minúscula
                        </li>
                        <li style={{ color: checks.num ? '#10b981' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className={`fa-solid ${checks.num ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 1 número
                        </li>
                        <li style={{ color: checks.spec ? '#10b981' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className={`fa-solid ${checks.spec ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 1 símbolo (ej. !@#$)
                        </li>
                      </ul>
                    </div>
                  );
                })()}
              </div>

              {error && <div className="auth-error-message" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}

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

      {/* Success Popup Overlay */}
      {showSuccessPopup && (
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
              onClick={() => {
                setShowSuccessPopup(false);
                sessionStorage.removeItem('showSuccessPopup');
                setIsLogin(true);
              }}
            >
              Continuar al Login
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AuthPage;

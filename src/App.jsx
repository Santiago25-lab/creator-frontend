import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import CVTemplate from './CVTemplate'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import { applyTheme, getSavedTheme } from './utils/theme'

function AppContent() {
  const { user, loading } = useAuth();
  const [selectedMode, setSelectedMode] = useState(null);

  useEffect(() => {
    // Apply saved theme on mount
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme.accent, savedTheme.mode);

    // Limpiar hash residual si se recarga la página
    if (window.location.hash === '#project') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Navegación con botones del navegador
    const handlePopState = (event) => {
      if (event.state && event.state.modeData) {
        setSelectedMode(event.state.modeData);
      } else {
        setSelectedMode(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectMode = (modeData) => {
    window.history.pushState({ modeData }, '', '#project');
    setSelectedMode(modeData);
  };

  const handleBack = () => {
    if (window.location.hash === '#project') {
      window.history.back(); // Esto disparará el popstate y seteará el modo en null
    } else {
      setSelectedMode(null);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0f172a', 
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div className="app__loading-spinner" style={{ marginBottom: '20px' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '32px', color: '#3b82f6' }}></i>
        </div>
        <p>Iniciando CreatorCV...</p>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Verificando sesión segura</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (selectedMode) {
    const isObj = typeof selectedMode === 'object';
    const mode = isObj ? selectedMode.mode : selectedMode;
    const initialDesign = isObj ? selectedMode.design : null;
    const projectId = isObj ? selectedMode.projectId : null;
    
    return (
      <CVTemplate 
        initialTab={mode === 'ia' ? 'chat' : 'editor'} 
        initialDesign={initialDesign} 
        projectId={projectId}
        onBack={handleBack} 
      />
    );
  }

  return <Dashboard onSelectMode={handleSelectMode} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

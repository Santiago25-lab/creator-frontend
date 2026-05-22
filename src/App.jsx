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
  }, []);

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
    return <CVTemplate initialTab={selectedMode === 'ia' ? 'chat' : 'editor'} onBack={() => setSelectedMode(null)} />;
  }

  return <Dashboard onSelectMode={setSelectedMode} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

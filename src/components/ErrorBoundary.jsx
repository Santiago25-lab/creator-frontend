import React from 'react';

/**
 * ErrorBoundary — Componente que captura errores en sus hijos y muestra una UI de respaldo.
 * Evita que toda la aplicación se caiga por un error en un componente específico (ej: un template).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '8px',
          color: '#991b1b',
          margin: '20px',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Algo salió mal</h2>
          <p style={{ fontSize: '0.9rem' }}>El componente no pudo cargarse correctamente. Intenta refrescar la página.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#991b1b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

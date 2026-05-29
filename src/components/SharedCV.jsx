import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CVPreview from '../templates/engine/CVPreview';
import './SharedCV.css';

const SharedCV = ({ projectId }) => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const { data, error: sbError } = await supabase
          .from('cv_projects')
          .select('content')
          .eq('id', projectId)
          .maybeSingle();

        if (sbError) throw sbError;
        if (!data || !data.content) throw new Error('CV no encontrado');

        setCvData(data.content);
      } catch (err) {
        setError(err.message || 'No se pudo cargar este currículum. Es posible que sea privado o el enlace sea incorrecto.');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [projectId]);

  if (loading) {
    return (
      <div className="shared-cv-loading">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
        <p>Cargando currículum...</p>
      </div>
    );
  }

  if (error || !cvData) {
    return (
      <div className="shared-cv-error">
        <i className="fa-solid fa-file-circle-xmark"></i>
        <h2>¡Ups! Algo salió mal</h2>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/'}>Ir a CreatorCV</button>
      </div>
    );
  }

  return (
    <div className="shared-cv-container">
      {/* Barra superior de promoción */}
      <div className="shared-cv-promo">
        <div className="promo-brand">
          <i className="fa-solid fa-file-signature"></i> CreatorCV
        </div>
        <div className="promo-text">
          Este currículum fue creado con CreatorCV. ¡Destaca profesionalmente!
        </div>
        <button className="promo-btn" onClick={() => window.location.href = '/'}>
          Crear mi CV Gratis
        </button>
      </div>

      {/* Visor del CV centrado */}
      <div className="shared-cv-viewer">
        <CVPreview 
          data={cvData} 
          design={cvData.recipe} 
          activeTemplate={cvData.activeTemplate || 'modern'} 
          zoom={1}
        />
      </div>
    </div>
  );
};

export default SharedCV;

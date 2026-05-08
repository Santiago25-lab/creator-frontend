import React from 'react';
import './DynamicAITemplate.css';

const DynamicAITemplate = ({ cvData, settings }) => {
  const { customHTML, customCSS } = settings;

  if (!customHTML || !customCSS) {
    return <div style={{ color: 'white', padding: '20px' }}>Sube una imagen para generar una plantilla idéntica...</div>;
  }

  // Función para inyectar datos en el HTML de la IA
  const renderIdenticalCV = () => {
    let finalHTML = customHTML;

    // Reemplazos básicos
    finalHTML = finalHTML.replace(/{{name}}/g, cvData?.personalInfo?.name || '');
    finalHTML = finalHTML.replace(/{{title}}/g, cvData?.personalInfo?.title || '');
    finalHTML = finalHTML.replace(/{{email}}/g, cvData?.personalInfo?.email || '');
    finalHTML = finalHTML.replace(/{{phone}}/g, cvData?.personalInfo?.phone || '');
    finalHTML = finalHTML.replace(/{{address}}/g, cvData?.personalInfo?.address || '');
    finalHTML = finalHTML.replace(/{{aboutMe}}/g, cvData?.personalInfo?.aboutMe || '');

    // Reemplazo de listas (esto es más complejo, la IA debe generar una estructura simple)
    const experienceHTML = cvData?.experience?.map(exp => `
      <div class="exp-item">
        <strong>${exp.title}</strong> (${exp.period})
        <p>${exp.description}</p>
      </div>
    `).join('') || '';
    finalHTML = finalHTML.replace(/{{experience}}/g, experienceHTML);

    const educationHTML = cvData?.education?.map(edu => `
      <div class="edu-item">
        <strong>${edu.degree}</strong> - ${edu.institution} (${edu.period})
      </div>
    `).join('') || '';
    finalHTML = finalHTML.replace(/{{education}}/g, educationHTML);

    const skillsHTML = cvData?.skills?.map(s => `<span class="skill-tag">${s}</span>`).join(' ') || '';
    finalHTML = finalHTML.replace(/{{skills}}/g, skillsHTML);

    const languagesHTML = cvData?.languages?.map(l => `<span>${l}</span>`).join(', ') || '';
    finalHTML = finalHTML.replace(/{{languages}}/g, languagesHTML);

    return finalHTML;
  };

  return (
    <div className="identical-clone-wrapper">
      <style>{customCSS}</style>
      <div 
        dangerouslySetInnerHTML={{ __html: renderIdenticalCV() }} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default DynamicAITemplate;

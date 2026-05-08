import React from 'react';
import '../CVTemplate.css'; // Mantiene los estilos originales de tu diseño actual

const ModernTemplate = ({ cvData, settings }) => {
  const primaryStyle = { color: settings.primaryColor };
  const borderStyle = { borderColor: settings.primaryColor };
  const bgStyle = { backgroundColor: settings.primaryColor };

  return (
    <div className="cv-container" style={{ borderRadius: settings.borderRadius }}>
      {/* Left Sidebar */}
      <div className="sidebar" style={{ borderRight: `4px solid ${settings.primaryColor}` }}>
        
        <div className="profile-section">
          <div className="profile-picture" style={{ borderColor: settings.primaryColor }}>
            <img src={`https://ui-avatars.com/api/?name=${cvData?.personalInfo?.name}&background=random&size=150`} alt="Profile" />
          </div>
        </div>

        <div className="sidebar-section">
          <h2 className="sidebar-title" style={primaryStyle}>CONTACTO</h2>
          <div className="sidebar-divider" style={bgStyle}></div>
          <div className="contact-item"><span className="icon" style={primaryStyle}>📞</span><span>{cvData?.personalInfo?.phone}</span></div>
          <div className="contact-item"><span className="icon" style={primaryStyle}>✉️</span><span>{cvData?.personalInfo?.email}</span></div>
          <div className="contact-item"><span className="icon" style={primaryStyle}>👤</span><span>Identificación: {cvData?.personalInfo?.idNumber}</span></div>
          <div className="contact-item"><span className="icon" style={primaryStyle}>📍</span><span>{cvData?.personalInfo?.address}</span></div>
        </div>

        <div className="sidebar-section">
          <h2 className="sidebar-title" style={primaryStyle}>REFERENCIAS</h2>
          <div className="sidebar-divider" style={bgStyle}></div>
          {cvData?.references?.map((ref, i) => (
            <div className="reference-item" key={i}>
              <span className="icon" style={primaryStyle}>👤</span>
              <div className="reference-details">
                <strong style={primaryStyle}>{ref?.name}</strong>
                <div>{ref?.company}</div>
                <div>{ref?.phone}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-section">
          <h2 className="sidebar-title" style={primaryStyle}>SITIO WEB</h2>
          <div className="sidebar-divider" style={bgStyle}></div>
          <div className="website-link" style={primaryStyle}>{cvData?.personalInfo?.website}</div>
        </div>
      </div>

      {/* Right Main Content */}
      <div className="main-content">
        <div className="header-section">
          <h1 style={primaryStyle}>{cvData?.personalInfo?.name}</h1>
          <h3>{cvData?.personalInfo?.title}</h3>
          <div className="main-divider-top" style={bgStyle}></div>
        </div>

        <div className="content-section">
          <h2 className="section-title" style={primaryStyle}>SOBRE MÍ</h2>
          <p>{cvData?.personalInfo?.aboutMe}</p>
          <div className="main-divider" style={bgStyle}></div>
        </div>

        <div className="content-section">
          <h2 className="section-title" style={primaryStyle}>EXPERIENCIA</h2>
          {cvData?.experience?.map((exp, i) => (
            <div className="experience-item" key={i}>
              <h4 style={primaryStyle}>{exp?.period} - {exp?.title}</h4>
              <p>{exp?.description}</p>
            </div>
          ))}
          <div className="main-divider" style={bgStyle}></div>
        </div>

        <div className="content-section">
          <h2 className="section-title" style={primaryStyle}>EDUCACIÓN</h2>
          {cvData?.education?.map((edu, i) => (
            <div className="education-item" key={i}>
              <h4 style={primaryStyle}>{edu?.period} - {edu?.degree}</h4>
              <p>{edu?.institution}</p>
            </div>
          ))}
          <div className="main-divider" style={bgStyle}></div>
        </div>

        <div className="bottom-sections">
          <div className="skills-section">
            <h2 className="section-title" style={primaryStyle}>HABILIDADES</h2>
            <div className="skills-grid">
              <div className="skill-col">
                {cvData?.skills?.slice(0, Math.ceil((cvData?.skills?.length || 0) / 2)).map((skill, i) => (
                  <div key={i} style={{ borderLeft: `3px solid ${settings?.primaryColor}`, paddingLeft: '8px', marginBottom: '5px' }}>{skill}</div>
                ))}
              </div>
              <div className="skill-col">
                {cvData?.skills?.slice(Math.ceil((cvData?.skills?.length || 0) / 2)).map((skill, i) => (
                  <div key={i} style={{ borderLeft: `3px solid ${settings?.primaryColor}`, paddingLeft: '8px', marginBottom: '5px' }}>{skill}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;

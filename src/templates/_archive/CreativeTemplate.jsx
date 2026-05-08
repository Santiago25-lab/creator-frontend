import React from 'react';
import './CreativeTemplate.css';

const CreativeTemplate = ({ cvData, settings }) => {
  const neonStyle = { 
    background: `linear-gradient(to right, ${settings?.primaryColor}, #ffffff)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  return (
    <div className="creative-cv-wrapper" style={{ borderRadius: settings?.borderRadius, fontFamily: settings?.fontFamily }}>
      <div className="creative-glass-container" style={{ borderRadius: settings?.borderRadius }}>
        
        {/* Header Section */}
        <header className="creative-header" style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
          <div className="header-info">
            <h1 className="neon-text" style={neonStyle}>{cvData?.personalInfo?.name}</h1>
            <h3 className="creative-title" style={{ color: settings?.primaryColor }}>{cvData?.personalInfo?.title}</h3>
            <p className="creative-bio">{cvData?.personalInfo?.aboutMe}</p>
          </div>
          <div className="header-contact">
            <div className="contact-pill"><span>📍</span> {cvData?.personalInfo?.address}</div>
            <div className="contact-pill"><span>✉️</span> {cvData?.personalInfo?.email}</div>
            <div className="contact-pill"><span>📞</span> {cvData?.personalInfo?.phone}</div>
          </div>
        </header>

        <main className="creative-content">
          
          {/* Left Column */}
          <div className="creative-left">
            <section className="creative-section">
              <h2 className="creative-section-title" style={{ color: settings?.primaryColor }}>EXPERIENCIA</h2>
              <div className="timeline" style={{ borderLeftColor: `${settings?.primaryColor}44` }}>
                {cvData?.experience?.map((exp, i) => (
                  <div className="timeline-item" key={i}>
                    <div className="timeline-dot" style={{ backgroundColor: settings?.primaryColor, boxShadow: `0 0 10px ${settings?.primaryColor}` }}></div>
                    <div className="timeline-content">
                      <h4>{exp?.title}</h4>
                      <span className="timeline-date" style={{ color: settings?.primaryColor }}>{exp?.period}</span>
                      <p>{exp?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="creative-section">
              <h2 className="creative-section-title" style={{ color: settings?.primaryColor }}>EDUCACIÓN</h2>
              {cvData?.education?.map((edu, i) => (
                <div className="edu-card" key={i}>
                  <h4>{edu?.degree}</h4>
                  <p>{edu?.institution}</p>
                  <span className="edu-date" style={{ color: settings?.primaryColor }}>{edu?.period}</span>
                </div>
              ))}
            </section>
          </div>

          {/* Right Column */}
          <div className="creative-right">
            <section className="creative-section">
              <h2 className="creative-section-title" style={{ color: settings?.primaryColor }}>HABILIDADES</h2>
              <div className="creative-skills-grid">
                {cvData?.skills?.map((skill, i) => (
                  <div className="skill-tag" key={i} style={{ backgroundColor: `${settings?.primaryColor}22`, borderColor: `${settings?.primaryColor}44` }}>{skill}</div>
                ))}
              </div>
            </section>

            <section className="creative-section">
              <h2 className="creative-section-title" style={{ color: settings?.primaryColor }}>IDIOMAS</h2>
              <div className="creative-langs">
                {cvData?.languages?.map((lang, i) => (
                  <div className="lang-bar" key={i}>
                    <span>{lang}</span>
                    <div className="progress-bg"><div className="progress-fill" style={{width: i === 0 ? '100%' : '80%', background: `linear-gradient(to right, ${settings?.primaryColor}, #fff)`, boxShadow: `0 0 10px ${settings?.primaryColor}`}}></div></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="creative-section">
              <h2 className="creative-section-title" style={{ color: settings?.primaryColor }}>REFERENCIAS</h2>
              {cvData?.references?.map((ref, i) => (
                <div className="ref-glass-card" key={i}>
                  <strong>{ref?.name}</strong>
                  <p>{ref?.company}</p>
                  <span style={{ color: settings?.primaryColor }}>{ref?.phone}</span>
                </div>
              ))}
            </section>
          </div>

        </main>
      </div>
    </div>
  );
};

export default CreativeTemplate;

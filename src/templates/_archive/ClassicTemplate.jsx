import React from 'react';
import './ClassicTemplate.css';

const ClassicTemplate = ({ cvData, settings }) => {
  const primaryStyle = { color: settings?.primaryColor };

  return (
    <div className="classic-cv-container" style={{ borderTop: `8px solid ${settings?.primaryColor}`, borderRadius: settings?.borderRadius, fontFamily: settings?.fontFamily }}>
      <header className="classic-header">
        <h1 style={primaryStyle}>{cvData?.personalInfo?.name}</h1>
        <h2>{cvData?.personalInfo?.title}</h2>
        <div className="classic-contact-info">
          <span>{cvData?.personalInfo?.email}</span> | 
          <span>{cvData?.personalInfo?.phone}</span> | 
          <span>{cvData?.personalInfo?.address}</span> |
          <span>{cvData?.personalInfo?.website}</span>
        </div>
      </header>

      <div className="classic-main">
        <section className="classic-section">
          <h3 style={primaryStyle}>PERFIL PROFESIONAL</h3>
          <hr style={{ backgroundColor: settings?.primaryColor }} />
          <p>{cvData?.personalInfo?.aboutMe}</p>
        </section>

        <section className="classic-section">
          <h3 style={primaryStyle}>EXPERIENCIA LABORAL</h3>
          <hr style={{ backgroundColor: settings?.primaryColor }} />
          {cvData?.experience?.map((exp, i) => (
            <div className="classic-item" key={i}>
              <div className="classic-item-header">
                <strong style={primaryStyle}>{exp?.title}</strong>
                <span className="classic-period">{exp?.period}</span>
              </div>
              <p>{exp?.description}</p>
            </div>
          ))}
        </section>

        <section className="classic-section">
          <h3 style={primaryStyle}>EDUCACIÓN</h3>
          <hr style={{ backgroundColor: settings?.primaryColor }} />
          {cvData?.education?.map((edu, i) => (
            <div className="classic-item" key={i}>
              <div className="classic-item-header">
                <strong style={primaryStyle}>{edu?.degree}</strong>
                <span className="classic-period">{edu?.period}</span>
              </div>
              <p>{edu?.institution}</p>
            </div>
          ))}
        </section>

        <div className="classic-two-cols">
          <section className="classic-section">
            <h3 style={primaryStyle}>HABILIDADES</h3>
            <hr style={{ backgroundColor: settings?.primaryColor }} />
            <ul className="classic-list">
              {cvData?.skills?.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>

          <section className="classic-section">
            <h3 style={primaryStyle}>IDIOMAS</h3>
            <hr style={{ backgroundColor: settings?.primaryColor }} />
            <ul className="classic-list">
              {cvData?.languages?.map((lang, i) => (
                <li key={i}>{lang}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="classic-section">
          <h3 style={primaryStyle}>REFERENCIAS</h3>
          <hr style={{ backgroundColor: settings?.primaryColor }} />
          <div className="classic-references">
            {cvData?.references?.map((ref, i) => (
              <div className="classic-ref-item" key={i}>
                <strong>{ref?.name}</strong>
                <p>{ref?.company}</p>
                <p>{ref?.phone}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClassicTemplate;

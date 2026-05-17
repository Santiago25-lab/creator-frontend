import React from 'react';
import './ResumeC.css';

/**
 * ResumeC — "Elegant Serif"
 * Editorial. Ejecutivo. Fuente Lora.
 * Dos columnas: perfil+skills a la izquierda, experiencia a la derecha.
 */
const ResumeC = ({ data }) => {
  const { personalInfo, experience, education, skills, languages } = data;

  return (
    <div className="resume-c">
      <div className="resume-c__inner">

        {/* ═══ HEADER ELEGANTE ═══ */}
        <header className="resume-c__header">
          {personalInfo.photo && (
            <div 
              className="resume-c__photo" 
              style={{ backgroundImage: `url(${personalInfo.photo})` }}
              aria-label={personalInfo.name}
            />
          )}
          <h1 className="resume-c__name">{personalInfo.name}</h1>
          <div className="resume-c__divider" />
          <p className="resume-c__title">{personalInfo.title}</p>
          <div className="resume-c__contact">
            {personalInfo.email && (
              <span className="resume-c__contact-item">
                <i className="fa-solid fa-envelope" /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="resume-c__contact-item">
                <i className="fa-solid fa-phone" /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.address && (
              <span className="resume-c__contact-item">
                <i className="fa-solid fa-location-dot" /> {personalInfo.address}
              </span>
            )}
          </div>
        </header>

        {/* ═══ BODY: DOS COLUMNAS ═══ */}
        <div className="resume-c__body">

          {/* COLUMNA IZQUIERDA */}
          <div className="resume-c__left">
            {/* Perfil */}
            {personalInfo.aboutMe && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Sumario</h2>
                <p className="resume-c__about">{personalInfo.aboutMe}</p>
              </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Expertise</h2>
                {skills.map((s, i) => (
                  <div key={i} className="resume-c__skill-item">
                    <div className="resume-c__skill-dot" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Idiomas */}
            {languages && languages.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Idiomas</h2>
                {languages.map((l, i) => (
                  <div key={i} className="resume-c__lang-item">{l}</div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div>
            {/* Experiencia */}
            {experience && experience.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Trayectoria</h2>
                {experience.map((exp, i) => (
                  <div key={i} className="resume-c__exp-item">
                    <div className="resume-c__exp-header">
                      <h4 className="resume-c__exp-role">{exp.title}</h4>
                      <span className="resume-c__exp-period">{exp.period}</span>
                    </div>
                    <p className="resume-c__exp-desc">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Educación */}
            {education && education.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Formación</h2>
                {education.map((edu, i) => (
                  <div key={i} className="resume-c__edu-item">
                    <h4 className="resume-c__edu-degree">{edu.degree}</h4>
                    <div className="resume-c__edu-meta">
                      <span>{edu.institution}</span>
                      <span>{edu.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>{/* fin resume-c__body */}

      </div>{/* fin resume-c__inner */}
    </div>
  );
};

export default ResumeC;

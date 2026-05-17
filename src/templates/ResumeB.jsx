import React from 'react';
import './ResumeB.css';

/**
 * ResumeB — "Clean Minimal"
 * Centrada. Sin sidebar. ATS-friendly al máximo.
 * Datos entran → CV profesional sale.
 */
const ResumeB = ({ data }) => {
  const { personalInfo, experience, education, skills, languages } = data;

  return (
    <div className="resume-b">

      {/* ═══ HEADER CENTRADO ═══ */}
      <header className="resume-b__header">
        {personalInfo.photo && (
          <img
            className="resume-b__photo"
            src={personalInfo.photo}
            alt={personalInfo.name || 'Foto de perfil'}
          />
        )}
        <h1 className="resume-b__name">{personalInfo.name}</h1>
        <p className="resume-b__title">{personalInfo.title}</p>
        <div className="resume-b__contact">
          {personalInfo.email && (
            <span className="resume-b__contact-item">
              <i className="fa-solid fa-envelope" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="resume-b__contact-item">
              <i className="fa-solid fa-phone" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.address && (
            <span className="resume-b__contact-item">
              <i className="fa-solid fa-location-dot" /> {personalInfo.address}
            </span>
          )}
          {personalInfo.website && (
            <span className="resume-b__contact-item">
              <i className="fa-solid fa-globe" /> {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      {/* ═══ PERFIL ═══ */}
      {personalInfo.aboutMe && (
        <section className="resume-b__section">
          <h2 className="resume-b__section-title">Perfil Profesional</h2>
          <p className="resume-b__about">{personalInfo.aboutMe}</p>
        </section>
      )}

      {/* ═══ EXPERIENCIA ═══ */}
      {experience && experience.length > 0 && (
        <section className="resume-b__section">
          <h2 className="resume-b__section-title">Experiencia</h2>
          {experience.map((exp, i) => (
            <div key={i} className="resume-b__exp-item">
              <div className="resume-b__exp-header">
                <h4 className="resume-b__exp-role">{exp.title}</h4>
                <span className="resume-b__exp-period">{exp.period}</span>
              </div>
              <p className="resume-b__exp-desc">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ═══ EDUCACIÓN + SKILLS (dos columnas) ═══ */}
      <div className="resume-b__two-col">
        {/* Educación */}
        {education && education.length > 0 && (
          <section className="resume-b__section">
            <h2 className="resume-b__section-title">Educación</h2>
            {education.map((edu, i) => (
              <div key={i} className="resume-b__edu-item">
                <h4 className="resume-b__edu-degree">{edu.degree}</h4>
                <div className="resume-b__edu-meta">
                  <span>{edu.institution}</span>
                  <span>{edu.period}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills + Languages */}
        <div>
          {skills && skills.length > 0 && (
            <section className="resume-b__section">
              <h2 className="resume-b__section-title">Habilidades</h2>
              <div className="resume-b__skills-grid">
                {skills.map((s, i) => (
                  <span key={i} className="resume-b__skill">{s}</span>
                ))}
              </div>
            </section>
          )}

          {languages && languages.length > 0 && (
            <section className="resume-b__section" style={{ marginTop: '24px' }}>
              <h2 className="resume-b__section-title">Idiomas</h2>
              {languages.map((l, i) => (
                <span key={i} className="resume-b__skill">{l}</span>
              ))}
            </section>
          )}
        </div>
      </div>

    </div>
  );
};

export default ResumeB;

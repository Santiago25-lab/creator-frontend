import React from 'react';
import './ResumeA.css';

/**
 * ResumeA — "Professional Sidebar"
 * 
 * Plantilla pura: recibe datos JSON → renderiza CV.
 * Sin react-rnd, sin SmartLayer, sin magia.
 * Simplemente HTML + CSS + datos.
 */
const ResumeA = ({ data }) => {
  const { personalInfo, experience, education, skills, languages } = data;

  return (
    <div className="resume-a">

      {/* ═══ SIDEBAR ═══ */}
      <aside className="resume-a__sidebar">
        <img
          className="resume-a__photo"
          src={personalInfo.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&size=200&background=1e293b&color=60a5fa&bold=true`}
          alt={personalInfo.name || 'Foto de perfil'}
        />

        {/* Contacto */}
        <div>
          <h3>Contacto</h3>
          {personalInfo.email && (
            <div className="resume-a__contact-item">
              <i className="fa-solid fa-envelope" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="resume-a__contact-item">
              <i className="fa-solid fa-phone" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="resume-a__contact-item">
              <i className="fa-solid fa-location-dot" />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="resume-a__contact-item">
              <i className="fa-solid fa-globe" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Habilidades */}
        {skills && skills.length > 0 && (
          <div>
            <h3>Habilidades</h3>
            <div>
              {skills.map((s, i) => (
                <span key={i} className="resume-a__skill-tag">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {languages && languages.length > 0 && (
          <div>
            <h3>Idiomas</h3>
            {languages.map((l, i) => (
              <div key={i} className="resume-a__lang-item">
                <span>{l}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ═══ CUERPO PRINCIPAL ═══ */}
      <main className="resume-a__body">
        {/* Header */}
        <div>
          <h1 className="resume-a__name">{personalInfo.name}</h1>
          <p className="resume-a__title">{personalInfo.title}</p>
        </div>

        {/* Perfil / About Me */}
        {personalInfo.aboutMe && (
          <p className="resume-a__about">{personalInfo.aboutMe}</p>
        )}

        {/* Experiencia */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="resume-a__section-title">Experiencia</h2>
            {experience.map((exp, i) => (
              <div key={i} className="resume-a__exp-item">
                <div className="resume-a__exp-header">
                  <h4 className="resume-a__exp-role">{exp.title}</h4>
                  <span className="resume-a__exp-period">{exp.period}</span>
                </div>
                <p className="resume-a__exp-desc">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Educación */}
        {education && education.length > 0 && (
          <section>
            <h2 className="resume-a__section-title">Educación</h2>
            {education.map((edu, i) => (
              <div key={i} className="resume-a__edu-item">
                <h4 className="resume-a__edu-degree">{edu.degree}</h4>
                <div className="resume-a__edu-meta">
                  <span>{edu.institution}</span>
                  <span>{edu.period}</span>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

    </div>
  );
};

export default ResumeA;

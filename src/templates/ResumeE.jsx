import React from 'react';
import './ResumeE.css';

/**
 * ResumeE — "Warm Creative"
 * Inspirado en el diseño de Maryam.
 * Granate + crema. Foto enmarcada. Saludo display grande.
 * Educación y skills en columna izquierda granate.
 * Experiencia en card con borde, idiomas e intereses en crema.
 */
const ResumeE = ({ data }) => {
  const { personalInfo, experience, education, skills, languages } = data;

  // Separa "Idioma (Nivel)" → { name, level }
  const splitLang = (lang) => {
    const match = lang.match(/^(.+?)\s*\((.+)\)$/);
    if (match) return { name: match[1].trim(), level: match[2].trim() };
    return { name: lang, level: '' };
  };

  // Nombre dividido para el saludo "Hello, I'm [Nombre]!"
  const firstName = personalInfo.name?.split(' ')[0] || 'Tú';

  // Año actual para el badge
  const currentYear = new Date().getFullYear();

  return (
    <div className="resume-e">

      {/* Marca esquinas */}
      <div className="resume-e__mark">
        <span>✦ CV</span>
      </div>
      <div className="resume-e__role-badge">
        {personalInfo.title || 'Profesional'}
      </div>

      {/* ═══ COLUMNA IZQUIERDA ═══ */}
      <div className="resume-e__left">

        {/* Foto enmarcada */}
        <div className="resume-e__photo-wrap">
          {personalInfo.photo
            ? <img className="resume-e__photo" src={personalInfo.photo} alt={personalInfo.name} />
            : (
              <div className="resume-e__photo-placeholder">
                <i className="fa-solid fa-camera" />
                <span>Foto</span>
              </div>
            )
          }
          <div className="resume-e__photo-frame" />
        </div>

        {/* Name + Year badges */}
        <div className="resume-e__name-badge">{personalInfo.name || 'Tu Nombre'}</div>
        <div className="resume-e__year-badge">{currentYear}</div>

        {/* Contacto */}
        <div>
          <h3 className="resume-e__contact-title">Contacto</h3>
          {personalInfo.phone && (
            <div className="resume-e__contact-item">
              <i className="fa-solid fa-phone" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="resume-e__contact-item">
              <i className="fa-solid fa-location-dot" />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="resume-e__contact-item">
              <i className="fa-solid fa-envelope" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="resume-e__contact-item">
              <i className="fa-solid fa-globe" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Educación */}
        {education && education.length > 0 && (
          <div>
            <h2 className="resume-e__left-section-title">Educación</h2>
            {education.map((edu, i) => (
              <div key={i} className="resume-e__edu-item">
                <span className="resume-e__edu-diamond">✦</span>
                <div>
                  {edu.period && <p className="resume-e__edu-period">{edu.period}</p>}
                  <p className="resume-e__edu-degree">{edu.degree}</p>
                  {edu.institution && (
                    <p className="resume-e__edu-institution">{edu.institution}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Technical Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className="resume-e__left-section-title">Habilidades Técnicas</h2>
            <div className="resume-e__skills-grid">
              {skills.map((s, i) => (
                <span key={i} className="resume-e__skill-pill">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills → usamos aboutMe como resumen si no hay sección específica */}
        {personalInfo.aboutMe && (
          <div>
            <h2 className="resume-e__left-section-title">Habilidades Blandas</h2>
            <p className="resume-e__soft-skills">{personalInfo.aboutMe}</p>
          </div>
        )}

      </div>

      {/* ═══ COLUMNA DERECHA ═══ */}
      <div className="resume-e__right">

        {/* Saludo grande */}
        <h1 className="resume-e__hello">
          ¡Hola, soy {firstName}!
          <span className="resume-e__hello-star">✦</span>
        </h1>

        {/* About en quotes */}
        {personalInfo.aboutMe && (
          <p className="resume-e__about">"{personalInfo.aboutMe}"</p>
        )}

        {/* Experiencia en card */}
        {experience && experience.length > 0 && (
          <div className="resume-e__exp-card">
            <h2 className="resume-e__right-section-title">Experiencia</h2>
            {experience.map((exp, i) => (
              <div key={i} className="resume-e__exp-item">
                <span className="resume-e__exp-diamond">✦</span>
                <div>
                  <strong>{exp.title}</strong>
                  {exp.period && <span style={{ color: '#999', fontSize: '10px', marginLeft: '8px' }}>{exp.period}</span>}
                  {exp.description && <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#555', lineHeight: '1.6' }}>{exp.description}</p>}
                </div>
              </div>
            ))}
            {/* Tags de habilidades clave */}
            {skills && skills.length > 0 && (
              <div className="resume-e__exp-tags">
                {skills.slice(0, 4).map((s, i) => (
                  <span key={i} className="resume-e__exp-tag">{s}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Idiomas */}
        {languages && languages.length > 0 && (
          <div>
            <h2 className="resume-e__right-section-title">Idiomas</h2>
            <div className="resume-e__lang-row">
              {languages.map((l, i) => {
                const { name, level } = splitLang(l);
                return (
                  <div key={i} className="resume-e__lang-item">
                    <span className="resume-e__lang-name">{name}</span>
                    {level && <span className="resume-e__lang-level">{level}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Intereses */}
        {skills && skills.length > 4 && (
          <div>
            <span className="resume-e__interest-badge">Intereses</span>
            {skills.slice(4).map((s, i) => (
              <div key={i} className="resume-e__interest-item">
                <span className="resume-e__interest-diamond">✦</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}



      </div>
    </div>
  );
};

export default ResumeE;

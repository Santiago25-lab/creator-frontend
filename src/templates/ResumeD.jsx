import React from 'react';
import './ResumeD.css';

/**
 * ResumeD — "Creative Designer"
 * Inspirado en diseño editorial bold (estilo Marta Gutiérrez).
 * Columna izquierda: nombre grande + foto + about + skills badges.
 * Columna derecha: Educación, Experiencia, Idiomas, Contacto en morado.
 */
const ResumeD = ({ data }) => {
  const { personalInfo, experience, education, skills, languages } = data;

  // Separa "Cargo · Empresa" si existe el separador
  const splitTitle = (title) => {
    if (!title) return { role: '', company: '' };
    const parts = title.split(/·|—|-/);
    return { role: parts[0]?.trim() || '', company: parts[1]?.trim() || '' };
  };

  // Separa "Idioma (Nivel)" → { name, level }
  const splitLang = (lang) => {
    const match = lang.match(/^(.+?)\s*\((.+)\)$/);
    if (match) return { name: match[1].trim(), level: match[2].trim() };
    return { name: lang, level: '' };
  };

  return (
    <div className="resume-d">

      {/* ═══ COLUMNA IZQUIERDA ═══ */}
      <div className="resume-d__left">

        {/* Foto (si existe) */}
        {personalInfo.photo && (
          <img
            className="resume-d__photo"
            src={personalInfo.photo}
            alt={personalInfo.name || 'Foto de perfil'}
          />
        )}

        {/* Nombre gigante */}
        <div>
          <h1 className="resume-d__name">{personalInfo.name || 'Tu Nombre'}</h1>
          {personalInfo.title && (
            <span className="resume-d__title-badge">{personalInfo.title}</span>
          )}
        </div>

        {/* Perfil / About */}
        {personalInfo.aboutMe && (
          <p className="resume-d__about">{personalInfo.aboutMe}</p>
        )}

        {/* Skills como badges creativos */}
        {skills && skills.length > 0 && (
          <div>
            <h3 className="resume-d__skills-title">Habilidades</h3>
            <div className="resume-d__badges">
              {skills.map((s, i) => (
                <span key={i} className="resume-d__badge">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Intereses */}
        {skills && skills.length > 4 && (
          <div>
            <span className="resume-d__interest-badge">Intereses</span>
            {skills.slice(4).map((s, i) => (
              <div key={i} className="resume-d__interest-item">
                <span className="resume-d__interest-diamond">✦</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ═══ COLUMNA DERECHA ═══ */}
      <div className="resume-d__right">

        {/* Educación */}
        {education && education.length > 0 && (
          <section>
            <h2 className="resume-d__section-title">Educación</h2>
            {education.map((edu, i) => (
              <div key={i} className="resume-d__edu-item">
                {edu.period && <span className="resume-d__edu-period">{edu.period}</span>}
                <h4 className="resume-d__edu-degree">{edu.degree}</h4>
                <p className="resume-d__edu-institution">{edu.institution}</p>
              </div>
            ))}
          </section>
        )}

        {/* Experiencia */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="resume-d__section-title">Experiencia</h2>
            {experience.map((exp, i) => {
              const { role, company } = splitTitle(exp.title);
              return (
                <div key={i} className="resume-d__exp-item">
                  <div className="resume-d__exp-dates">
                    {exp.period && exp.period.split(/—|-/).map((d, j) => (
                      <span key={j} className="resume-d__exp-date">{d.trim()}</span>
                    ))}
                    <div className="resume-d__exp-divider" />
                  </div>
                  <div className="resume-d__exp-content">
                    <h4 className="resume-d__exp-role">{role}</h4>
                    {company && <p className="resume-d__exp-company">{company}</p>}
                    {exp.description && <p className="resume-d__exp-desc">{exp.description}</p>}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Idiomas */}
        {languages && languages.length > 0 && (
          <section>
            <h2 className="resume-d__section-title">Idiomas</h2>
            {languages.map((l, i) => {
              const { name, level } = splitLang(l);
              return (
                <div key={i} className="resume-d__lang-row">
                  <span className="resume-d__lang-name">{name}</span>
                  {level && <span className="resume-d__lang-level">{level}</span>}
                </div>
              );
            })}
          </section>
        )}

        {/* Contacto */}
        <section>
          <h2 className="resume-d__section-title">Contacto</h2>
          {personalInfo.email && (
            <div className="resume-d__contact-row">
              <i className="fa-solid fa-envelope" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="resume-d__contact-row">
              <i className="fa-solid fa-phone" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="resume-d__contact-row">
              <i className="fa-solid fa-location-dot" />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="resume-d__contact-row">
              <i className="fa-solid fa-globe" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default ResumeD;

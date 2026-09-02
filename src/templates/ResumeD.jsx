import React from 'react';
import './ResumeD.css';

/**
 * ResumeD — "Creative Designer"
 * Inspirado en diseño editorial bold (estilo Marta Gutiérrez).
 * Columna izquierda: nombre grande + foto + about + skills badges.
 * Columna derecha: Educación, Experiencia, Idiomas, Contacto en morado.
 */
const ResumeD = ({ data }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], languages = [] } = data || {};
  const sectionsVisibility = data?.sectionsVisibility || {};
  const isVis = (key) => sectionsVisibility[key] !== false;

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

        {/* Foto (si existe y está activa) */}
        {isVis('photo') && personalInfo.photo && (
          <img
            className="resume-d__photo"
            src={personalInfo.photo}
            alt={personalInfo.name || 'Foto de perfil'}
          />
        )}

        {/* Nombre */}
        <div>
          <h1 className="resume-d__name">{personalInfo.name || 'Tu Nombre'}</h1>
          {personalInfo.title && (
            <span className="resume-d__title-badge">{personalInfo.title}</span>
          )}
        </div>

        {/* Perfil / About */}
        {isVis('aboutMe') && personalInfo.aboutMe && (
          <p className="resume-d__about">{personalInfo.aboutMe}</p>
        )}

        {/* Objetivo */}
        {isVis('objective') && personalInfo.objective && (
          <p className="resume-d__about" style={{ fontStyle: 'italic', borderLeft: '3px solid #8b5cf6', paddingLeft: '10px' }}>
            {personalInfo.objective}
          </p>
        )}

        {/* Skills como badges creativos */}
        {isVis('skills') && skills && skills.length > 0 && (
          <div>
            <h3 className="resume-d__skills-title">Habilidades Técnicas</h3>
            <div className="resume-d__badges">
              {skills.map((s, i) => (
                <span key={i} className="resume-d__badge">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Habilidades Blandas */}
        {isVis('softSkills') && data?.softSkills && data.softSkills.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3 className="resume-d__skills-title">Habilidades Blandas</h3>
            <div className="resume-d__badges">
              {data.softSkills.map((s, i) => (
                <span key={i} className="resume-d__badge" style={{ background: 'rgba(255,255,255,0.06)' }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Intereses (REALES, no repite skills) */}
        {isVis('interests') && data?.interests && data.interests.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <span className="resume-d__interest-badge">Intereses & Pasiones</span>
            {data.interests.map((s, i) => (
              <div key={i} className="resume-d__interest-item">
                <span className="resume-d__interest-diamond">✦</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Redes / Links */}
        {isVis('socialLinks') && data?.socialLinks && data.socialLinks.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3 className="resume-d__skills-title">Enlaces</h3>
            {data.socialLinks.map((s, i) => (
              <div key={i} className="resume-d__interest-item">
                <span className="resume-d__interest-diamond">↗</span>
                <span>{s.platform ? `${s.platform}: ` : ''}{s.username || s.url}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ═══ COLUMNA DERECHA ═══ */}
      <div className="resume-d__right">

        {/* Experiencia */}
        {isVis('experience') && experience && experience.length > 0 && (
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

        {/* Proyectos */}
        {isVis('projects') && data?.projects && data.projects.length > 0 && (
          <section>
            <h2 className="resume-d__section-title">Proyectos</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="resume-d__exp-item">
                <div className="resume-d__exp-dates">
                  {proj.role && <span className="resume-d__exp-date">{proj.role}</span>}
                  <div className="resume-d__exp-divider" />
                </div>
                <div className="resume-d__exp-content">
                  <h4 className="resume-d__exp-role">{proj.name}</h4>
                  {proj.link && <p className="resume-d__exp-company" style={{ color: '#a78bfa' }}>{proj.link}</p>}
                  {proj.description && <p className="resume-d__exp-desc">{proj.description}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Educación */}
        {isVis('education') && education && education.length > 0 && (
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

        {/* Certificaciones */}
        {isVis('certifications') && data?.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="resume-d__section-title">Certificaciones</h2>
            {data.certifications.map((cert, i) => (
              <div key={i} className="resume-d__edu-item">
                {cert.date && <span className="resume-d__edu-period">{cert.date}</span>}
                <h4 className="resume-d__edu-degree">{cert.name}</h4>
                <p className="resume-d__edu-institution">{cert.issuer}</p>
              </div>
            ))}
          </section>
        )}

        {/* Reconocimientos / Premios */}
        {isVis('awards') && data?.awards && data.awards.length > 0 && (
          <section>
            <h2 className="resume-d__section-title">Reconocimientos & Premios</h2>
            {data.awards.map((aw, i) => (
              <div key={i} className="resume-d__edu-item">
                {aw.date && <span className="resume-d__edu-period">{aw.date}</span>}
                <h4 className="resume-d__edu-degree">{aw.title}</h4>
                <p className="resume-d__edu-institution">{aw.issuer}</p>
                {aw.description && <p className="resume-d__exp-desc">{aw.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Idiomas */}
        {isVis('languages') && languages && languages.length > 0 && (
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
        {isVis('personalInfo') && (
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
        )}

      </div>
    </div>
  );
};

export default ResumeD;

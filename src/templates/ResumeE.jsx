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
  const { personalInfo = {}, experience = [], education = [], skills = [], languages = [] } = data || {};
  const sectionsVisibility = data?.sectionsVisibility || {};
  const isVis = (key) => sectionsVisibility[key] !== false;

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
      {personalInfo.title && (
        <div className="resume-e__role-badge">
          {personalInfo.title}
        </div>
      )}

      {/* ═══ COLUMNA IZQUIERDA ═══ */}
      <div className="resume-e__left">

        {/* Foto enmarcada */}
        {isVis('photo') && (
          <div className="resume-e__photo-wrap">
            {personalInfo.photo
              ? (
                <img 
                  className="resume-e__photo" 
                  src={personalInfo.photo}
                  alt={personalInfo.name || 'Foto de perfil'}
                />
              )
              : (
                <div className="resume-e__photo-placeholder">
                  <i className="fa-solid fa-camera" />
                  <span>Foto</span>
                </div>
              )
            }
            <div className="resume-e__photo-frame" />
          </div>
        )}

        {/* Name + Year badges */}
        <div className="resume-e__name-badge">{personalInfo.name || 'Tu Nombre'}</div>
        <div className="resume-e__year-badge">{currentYear}</div>

        {/* Contacto */}
        {isVis('personalInfo') && (
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
        )}

        {/* Redes / Links */}
        {isVis('socialLinks') && data?.socialLinks && data.socialLinks.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3 className="resume-e__contact-title">Enlaces</h3>
            {data.socialLinks.map((s, i) => (
              <div key={i} className="resume-e__contact-item">
                <i className="fa-solid fa-arrow-up-right-from-square" />
                <span>{s.platform ? `${s.platform}: ` : ''}{s.username || s.url}</span>
              </div>
            ))}
          </div>
        )}

        {/* Educación */}
        {isVis('education') && education && education.length > 0 && (
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

        {/* Certificaciones */}
        {isVis('certifications') && data?.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="resume-e__left-section-title">Certificaciones</h2>
            {data.certifications.map((cert, i) => (
              <div key={i} className="resume-e__edu-item">
                <span className="resume-e__edu-diamond">✦</span>
                <div>
                  {cert.date && <p className="resume-e__edu-period">{cert.date}</p>}
                  <p className="resume-e__edu-degree">{cert.name}</p>
                  {cert.issuer && (
                    <p className="resume-e__edu-institution">{cert.issuer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Technical Skills */}
        {isVis('skills') && skills && skills.length > 0 && (
          <div>
            <h2 className="resume-e__left-section-title">Habilidades Técnicas</h2>
            <div className="resume-e__skills-grid">
              {skills.map((s, i) => (
                <span key={i} className="resume-e__skill-pill">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {isVis('softSkills') && data?.softSkills && data.softSkills.length > 0 && (
          <div>
            <h2 className="resume-e__left-section-title">Habilidades Blandas</h2>
            <div className="resume-e__skills-grid">
              {data.softSkills.map((s, i) => (
                <span key={i} className="resume-e__skill-pill" style={{ background: 'rgba(255,255,255,0.1)' }}>{s}</span>
              ))}
            </div>
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
        {isVis('aboutMe') && personalInfo.aboutMe && (
          <p className="resume-e__about">"{personalInfo.aboutMe}"</p>
        )}

        {/* Objetivo */}
        {isVis('objective') && personalInfo.objective && (
          <p className="resume-e__about" style={{ fontStyle: 'italic', borderLeft: '3px solid #7c2d12', paddingLeft: '12px' }}>
            {personalInfo.objective}
          </p>
        )}

        {/* Experiencia en card */}
        {isVis('experience') && experience && experience.length > 0 && (
          <div className="resume-e__exp-card">
            <h2 className="resume-e__right-section-title">Experiencia Laboral</h2>
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
          </div>
        )}

        {/* Proyectos */}
        {isVis('projects') && data?.projects && data.projects.length > 0 && (
          <div className="resume-e__exp-card" style={{ marginTop: '16px' }}>
            <h2 className="resume-e__right-section-title">Proyectos Destacados</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="resume-e__exp-item">
                <span className="resume-e__exp-diamond">✦</span>
                <div>
                  <strong>{proj.name}</strong>
                  {proj.role && <span style={{ color: '#999', fontSize: '10px', marginLeft: '8px' }}>{proj.role}</span>}
                  {proj.link && <p style={{ margin: '2px 0', fontSize: '11px', color: '#7c2d12' }}>{proj.link}</p>}
                  {proj.description && <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#555', lineHeight: '1.6' }}>{proj.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Idiomas */}
        {isVis('languages') && languages && languages.length > 0 && (
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

        {/* Intereses REALES */}
        {isVis('interests') && data?.interests && data.interests.length > 0 && (
          <div style={{ marginTop: '14px' }}>
            <span className="resume-e__interest-badge">Intereses & Pasiones</span>
            {data.interests.map((s, i) => (
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

import React from 'react';
import './ResumeC.css';

/**
 * ResumeC — "Elegant Serif"
 * Editorial. Ejecutivo. Fuente Lora.
 * Dos columnas: perfil+skills a la izquierda, experiencia a la derecha.
 */
const ResumeC = ({ data }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], languages = [] } = data || {};
  const sectionsVisibility = data?.sectionsVisibility || {};
  const isVis = (key) => sectionsVisibility[key] !== false;

  return (
    <div className="resume-c">
      <div className="resume-c__inner">

        {/* ═══ HEADER ELEGANTE ═══ */}
        <header className="resume-c__header">
          {isVis('photo') && personalInfo.photo && (
            <img
              className="resume-c__photo"
              src={personalInfo.photo}
              alt={personalInfo.name || 'Foto de perfil'}
            />
          )}
          <h1 className="resume-c__name">{personalInfo.name}</h1>
          <div className="resume-c__divider" />
          <p className="resume-c__title">{personalInfo.title}</p>
          
          {isVis('personalInfo') && (
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
              {personalInfo.website && (
                <span className="resume-c__contact-item">
                  <i className="fa-solid fa-globe" /> {personalInfo.website}
                </span>
              )}
              {isVis('socialLinks') && data?.socialLinks && data.socialLinks.map((s, i) => (
                <span key={i} className="resume-c__contact-item">
                  <i className="fa-solid fa-arrow-up-right-from-square" /> {s.platform ? `${s.platform}: ` : ''}{s.username || s.url}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* ═══ BODY: DOS COLUMNAS ═══ */}
        <div className="resume-c__body">

          {/* COLUMNA IZQUIERDA */}
          <div className="resume-c__left">
            {/* Perfil */}
            {isVis('aboutMe') && personalInfo.aboutMe && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Sumario</h2>
                <p className="resume-c__about">{personalInfo.aboutMe}</p>
              </div>
            )}

            {/* Objetivo */}
            {isVis('objective') && personalInfo.objective && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Objetivo</h2>
                <p className="resume-c__about" style={{ fontStyle: 'italic' }}>{personalInfo.objective}</p>
              </div>
            )}

            {/* Skills */}
            {isVis('skills') && skills && skills.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Expertise Técnico</h2>
                {skills.map((s, i) => (
                  <div key={i} className="resume-c__skill-item">
                    <div className="resume-c__skill-dot" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Soft Skills */}
            {isVis('softSkills') && data?.softSkills && data.softSkills.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Habilidades Blandas</h2>
                {data.softSkills.map((s, i) => (
                  <div key={i} className="resume-c__skill-item">
                    <div className="resume-c__skill-dot" style={{ background: '#94a3b8' }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Idiomas */}
            {isVis('languages') && languages && languages.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Idiomas</h2>
                {languages.map((l, i) => (
                  <div key={i} className="resume-c__lang-item">{l}</div>
                ))}
              </div>
            )}

            {/* Intereses */}
            {isVis('interests') && data?.interests && data.interests.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Intereses</h2>
                {data.interests.map((it, i) => (
                  <div key={i} className="resume-c__lang-item">✦ {it}</div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div>
            {/* Experiencia */}
            {isVis('experience') && experience && experience.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Trayectoria</h2>
                {experience.map((exp, i) => (
                  <div key={i} className="resume-c__exp-item">
                    <div className="resume-c__exp-header">
                      <h4 className="resume-c__exp-role">{exp.title}</h4>
                      <span className="resume-c__exp-period">{exp.period}</span>
                    </div>
                    {exp.company && <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: '2px 0' }}>{exp.company}</p>}
                    <p className="resume-c__exp-desc">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Proyectos */}
            {isVis('projects') && data?.projects && data.projects.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Proyectos</h2>
                {data.projects.map((proj, i) => (
                  <div key={i} className="resume-c__exp-item">
                    <div className="resume-c__exp-header">
                      <h4 className="resume-c__exp-role">{proj.name}</h4>
                      {proj.role && <span className="resume-c__exp-period">{proj.role}</span>}
                    </div>
                    {proj.link && <p style={{ fontSize: '12px', color: '#0284c7', margin: '2px 0' }}>{proj.link}</p>}
                    <p className="resume-c__exp-desc">{proj.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Educación */}
            {isVis('education') && education && education.length > 0 && (
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

            {/* Certificaciones */}
            {isVis('certifications') && data?.certifications && data.certifications.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Certificaciones</h2>
                {data.certifications.map((cert, i) => (
                  <div key={i} className="resume-c__edu-item">
                    <h4 className="resume-c__edu-degree">{cert.name}</h4>
                    <div className="resume-c__edu-meta">
                      <span>{cert.issuer}</span>
                      <span>{cert.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reconocimientos */}
            {isVis('awards') && data?.awards && data.awards.length > 0 && (
              <div className="resume-c__section">
                <h2 className="resume-c__section-title">Reconocimientos</h2>
                {data.awards.map((aw, i) => (
                  <div key={i} className="resume-c__edu-item">
                    <h4 className="resume-c__edu-degree">{aw.title}</h4>
                    <div className="resume-c__edu-meta">
                      <span>{aw.issuer}</span>
                      <span>{aw.date}</span>
                    </div>
                    {aw.description && <p className="resume-c__exp-desc">{aw.description}</p>}
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

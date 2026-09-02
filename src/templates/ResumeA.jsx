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
  const { personalInfo = {}, experience = [], education = [], skills = [], languages = [] } = data || {};
  const sectionsVisibility = data?.sectionsVisibility || {};
  const isVis = (key) => sectionsVisibility[key] !== false;

  return (
    <div className="resume-a">

      {/* ═══ SIDEBAR ═══ */}
      <aside className="resume-a__sidebar">
        {isVis('photo') && (
          <img
            className="resume-a__photo"
            src={personalInfo.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name || 'User')}&size=200&background=1e293b&color=60a5fa&bold=true`}
            alt={personalInfo.name || 'Foto de perfil'}
          />
        )}

        {/* Contacto */}
        {isVis('personalInfo') && (
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
        )}

        {/* Redes / Links */}
        {isVis('socialLinks') && data?.socialLinks && data.socialLinks.length > 0 && (
          <div>
            <h3>Enlaces</h3>
            {data.socialLinks.map((s, i) => (
              <div key={i} className="resume-a__contact-item">
                <i className="fa-solid fa-arrow-up-right-from-square" />
                <span>{s.platform ? `${s.platform}: ` : ''}{s.username || s.url}</span>
              </div>
            ))}
          </div>
        )}

        {/* Habilidades Técnicas */}
        {isVis('skills') && skills && skills.length > 0 && (
          <div>
            <h3>Habilidades Técnicas</h3>
            <div>
              {skills.map((s, i) => (
                <span key={i} className="resume-a__skill-tag">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Habilidades Blandas */}
        {isVis('softSkills') && data?.softSkills && data.softSkills.length > 0 && (
          <div>
            <h3>Habilidades Blandas</h3>
            <div>
              {data.softSkills.map((s, i) => (
                <span key={i} className="resume-a__skill-tag" style={{ background: 'rgba(255,255,255,0.08)' }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {isVis('languages') && languages && languages.length > 0 && (
          <div>
            <h3>Idiomas</h3>
            {languages.map((l, i) => (
              <div key={i} className="resume-a__lang-item">
                <span>{l}</span>
              </div>
            ))}
          </div>
        )}

        {/* Intereses */}
        {isVis('interests') && data?.interests && data.interests.length > 0 && (
          <div>
            <h3>Intereses</h3>
            <div>
              {data.interests.map((it, i) => (
                <span key={i} className="resume-a__skill-tag" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: '#3b82f6' }}>✦ {it}</span>
              ))}
            </div>
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
        {isVis('aboutMe') && personalInfo.aboutMe && (
          <p className="resume-a__about">{personalInfo.aboutMe}</p>
        )}

        {/* Objetivo profesional */}
        {isVis('objective') && personalInfo.objective && (
          <p className="resume-a__about" style={{ fontStyle: 'italic', borderLeft: '3px solid #3b82f6', paddingLeft: '12px' }}>
            {personalInfo.objective}
          </p>
        )}

        {/* Experiencia */}
        {isVis('experience') && experience && experience.length > 0 && (
          <section>
            <h2 className="resume-a__section-title">Experiencia</h2>
            {experience.map((exp, i) => (
              <div key={i} className="resume-a__exp-item">
                <div className="resume-a__exp-header">
                  <h4 className="resume-a__exp-role">{exp.title}</h4>
                  <span className="resume-a__exp-period">{exp.period}</span>
                </div>
                {exp.company && <p style={{ fontSize: '13px', fontWeight: '600', color: '#60a5fa', margin: '2px 0' }}>{exp.company}</p>}
                <p className="resume-a__exp-desc">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Proyectos */}
        {isVis('projects') && data?.projects && data.projects.length > 0 && (
          <section>
            <h2 className="resume-a__section-title">Proyectos Destacados</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="resume-a__exp-item">
                <div className="resume-a__exp-header">
                  <h4 className="resume-a__exp-role">{proj.name}</h4>
                  {proj.role && <span className="resume-a__exp-period">{proj.role}</span>}
                </div>
                {proj.link && <p style={{ fontSize: '12px', color: '#60a5fa', margin: '2px 0' }}>{proj.link}</p>}
                <p className="resume-a__exp-desc">{proj.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Educación */}
        {isVis('education') && education && education.length > 0 && (
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

        {/* Certificaciones */}
        {isVis('certifications') && data?.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="resume-a__section-title">Certificaciones</h2>
            {data.certifications.map((cert, i) => (
              <div key={i} className="resume-a__edu-item">
                <h4 className="resume-a__edu-degree">{cert.name}</h4>
                <div className="resume-a__edu-meta">
                  <span>{cert.issuer}</span>
                  <span>{cert.date}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Reconocimientos / Premios */}
        {isVis('awards') && data?.awards && data.awards.length > 0 && (
          <section>
            <h2 className="resume-a__section-title">Reconocimientos & Premios</h2>
            {data.awards.map((aw, i) => (
              <div key={i} className="resume-a__edu-item">
                <h4 className="resume-a__edu-degree">{aw.title}</h4>
                <div className="resume-a__edu-meta">
                  <span>{aw.issuer}</span>
                  <span>{aw.date}</span>
                </div>
                {aw.description && <p className="resume-a__exp-desc">{aw.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Voluntariado */}
        {isVis('volunteer') && data?.volunteer && data.volunteer.length > 0 && (
          <section>
            <h2 className="resume-a__section-title">Voluntariado</h2>
            {data.volunteer.map((vol, i) => (
              <div key={i} className="resume-a__exp-item">
                <div className="resume-a__exp-header">
                  <h4 className="resume-a__exp-role">{vol.role}</h4>
                  <span className="resume-a__exp-period">{vol.period}</span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#60a5fa' }}>{vol.organization}</p>
                {vol.description && <p className="resume-a__exp-desc">{vol.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Referencias */}
        {isVis('references') && data?.references && data.references.length > 0 && (
          <section>
            <h2 className="resume-a__section-title">Referencias</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {data.references.map((ref, i) => (
                <div key={i} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', color: '#0f172a' }}>{ref.name}</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b' }}>{ref.position} {ref.company ? `· ${ref.company}` : ''}</p>
                  {ref.phone && <p style={{ margin: '0', fontSize: '11px', color: '#3b82f6' }}><i className="fa-solid fa-phone" /> {ref.phone}</p>}
                  {ref.email && <p style={{ margin: '0', fontSize: '11px', color: '#64748b' }}><i className="fa-solid fa-envelope" /> {ref.email}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

    </div>
  );
};

export default ResumeA;

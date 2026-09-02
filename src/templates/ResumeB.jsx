import React from 'react';
import './ResumeB.css';

/**
 * ResumeB — "Clean Minimal"
 * Centrada. Sin sidebar. ATS-friendly al máximo.
 * Datos entran → CV profesional sale.
 */
const ResumeB = ({ data }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], languages = [] } = data || {};
  const sectionsVisibility = data?.sectionsVisibility || {};
  const isVis = (key) => sectionsVisibility[key] !== false;

  return (
    <div className="resume-b">

      {/* ═══ HEADER CENTRADO ═══ */}
      <header className="resume-b__header">
        {isVis('photo') && personalInfo.photo && (
          <img
            className="resume-b__photo"
            src={personalInfo.photo}
            alt={personalInfo.name || 'Foto de perfil'}
          />
        )}
        <h1 className="resume-b__name">{personalInfo.name}</h1>
        <p className="resume-b__title">{personalInfo.title}</p>
        
        {isVis('personalInfo') && (
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
            {isVis('socialLinks') && data?.socialLinks && data.socialLinks.map((s, i) => (
              <span key={i} className="resume-b__contact-item">
                <i className="fa-solid fa-arrow-up-right-from-square" /> {s.platform ? `${s.platform}: ` : ''}{s.username || s.url}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ═══ PERFIL ═══ */}
      {isVis('aboutMe') && personalInfo.aboutMe && (
        <section className="resume-b__section">
          <h2 className="resume-b__section-title">Perfil Profesional</h2>
          <p className="resume-b__about">{personalInfo.aboutMe}</p>
        </section>
      )}

      {/* ═══ OBJETIVO ═══ */}
      {isVis('objective') && personalInfo.objective && (
        <section className="resume-b__section">
          <h2 className="resume-b__section-title">Objetivo Profesional</h2>
          <p className="resume-b__about" style={{ fontStyle: 'italic' }}>{personalInfo.objective}</p>
        </section>
      )}

      {/* ═══ EXPERIENCIA ═══ */}
      {isVis('experience') && experience && experience.length > 0 && (
        <section className="resume-b__section">
          <h2 className="resume-b__section-title">Experiencia Laboral</h2>
          {experience.map((exp, i) => (
            <div key={i} className="resume-b__exp-item">
              <div className="resume-b__exp-header">
                <h4 className="resume-b__exp-role">{exp.title}</h4>
                <span className="resume-b__exp-period">{exp.period}</span>
              </div>
              {exp.company && <p style={{ fontSize: '13px', fontWeight: '600', color: '#475569', margin: '2px 0' }}>{exp.company}</p>}
              <p className="resume-b__exp-desc">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ═══ PROYECTOS ═══ */}
      {isVis('projects') && data?.projects && data.projects.length > 0 && (
        <section className="resume-b__section">
          <h2 className="resume-b__section-title">Proyectos Destacados</h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="resume-b__exp-item">
              <div className="resume-b__exp-header">
                <h4 className="resume-b__exp-role">{proj.name}</h4>
                {proj.role && <span className="resume-b__exp-period">{proj.role}</span>}
              </div>
              {proj.link && <p style={{ fontSize: '12px', color: '#2563eb', margin: '2px 0' }}>{proj.link}</p>}
              <p className="resume-b__exp-desc">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ═══ EDUCACIÓN + SKILLS (dos columnas) ═══ */}
      <div className="resume-b__two-col">
        {/* Educación */}
        {isVis('education') && education && education.length > 0 && (
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

        {/* Certificaciones */}
        {isVis('certifications') && data?.certifications && data.certifications.length > 0 && (
          <section className="resume-b__section">
            <h2 className="resume-b__section-title">Certificaciones</h2>
            {data.certifications.map((cert, i) => (
              <div key={i} className="resume-b__edu-item">
                <h4 className="resume-b__edu-degree">{cert.name}</h4>
                <div className="resume-b__edu-meta">
                  <span>{cert.issuer}</span>
                  <span>{cert.date}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills + Languages */}
        <div>
          {isVis('skills') && skills && skills.length > 0 && (
            <section className="resume-b__section">
              <h2 className="resume-b__section-title">Habilidades Técnicas</h2>
              <div className="resume-b__skills-grid">
                {skills.map((s, i) => (
                  <span key={i} className="resume-b__skill">{s}</span>
                ))}
              </div>
            </section>
          )}

          {isVis('softSkills') && data?.softSkills && data.softSkills.length > 0 && (
            <section className="resume-b__section" style={{ marginTop: '16px' }}>
              <h2 className="resume-b__section-title">Habilidades Blandas</h2>
              <div className="resume-b__skills-grid">
                {data.softSkills.map((s, i) => (
                  <span key={i} className="resume-b__skill" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {isVis('languages') && languages && languages.length > 0 && (
            <section className="resume-b__section" style={{ marginTop: '16px' }}>
              <h2 className="resume-b__section-title">Idiomas</h2>
              {languages.map((l, i) => (
                <span key={i} className="resume-b__skill">{l}</span>
              ))}
            </section>
          )}

          {isVis('interests') && data?.interests && data.interests.length > 0 && (
            <section className="resume-b__section" style={{ marginTop: '16px' }}>
              <h2 className="resume-b__section-title">Intereses</h2>
              <div className="resume-b__skills-grid">
                {data.interests.map((it, i) => (
                  <span key={i} className="resume-b__skill" style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>✦ {it}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

    </div>
  );
};

export default ResumeB;

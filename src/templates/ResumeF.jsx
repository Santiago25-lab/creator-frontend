import React from 'react';
import './ResumeF.css';

/**
 * ResumeF — "Dark Impact"
 * Fondo foto oscuro + overlay. "MI CURRÍCULUM" gigante.
 * Dos columnas: Info/Edu/Exp/Contacto | Skills/Pasiones.
 * Todo en español.
 */

// Íconos para pasiones según palabras clave
const PASSION_ICONS = {
  'fotograf': 'fa-camera',
  'diseño': 'fa-pen-nib',
  'dibujo': 'fa-pencil',
  'música': 'fa-music',
  'viaje': 'fa-plane',
  'deporte': 'fa-futbol',
  'lectura': 'fa-book',
  'cocina': 'fa-utensils',
  'tecnolog': 'fa-microchip',
  'gaming': 'fa-gamepad',
  'juego': 'fa-gamepad',
  'arte': 'fa-palette',
  'cine': 'fa-film',
  'natacion': 'fa-person-swimming',
};

const getPassionIcon = (skill) => {
  const lower = skill.toLowerCase();
  for (const [key, icon] of Object.entries(PASSION_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return 'fa-star';
};

// Abreviatura para el badge circular (primeras 2 letras)
const getAbbr = (skill) => {
  const words = skill.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return skill.slice(0, 2).toUpperCase();
};

const ResumeF = ({ data }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], languages = [] } = data || {};
  const sectionsVisibility = data?.sectionsVisibility || {};
  const isVis = (key) => sectionsVisibility[key] !== false;

  // Habilidades técnicas
  const softwareSkills = skills || [];
  // Pasiones / Intereses reales
  const passionItems = data?.interests && data.interests.length > 0
    ? data.interests
    : ['Fotografía', 'Diseño', 'Arte', 'Tecnología'];

  const bgStyle = isVis('photo') && personalInfo.photo
    ? { backgroundImage: `url(${personalInfo.photo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' };

  return (
    <div className="resume-f">

      {/* Fondo foto + overlay */}
      <div className="resume-f__bg" style={bgStyle} />
      <div className="resume-f__overlay" />

      {/* Contenido */}
      <div className="resume-f__content">

        {/* ─── HEADER ─── */}
        <header className="resume-f__header">
          <h1 className="resume-f__main-title">Mi Currículum</h1>
        </header>

        {/* ─── BODY ─── */}
        <div className="resume-f__body">

          {/* ═══ COLUMNA IZQUIERDA ═══ */}
          <div className="resume-f__left">

            {/* INFO */}
            <section>
              <div className="resume-f__section-header">
                <div className="resume-f__icon-box">
                  <i className="fa-solid fa-user" />
                </div>
                <h2 className="resume-f__section-title">Info</h2>
              </div>
              {personalInfo.name && (
                <div className="resume-f__info-row">
                  <span className="resume-f__info-label">Nombre:</span>
                  <span>{personalInfo.name}</span>
                </div>
              )}
              {personalInfo.title && (
                <div className="resume-f__info-row">
                  <span className="resume-f__info-label">Cargo:</span>
                  <span>{personalInfo.title}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="resume-f__info-row">
                  <span className="resume-f__info-label">Dirección:</span>
                  <span>{personalInfo.address}</span>
                </div>
              )}
              {personalInfo.aboutMe && (
                <div className="resume-f__info-row" style={{ marginTop: '8px', display: 'block', fontSize: '11.5px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
                  {personalInfo.aboutMe}
                </div>
              )}
            </section>

            {/* EDUCACIÓN */}
            {education && education.length > 0 && (
              <section>
                <div className="resume-f__section-header">
                  <div className="resume-f__icon-box">
                    <i className="fa-solid fa-graduation-cap" />
                  </div>
                  <h2 className="resume-f__section-title">Educación</h2>
                </div>
                {education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    {edu.period && <p className="resume-f__edu-period">{edu.period}</p>}
                    <p className="resume-f__edu-degree">{edu.degree}</p>
                    {edu.institution && <p className="resume-f__edu-institution">{edu.institution}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* EXPERIENCIA */}
            {experience && experience.length > 0 && (
              <section>
                <div className="resume-f__section-header">
                  <div className="resume-f__icon-box">
                    <i className="fa-solid fa-briefcase" />
                  </div>
                  <h2 className="resume-f__section-title">Experiencia</h2>
                </div>
                {experience.map((exp, i) => {
                  const parts = (exp.title || '').split(/·|—|-/);
                  const role = parts[0]?.trim();
                  const company = parts[1]?.trim();
                  return (
                    <div key={i} className="resume-f__exp-item">
                      {exp.period && <p className="resume-f__exp-period">{exp.period}</p>}
                      <p className="resume-f__exp-company">
                        {company || role}
                      </p>
                      {company && <p className="resume-f__exp-location">{role}</p>}
                      {exp.description && exp.description.split(/\.|,/).filter(Boolean).slice(0, 2).map((bullet, j) => (
                        <div key={j} className="resume-f__exp-bullet">{bullet.trim()}</div>
                      ))}
                    </div>
                  );
                })}
              </section>
            )}

            {/* CONTACTO */}
            <section>
              <div className="resume-f__section-header">
                <div className="resume-f__icon-box">
                  <i className="fa-solid fa-paper-plane" />
                </div>
                <h2 className="resume-f__section-title">Contacto</h2>
              </div>
              {personalInfo.phone && (
                <div className="resume-f__contact-item">
                  <i className="fa-solid fa-phone" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="resume-f__contact-item">
                  <i className="fa-solid fa-envelope" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="resume-f__contact-item">
                  <i className="fa-solid fa-globe" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {languages && languages.length > 0 && languages.map((l, i) => (
                <div key={i} className="resume-f__contact-item">
                  <i className="fa-solid fa-language" />
                  <span>{l}</span>
                </div>
              ))}
            </section>

            {/* Quote */}
            <div className="resume-f__quote">
              <i className="fa-solid fa-file-lines" />
              <span>"Referencias disponibles a pedido."</span>
            </div>

          </div>

          {/* ═══ COLUMNA DERECHA ═══ */}
          <div className="resume-f__right">

            {/* HABILIDADES DE SOFTWARE */}
            {softwareSkills.length > 0 && (
              <section>
                <div className="resume-f__section-header">
                  <div className="resume-f__icon-box">
                    <i className="fa-solid fa-laptop-code" />
                  </div>
                  <h2 className="resume-f__section-title">Habilidades</h2>
                </div>
                <div className="resume-f__skills-grid">
                  {softwareSkills.map((s, i) => (
                    <div key={i} className="resume-f__skill-circle">
                      <div className="resume-f__skill-badge" style={{
                        background: `hsla(${(i * 47) % 360}, 65%, 45%, 0.35)`,
                        borderColor: `hsl(${(i * 47) % 360}, 70%, 65%)`
                      }}>
                        {getAbbr(s)}
                      </div>
                      <span className="resume-f__skill-name">{s}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PASIONES */}
            <section>
              <div className="resume-f__section-header">
                <div className="resume-f__icon-box">
                  <i className="fa-solid fa-thumbs-up" />
                </div>
                <h2 className="resume-f__section-title">Pasiones</h2>
              </div>
              <div className="resume-f__passions-grid">
                {passionItems.map((p, i) => (
                  <div key={i} className="resume-f__passion-item">
                    <div className="resume-f__passion-icon">
                      <i className={`fa-solid ${getPassionIcon(p)}`} />
                    </div>
                    <span className="resume-f__passion-label">{p}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Mensaje personal */}
            <div className="resume-f__message">
              Por favor contáctame si quieres darme una oportunidad laboral,
              hablar de mis proyectos o simplemente conocernos. ¡Estoy disponible! 😊
            </div>



          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeF;

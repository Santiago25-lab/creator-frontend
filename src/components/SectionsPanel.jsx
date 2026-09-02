import React from 'react';
import './SectionsPanel.css';

export const SECTIONS_CONFIG = [
  {
    category: 'Información Esencial',
    sections: [
      {
        id: 'personalInfo',
        title: 'Datos Personales',
        icon: 'fa-user',
        desc: 'Nombre, cargo, correo, teléfono, dirección y sitio web',
        getCount: (d) => (d.personalInfo?.name ? 1 : 0)
      },
      {
        id: 'photo',
        title: 'Foto de Perfil',
        icon: 'fa-camera',
        desc: 'Fotografía en el encabezado o columna lateral',
        getCount: (d) => (d.personalInfo?.photo ? 1 : 0)
      },
      {
        id: 'aboutMe',
        title: 'Perfil Profesional',
        icon: 'fa-address-card',
        desc: 'Resumen ejecutivo de tu perfil en 2-3 párrafos',
        getCount: (d) => (d.personalInfo?.aboutMe ? 1 : 0)
      },
      {
        id: 'objective',
        title: 'Objetivo Profesional',
        icon: 'fa-bullseye',
        desc: 'Declaración de metas y valor a aportar a la empresa',
        getCount: (d) => (d.personalInfo?.objective ? 1 : 0)
      }
    ]
  },
  {
    category: 'Trayectoria & Formación',
    sections: [
      {
        id: 'experience',
        title: 'Experiencia Laboral',
        icon: 'fa-briefcase',
        desc: 'Cargos, empresas, fechas y logros clave',
        getCount: (d) => d.experience?.length || 0
      },
      {
        id: 'education',
        title: 'Formación Académica',
        icon: 'fa-graduation-cap',
        desc: 'Títulos, universidades, semestres o colegios',
        getCount: (d) => d.education?.length || 0
      },
      {
        id: 'projects',
        title: 'Proyectos Destacados',
        icon: 'fa-laptop-code',
        desc: 'Proyectos freelance, personales o de impacto con links',
        getCount: (d) => d.projects?.length || 0
      },
      {
        id: 'certifications',
        title: 'Certificaciones',
        icon: 'fa-certificate',
        desc: 'Diplomas, licencias profesionales y cursos certificados',
        getCount: (d) => d.certifications?.length || 0
      }
    ]
  },
  {
    category: 'Competencias & Habilidades',
    sections: [
      {
        id: 'skills',
        title: 'Habilidades Técnicas',
        icon: 'fa-code',
        desc: 'Lenguajes, software, herramientas y frameworks',
        getCount: (d) => d.skills?.length || 0
      },
      {
        id: 'softSkills',
        title: 'Habilidades Blandas',
        icon: 'fa-people-group',
        desc: 'Liderazgo, comunicación, trabajo en equipo, etc.',
        getCount: (d) => d.softSkills?.length || 0
      },
      {
        id: 'languages',
        title: 'Idiomas',
        icon: 'fa-language',
        desc: 'Idiomas dominados y nivel (A1, B2, Nativo)',
        getCount: (d) => d.languages?.length || 0
      },
      {
        id: 'interests',
        title: 'Intereses & Pasiones',
        icon: 'fa-heart',
        desc: 'Hobbies, pasiones genuinas y actividades extracurriculares',
        getCount: (d) => d.interests?.length || 0
      }
    ]
  },
  {
    category: 'Secciones Complementarias',
    sections: [
      {
        id: 'socialLinks',
        title: 'Redes & Portafolio',
        icon: 'fa-share-nodes',
        desc: 'LinkedIn, GitHub, portafolio web, etc.',
        getCount: (d) => d.socialLinks?.length || 0
      },
      {
        id: 'awards',
        title: 'Reconocimientos & Premios',
        icon: 'fa-award',
        desc: 'Premios corporativos, becas o distinciones de honor',
        getCount: (d) => d.awards?.length || 0
      },
      {
        id: 'volunteer',
        title: 'Voluntariado',
        icon: 'fa-hand-holding-heart',
        desc: 'Causas sociales, ONGs y trabajo comunitario',
        getCount: (d) => d.volunteer?.length || 0
      },
      {
        id: 'publications',
        title: 'Publicaciones',
        icon: 'fa-book-open',
        desc: 'Artículos científicos, libros, blogs o investigaciones',
        getCount: (d) => d.publications?.length || 0
      },
      {
        id: 'references',
        title: 'Referencias Profesionales',
        icon: 'fa-id-badge',
        desc: 'Contactos recomendadores y jefes anteriores',
        getCount: (d) => d.references?.length || 0
      }
    ]
  }
];

export const SectionsPanel = ({ cvData, onToggleSection, onSetAllSections }) => {
  const visibility = cvData?.sectionsVisibility || {};

  const totalActive = Object.values(visibility).filter(Boolean).length;
  const totalSections = SECTIONS_CONFIG.reduce((acc, cat) => acc + cat.sections.length, 0);

  return (
    <div className="sections-panel">
      {/* Header Info */}
      <div className="sections-panel__header">
        <div className="sections-panel__header-top">
          <div>
            <h3 className="sections-panel__title">Módulos del CV</h3>
            <p className="sections-panel__subtitle">
              {totalActive} de {totalSections} secciones activas
            </p>
          </div>
          <span className="sections-panel__badge">
            <i className="fa-solid fa-layer-group" /> Dinámico
          </span>
        </div>

        <p className="sections-panel__hint">
          Marca o desmarca lo que quieras mostrar. Los datos que ya escribiste se mantendrán seguros en la memoria de la base de datos.
        </p>

        <div className="sections-panel__actions">
          <button 
            type="button" 
            className="sections-panel__btn sections-panel__btn--primary"
            onClick={() => onSetAllSections(true)}
          >
            <i className="fa-solid fa-check-double" /> Activar Todas
          </button>
          <button 
            type="button" 
            className="sections-panel__btn sections-panel__btn--secondary"
            onClick={() => {
              // Solo esenciales
              onSetAllSections(false);
              ['personalInfo', 'aboutMe', 'experience', 'education', 'skills', 'languages', 'photo'].forEach(id => {
                onToggleSection(id, true);
              });
            }}
          >
            <i className="fa-solid fa-wand-magic-sparkles" /> Solo Esenciales
          </button>
        </div>
      </div>

      {/* Lista de Secciones agrupadas por categoría */}
      <div className="sections-panel__content">
        {SECTIONS_CONFIG.map((group, gIdx) => (
          <div key={gIdx} className="sections-panel__group">
            <h4 className="sections-panel__group-title">{group.category}</h4>
            
            <div className="sections-panel__cards">
              {group.sections.map((sec) => {
                const isActive = visibility[sec.id] !== false;
                const count = sec.getCount(cvData);

                return (
                  <div 
                    key={sec.id}
                    className={`sections-card ${isActive ? 'sections-card--active' : 'sections-card--inactive'}`}
                    onClick={() => onToggleSection(sec.id)}
                  >
                    <div className="sections-card__icon-wrap">
                      <i className={`fa-solid ${sec.icon}`} />
                    </div>

                    <div className="sections-card__info">
                      <div className="sections-card__title-row">
                        <span className="sections-card__name">{sec.title}</span>
                        {count > 0 && (
                          <span className="sections-card__count-badge">
                            {count} {count === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </div>
                      <p className="sections-card__desc">{sec.desc}</p>
                    </div>

                    <label className="sections-card__switch" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isActive} 
                        onChange={() => onToggleSection(sec.id)}
                      />
                      <span className="sections-card__slider" />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

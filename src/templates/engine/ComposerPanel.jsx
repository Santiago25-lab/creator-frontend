import React, { useState, useEffect } from 'react';
import { HEADERS, EXPERIENCE, EDUCATION, SKILLS, CONTACT, LAYOUTS, DEFAULT_RECIPE, PRESETS } from './registry';
import './engine.css';

const STORAGE_KEY = 'creatorCV_composerRecipe';

/**
 * ComposerPanel — Panel visual para crear diseños de plantilla.
 * El usuario elige piezas por categoría y ve el preview en vivo.
 */
const ComposerPanel = ({ recipe, onRecipeChange, onBack, onSave }) => {
  const [activeSection, setActiveSection] = useState('presets');

  // Guardar en localStorage cada vez que cambia la receta
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipe));
    } catch {}
  }, [recipe]);

  const updateSlot = (slot, value) => {
    onRecipeChange({ ...recipe, [slot]: value });
  };

  const updateTheme = (key, value) => {
    onRecipeChange({ ...recipe, theme: { ...recipe.theme, [key]: value } });
  };

  const applyPreset = (preset) => {
    onRecipeChange({ ...preset.recipe });
  };

  const sections = [
    { id: 'presets', label: 'Presets', icon: 'fa-wand-magic-sparkles' },
    { id: 'layout', label: 'Layout', icon: 'fa-table-cells-large' },
    { id: 'header', label: 'Header', icon: 'fa-heading' },
    { id: 'experience', label: 'Experiencia', icon: 'fa-briefcase' },
    { id: 'education', label: 'Educación', icon: 'fa-graduation-cap' },
    { id: 'skills', label: 'Skills', icon: 'fa-puzzle-piece' },
    { id: 'contact', label: 'Contacto', icon: 'fa-address-book' },
    { id: 'theme', label: 'Colores', icon: 'fa-palette' },
  ];

  return (
    <div className="composer-panel">
      {/* Botón volver */}
      <button className="composer-back" onClick={onBack}>
        <i className="fa-solid fa-arrow-left" />
        <span>Volver al catálogo</span>
      </button>

      {/* Título y Acciones */}
      <div className="composer-title-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i className="fa-solid fa-wand-magic-sparkles composer-title-icon" />
          <div>
            <h3 className="composer-title">Diseñador de Plantilla</h3>
            <p className="composer-subtitle">Mezcla componentes a tu gusto</p>
          </div>
        </div>
        <button 
          className="composer-save-btn" 
          onClick={() => {
            const name = prompt("Nombre para tu diseño:", "Mi Diseño Personalizado");
            if (name) onSave(name);
          }}
          style={{ '--btn-color': recipe.theme.primaryColor }}
        >
          <span>Guardar Diseño</span>
        </button>
      </div>

      {/* Tabs de sección */}
      <div className="composer-tabs">
        {sections.map(s => (
          <button
            key={s.id}
            className={`composer-tab ${activeSection === s.id ? 'composer-tab--active' : ''}`}
            onClick={() => setActiveSection(s.id)}
            title={s.label}
          >
            <i className={`fa-solid ${s.icon}`} />
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido de la sección activa */}
      <div className="composer-content">

        {/* ── PRESETS ── */}
        {activeSection === 'presets' && (
          <div className="composer-presets">
            <p className="composer-hint">Empieza con un preset y personalízalo a tu gusto:</p>
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                className={`composer-preset-btn ${JSON.stringify(recipe) === JSON.stringify(preset.recipe) ? 'composer-preset-btn--active' : ''}`}
                onClick={() => applyPreset(preset)}
                style={{ '--preset-color': preset.recipe.theme.primaryColor }}
              >
                <div className="composer-preset-dot" style={{ background: preset.recipe.theme.primaryColor }} />
                <span>{preset.name}</span>
                <i className="fa-solid fa-arrow-right composer-preset-arrow" />
              </button>
            ))}
          </div>
        )}

        {/* ── LAYOUT ── */}
        {activeSection === 'layout' && (
          <div className="composer-blocks">
            <p className="composer-hint">Elige la distribución general del CV:</p>
            {Object.entries(LAYOUTS).map(([id, layout]) => (
              <BlockOption
                key={id}
                id={id}
                label={layout.label}
                description={layout.description}
                icon={layout.icon}
                active={recipe.layout === id}
                onClick={() => updateSlot('layout', id)}
                color={recipe.theme.primaryColor}
              />
            ))}
          </div>
        )}

        {/* ── HEADER ── */}
        {activeSection === 'header' && (
          <div className="composer-blocks">
            <p className="composer-hint">Elige el estilo del encabezado:</p>
            {Object.entries(HEADERS).map(([id, block]) => (
              <BlockOption
                key={id}
                id={id}
                label={block.label}
                description={`Origen: ${block.origin}`}
                icon={block.icon}
                active={recipe.header === id}
                onClick={() => updateSlot('header', id)}
                color={recipe.theme.primaryColor}
              />
            ))}
          </div>
        )}

        {/* ── EXPERIENCE ── */}
        {activeSection === 'experience' && (
          <div className="composer-blocks">
            <p className="composer-hint">Elige cómo mostrar tu experiencia:</p>
            {Object.entries(EXPERIENCE).map(([id, block]) => (
              <BlockOption
                key={id}
                id={id}
                label={block.label}
                description={`Origen: ${block.origin}`}
                icon={block.icon}
                active={recipe.experience === id}
                onClick={() => updateSlot('experience', id)}
                color={recipe.theme.primaryColor}
              />
            ))}
          </div>
        )}

        {/* ── EDUCATION ── */}
        {activeSection === 'education' && (
          <div className="composer-blocks">
            <p className="composer-hint">Elige cómo mostrar tu educación:</p>
            {Object.entries(EDUCATION).map(([id, block]) => (
              <BlockOption
                key={id}
                id={id}
                label={block.label}
                description={`Origen: ${block.origin}`}
                icon={block.icon}
                active={recipe.education === id}
                onClick={() => updateSlot('education', id)}
                color={recipe.theme.primaryColor}
              />
            ))}
          </div>
        )}

        {/* ── SKILLS ── */}
        {activeSection === 'skills' && (
          <div className="composer-blocks">
            <p className="composer-hint">Elige cómo mostrar tus habilidades:</p>
            {Object.entries(SKILLS).map(([id, block]) => (
              <BlockOption
                key={id}
                id={id}
                label={block.label}
                description={`Origen: ${block.origin}`}
                icon={block.icon}
                active={recipe.skills === id}
                onClick={() => updateSlot('skills', id)}
                color={recipe.theme.primaryColor}
              />
            ))}
          </div>
        )}

        {/* ── CONTACT ── */}
        {activeSection === 'contact' && (
          <div className="composer-blocks">
            <p className="composer-hint">Elige cómo mostrar tu contacto:</p>
            {Object.entries(CONTACT).map(([id, block]) => (
              <BlockOption
                key={id}
                id={id}
                label={block.label}
                description={`Origen: ${block.origin}`}
                icon={block.icon}
                active={recipe.contact === id}
                onClick={() => updateSlot('contact', id)}
                color={recipe.theme.primaryColor}
              />
            ))}
          </div>
        )}

        {/* ── THEME / COLORS ── */}
        {activeSection === 'theme' && (
          <div className="composer-theme">
            <p className="composer-hint">Personaliza los colores de tu diseño:</p>
            <ColorPicker label="Color Principal" value={recipe.theme.primaryColor} onChange={v => updateTheme('primaryColor', v)} />
            <ColorPicker label="Fondo" value={recipe.theme.backgroundColor} onChange={v => updateTheme('backgroundColor', v)} />
            <ColorPicker label="Texto" value={recipe.theme.textColor} onChange={v => updateTheme('textColor', v)} />

            {/* Quick colors */}
            <div className="composer-quick-colors">
              <span className="composer-quick-label">Colores rápidos:</span>
              <div className="composer-quick-row">
                {['#3b82f6','#8b5cf6','#e11d48','#0ea5e9','#10b981','#f59e0b','#ef4444','#6366f1','#ec4899','#14b8a6'].map(c => (
                  <button
                    key={c}
                    className="composer-quick-swatch"
                    style={{ background: c, boxShadow: recipe.theme.primaryColor === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none' }}
                    onClick={() => updateTheme('primaryColor', c)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Sub-componentes ── */

const BlockOption = ({ id, label, description, icon, active, onClick, color }) => (
  <button
    className={`composer-block ${active ? 'composer-block--active' : ''}`}
    onClick={onClick}
    style={{ '--block-color': color }}
  >
    <div className="composer-block-icon" style={{ background: active ? `${color}22` : 'rgba(255,255,255,0.03)', color: active ? color : 'rgba(255,255,255,0.4)' }}>
      <i className={`fa-solid ${icon}`} />
    </div>
    <div className="composer-block-info">
      <strong>{label}</strong>
      {description && <span>{description}</span>}
    </div>
    {active && (
      <div className="composer-block-check" style={{ background: color }}>
        <i className="fa-solid fa-check" />
      </div>
    )}
  </button>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div className="composer-color-field">
    <label>{label}</label>
    <div className="composer-color-input-wrap">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="composer-color-native" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="composer-color-text" maxLength={7} />
    </div>
  </div>
);

export default ComposerPanel;

export { STORAGE_KEY };

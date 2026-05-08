import React from 'react';

/**
 * SkillBlocks — 5 estilos para mostrar habilidades.
 * Cada bloque acepta: { items, theme, sectionTitle }
 *   items = array de strings
 */

/* ═══════════════════════════════════════
   1. Tags Simples (ResumeA)
   ═══════════════════════════════════════ */
export const TagsSkills = ({ items, theme, sectionTitle = 'Habilidades' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: '8px', marginBottom: '16px',
    }}>{sectionTitle}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
      {items?.map((s, i) => (
        <span key={i} style={{
          fontSize: '0.75rem', padding: '5px 13px', borderRadius: '6px',
          background: `${theme.primaryColor}12`, border: `1px solid ${theme.primaryColor}25`,
          color: theme.textColor, fontWeight: 600,
        }}>{s}</span>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   2. Badges Bold (ResumeD)
   ═══════════════════════════════════════ */
export const BadgesBoldSkills = ({ items, theme, sectionTitle = 'Habilidades' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      marginBottom: '16px',
    }}>{sectionTitle}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {items?.map((s, i) => (
        <span key={i} style={{
          fontSize: '0.78rem', padding: '6px 16px', borderRadius: '20px',
          background: `${theme.primaryColor}15`, border: `2px solid ${theme.primaryColor}44`,
          color: theme.primaryColor, fontWeight: 700,
          letterSpacing: '0.5px',
        }}>{s}</span>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   3. Pills Warm (ResumeE)
   ═══════════════════════════════════════ */
export const PillsWarmSkills = ({ items, theme, sectionTitle = 'Habilidades' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      marginBottom: '16px',
    }}>{sectionTitle}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {items?.map((s, i) => (
        <span key={i} style={{
          fontSize: '0.72rem', padding: '5px 14px', borderRadius: '15px',
          background: theme.primaryColor, color: '#fff', fontWeight: 600,
          opacity: 0.85 + (i % 3) * 0.05,
        }}>{s}</span>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   4. Circles con Abreviatura (ResumeF)
   ═══════════════════════════════════════ */
export const CirclesAbbrSkills = ({ items, theme, sectionTitle = 'Habilidades' }) => {
  const getAbbr = (skill) => {
    const words = skill.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return skill.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ padding: '0 40px 20px' }}>
      <h2 style={{
        fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '2px', color: theme.primaryColor,
        marginBottom: '16px',
      }}>{sectionTitle}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {items?.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: `hsla(${(i * 47) % 360}, 65%, 45%, 0.15)`,
              border: `2px solid hsla(${(i * 47) % 360}, 70%, 65%, 0.5)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 800, color: `hsl(${(i * 47) % 360}, 70%, 55%)`,
            }}>
              {getAbbr(s)}
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: `${theme.textColor}88`, textAlign: 'center' }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   5. Progress Bars (SmartComponents)
   ═══════════════════════════════════════ */
export const ProgressBarsSkills = ({ items, theme, sectionTitle = 'Habilidades' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      marginBottom: '16px',
    }}>{sectionTitle}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 28px' }}>
      {items?.map((s, i) => {
        const level = 70 + ((i * 13) % 25); // Variación visual entre 70-95%
        return (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.textColor }}>{s}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.primaryColor }}>{level}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: `${theme.primaryColor}15`, borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${level}%`, height: '100%', background: theme.primaryColor, borderRadius: '10px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   6. Neon Tags (CreativeTemplate)
   ═══════════════════════════════════════ */
export const NeonTagsSkills = ({ items, theme, sectionTitle = 'Habilidades' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      marginBottom: '16px',
    }}>{sectionTitle}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {items?.map((s, i) => (
        <span key={i} style={{
          fontSize: '0.76rem', padding: '6px 16px', borderRadius: '8px',
          background: `${theme.primaryColor}10`,
          border: `1.5px solid ${theme.primaryColor}35`,
          color: theme.primaryColor, fontWeight: 700,
          boxShadow: `0 0 8px ${theme.primaryColor}15`,
        }}>{s}</span>
      ))}
    </div>
  </div>
);

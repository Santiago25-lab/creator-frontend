import React from 'react';

/**
 * ExperienceBlocks — 4 estilos para mostrar experiencia laboral.
 * Cada bloque acepta: { items, theme, sectionTitle }
 *   items = array de { period, title, description }
 *   theme = { primaryColor, backgroundColor, textColor }
 */

/* ═══════════════════════════════════════
   1. Standard (ResumeA)
   ═══════════════════════════════════════ */
export const StandardExp = ({ items, theme, sectionTitle = 'Experiencia' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: '8px', marginBottom: '20px',
    }}>{sectionTitle}</h2>
    {items?.map((exp, i) => (
      <div key={i} style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: theme.textColor, margin: 0 }}>{exp.title}</h4>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: `${theme.textColor}66` }}>{exp.period}</span>
        </div>
        {exp.description && (
          <p style={{ fontSize: '0.82rem', color: `${theme.textColor}88`, marginTop: '6px', lineHeight: 1.7 }}>{exp.description}</p>
        )}
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════
   2. Timeline con Dots (CreativeTemplate)
   ═══════════════════════════════════════ */
export const TimelineDotsExp = ({ items, theme, sectionTitle = 'Experiencia' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      marginBottom: '20px',
    }}>{sectionTitle}</h2>
    <div style={{ borderLeft: `2px solid ${theme.primaryColor}33`, paddingLeft: '24px', marginLeft: '6px' }}>
      {items?.map((exp, i) => (
        <div key={i} style={{ marginBottom: '22px', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: '-31px', top: '4px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: theme.primaryColor,
            boxShadow: `0 0 8px ${theme.primaryColor}66`,
          }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: theme.textColor, margin: 0 }}>{exp.title}</h4>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.primaryColor, display: 'block', marginTop: '3px' }}>{exp.period}</span>
          {exp.description && (
            <p style={{ fontSize: '0.82rem', color: `${theme.textColor}88`, marginTop: '6px', lineHeight: 1.7 }}>{exp.description}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   3. Diamond Card (ResumeE)
   ═══════════════════════════════════════ */
export const DiamondCardExp = ({ items, theme, sectionTitle = 'Experiencia' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      marginBottom: '20px',
    }}>{sectionTitle}</h2>
    <div style={{
      border: `1.5px solid ${theme.primaryColor}22`,
      borderRadius: '14px', padding: '22px',
      background: `${theme.primaryColor}05`,
    }}>
      {items?.map((exp, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < items.length - 1 ? '16px' : 0 }}>
          <span style={{ color: theme.primaryColor, fontSize: '0.9rem', marginTop: '2px', flexShrink: 0 }}>✦</span>
          <div>
            <strong style={{ fontSize: '0.9rem', color: theme.textColor }}>{exp.title}</strong>
            {exp.period && <span style={{ color: `${theme.textColor}55`, fontSize: '0.72rem', marginLeft: '8px' }}>{exp.period}</span>}
            {exp.description && (
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: `${theme.textColor}77`, lineHeight: 1.6 }}>{exp.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   4. Dates Split (ResumeD)
   ═══════════════════════════════════════ */
export const DatesSplitExp = ({ items, theme, sectionTitle = 'Experiencia' }) => {
  const splitTitle = (title) => {
    if (!title) return { role: '', company: '' };
    const parts = title.split(/·|—|-/);
    return { role: parts[0]?.trim() || '', company: parts[1]?.trim() || '' };
  };

  return (
    <div style={{ padding: '0 40px 20px' }}>
      <h2 style={{
        fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '2px', color: theme.primaryColor,
        marginBottom: '20px',
      }}>{sectionTitle}</h2>
      {items?.map((exp, i) => {
        const { role, company } = splitTitle(exp.title);
        return (
          <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ minWidth: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {exp.period?.split(/—|-/).map((d, j) => (
                <span key={j} style={{
                  fontSize: '0.72rem', fontWeight: 700, color: theme.primaryColor,
                  background: `${theme.primaryColor}11`, padding: '2px 10px',
                  borderRadius: '10px',
                }}>{d.trim()}</span>
              ))}
              <div style={{ width: '2px', height: '20px', background: `${theme.primaryColor}22` }} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: theme.textColor, margin: 0 }}>{role}</h4>
              {company && <p style={{ fontSize: '0.8rem', color: theme.primaryColor, fontWeight: 600, margin: '2px 0' }}>{company}</p>}
              {exp.description && (
                <p style={{ fontSize: '0.82rem', color: `${theme.textColor}77`, marginTop: '6px', lineHeight: 1.7 }}>{exp.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

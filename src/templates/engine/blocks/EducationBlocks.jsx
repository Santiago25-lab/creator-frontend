import React from 'react';

/**
 * EducationBlocks — 3 estilos para mostrar educación.
 * Cada bloque acepta: { items, theme, sectionTitle }
 *   items = array de { period, degree, institution }
 */

/* ═══════════════════════════════════════
   1. Compact (ResumeA/B)
   ═══════════════════════════════════════ */
export const CompactEdu = ({ items, theme, sectionTitle = 'Educación' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      borderBottom: `2px solid ${theme.primaryColor}`,
      paddingBottom: '8px', marginBottom: '20px',
    }}>{sectionTitle}</h2>
    {items?.map((edu, i) => (
      <div key={i} style={{ marginBottom: '14px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: theme.textColor, margin: 0 }}>{edu.degree}</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.8rem', color: `${theme.textColor}77` }}>
          <span>{edu.institution}</span>
          <span style={{ fontWeight: 600, color: `${theme.textColor}55` }}>{edu.period}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════
   2. Period Badge (ResumeD)
   ═══════════════════════════════════════ */
export const PeriodBadgeEdu = ({ items, theme, sectionTitle = 'Educación' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      marginBottom: '20px',
    }}>{sectionTitle}</h2>
    {items?.map((edu, i) => (
      <div key={i} style={{ marginBottom: '16px' }}>
        {edu.period && (
          <span style={{
            display: 'inline-block', fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 12px', borderRadius: '10px',
            background: `${theme.primaryColor}15`, color: theme.primaryColor,
            marginBottom: '6px',
          }}>{edu.period}</span>
        )}
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: theme.textColor, margin: '4px 0 2px' }}>{edu.degree}</h4>
        <p style={{ fontSize: '0.8rem', color: `${theme.textColor}66`, margin: 0 }}>{edu.institution}</p>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════
   3. Diamond List (ResumeE)
   ═══════════════════════════════════════ */
export const DiamondListEdu = ({ items, theme, sectionTitle = 'Educación' }) => (
  <div style={{ padding: '0 40px 20px' }}>
    <h2 style={{
      fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '2px', color: theme.primaryColor,
      marginBottom: '20px',
    }}>{sectionTitle}</h2>
    {items?.map((edu, i) => (
      <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
        <span style={{ color: theme.primaryColor, fontSize: '0.85rem', marginTop: '1px', flexShrink: 0 }}>✦</span>
        <div>
          {edu.period && <p style={{ fontSize: '0.7rem', fontWeight: 600, color: `${theme.textColor}55`, margin: '0 0 3px' }}>{edu.period}</p>}
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: theme.textColor, margin: 0 }}>{edu.degree}</p>
          {edu.institution && (
            <p style={{ fontSize: '0.8rem', color: `${theme.textColor}66`, margin: '2px 0 0' }}>{edu.institution}</p>
          )}
        </div>
      </div>
    ))}
  </div>
);

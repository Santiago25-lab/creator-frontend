import React from 'react';

/**
 * ContactBlocks — 3 estilos para mostrar información de contacto.
 * Cada bloque acepta: { data, theme }
 *   data = personalInfo (email, phone, address, website)
 */

/* ═══════════════════════════════════════
   1. Icon List (ResumeA)
   ═══════════════════════════════════════ */
export const IconListContact = ({ data, theme, sectionTitle = 'Contacto' }) => {
  const items = [
    { icon: 'fa-envelope', value: data.email },
    { icon: 'fa-phone', value: data.phone },
    { icon: 'fa-location-dot', value: data.address },
    { icon: 'fa-globe', value: data.website },
  ].filter(item => item.value);

  return (
    <div style={{ padding: '0 40px 20px' }}>
      <h2 style={{
        fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '2px', color: theme.primaryColor,
        borderBottom: `2px solid ${theme.primaryColor}`,
        paddingBottom: '8px', marginBottom: '16px',
      }}>{sectionTitle}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem' }}>
            <i className={`fa-solid ${item.icon}`} style={{ width: '16px', color: theme.primaryColor, fontSize: '0.85rem' }} />
            <span style={{ color: `${theme.textColor}cc` }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   2. Pills con Emoji (CreativeTemplate)
   ═══════════════════════════════════════ */
export const PillsEmojiContact = ({ data, theme, sectionTitle = 'Contacto' }) => {
  const items = [
    { emoji: '📍', value: data.address },
    { emoji: '✉️', value: data.email },
    { emoji: '📞', value: data.phone },
    { emoji: '🌐', value: data.website },
  ].filter(item => item.value);

  return (
    <div style={{ padding: '0 40px 20px' }}>
      <h2 style={{
        fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '2px', color: theme.primaryColor,
        marginBottom: '16px',
      }}>{sectionTitle}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontSize: '0.76rem', padding: '6px 14px', borderRadius: '20px',
            background: `${theme.primaryColor}10`, border: `1px solid ${theme.primaryColor}22`,
            color: `${theme.textColor}bb`,
          }}>
            <span style={{ marginRight: '6px' }}>{item.emoji}</span>{item.value}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   3. Dark Glow Cards (ResumeF)
   ═══════════════════════════════════════ */
export const DarkGlowContact = ({ data, theme, sectionTitle = 'Contacto' }) => {
  const items = [
    { icon: 'fa-envelope', value: data.email },
    { icon: 'fa-phone', value: data.phone },
    { icon: 'fa-location-dot', value: data.address },
    { icon: 'fa-globe', value: data.website },
  ].filter(item => item.value);

  return (
    <div style={{ padding: '0 40px 20px' }}>
      <h2 style={{
        fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '2px', color: theme.primaryColor,
        marginBottom: '16px',
      }}>{sectionTitle}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '10px 16px', borderRadius: '10px',
            background: `${theme.primaryColor}08`,
            border: `1px solid ${theme.primaryColor}18`,
          }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: `${theme.primaryColor}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: '0.75rem', color: theme.primaryColor }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: `${theme.textColor}bb` }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

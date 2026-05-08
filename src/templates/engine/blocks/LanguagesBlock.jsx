import React from 'react';

/**
 * LanguagesBlock — Bloque reutilizable para renderizar idiomas.
 * Extraído de ComposedTemplate donde se repetía 3 veces (una por layout).
 *
 * @param {string[]} items — Array de idiomas (ej: ["Español (Nativo)", "Inglés (B2)"])
 * @param {Object}   theme — { primaryColor, textColor }
 * @param {string}   padding — CSS padding (varía según el layout)
 */
const LanguagesBlock = ({ items, theme, padding = '0 40px 20px' }) => {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding }}>
      <h2 style={{
        fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '2px', color: theme.primaryColor,
        marginBottom: '12px',
      }}>Idiomas</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((l, i) => (
          <span key={i} style={{
            fontSize: '0.82rem', color: `${theme.textColor}bb`,
            padding: '4px 0',
          }}>• {l}</span>
        ))}
      </div>
    </div>
  );
};

export default LanguagesBlock;

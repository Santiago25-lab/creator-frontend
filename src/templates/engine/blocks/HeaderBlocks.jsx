import React from 'react';

/**
 * HeaderBlocks — 6 estilos de header extraídos de las plantillas existentes.
 * Cada header acepta: { data, theme, photo }
 *   data = personalInfo (name, title, email, phone, address, website, aboutMe)
 *   theme = { primaryColor, backgroundColor, textColor }
 *   photo = URL de la foto de perfil
 */

/* ═══════════════════════════════════════
   1. Sidebar con Foto (ResumeA)
   ═══════════════════════════════════════ */
export const SidebarPhotoHeader = ({ data, theme }) => (
  <div style={{ textAlign: 'center', padding: '35px 20px 25px' }}>
    <div style={{
      width: '120px', height: '120px', borderRadius: '50%',
      margin: '0 auto 20px', overflow: 'hidden',
      border: `3px solid ${theme.primaryColor}33`,
      background: `${theme.primaryColor}11`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img
        src={data.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&size=200&background=${theme.primaryColor.replace('#','')}&color=fff&bold=true`}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          objectPosition: 'center top',
          borderRadius: '50%'
        }}
        alt={data.name || 'Foto de perfil'}
      />
    </div>
    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.primaryColor, margin: '0 0 4px', lineHeight: 1.2 }}>{data.name}</h1>
    <p style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', color: `${theme.textColor}99`, fontWeight: 600 }}>{data.title}</p>
  </div>
);

/* ═══════════════════════════════════════
   2. Centrado Limpio (ResumeB / Classic)
   ═══════════════════════════════════════ */
export const CenteredCleanHeader = ({ data, theme }) => (
  <div style={{ textAlign: 'center', padding: '50px 40px 30px', borderBottom: `3px solid ${theme.primaryColor}` }}>
    {data.photo && (
      <div style={{ width: '90px', height: '90px', borderRadius: '50%', margin: '0 auto 20px', overflow: 'hidden', border: `2px solid ${theme.primaryColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={data.photo}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center top',
            borderRadius: '50%'
          }} 
          alt={data.name || 'Foto de perfil'}
        />
      </div>
    )}
    <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: theme.textColor, margin: 0, textTransform: 'uppercase', letterSpacing: '3px' }}>{data.name}</h1>
    <p style={{ fontSize: '1rem', letterSpacing: '4px', textTransform: 'uppercase', color: theme.primaryColor, marginTop: '8px', fontWeight: 600 }}>{data.title}</p>
    {data.aboutMe && (
      <p style={{ fontSize: '0.85rem', color: `${theme.textColor}88`, marginTop: '18px', maxWidth: '550px', margin: '18px auto 0', lineHeight: 1.7 }}>{data.aboutMe}</p>
    )}
  </div>
);

/* ═══════════════════════════════════════
   3. Bold Editorial (ResumeD)
   ═══════════════════════════════════════ */
export const BoldEditorialHeader = ({ data, theme }) => (
  <div style={{ padding: '45px 40px 30px' }}>
    {data.photo && (
      <div style={{ width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', border: `3px solid ${theme.primaryColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={data.photo}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center top',
            borderRadius: '16px'
          }} 
          alt={data.name || 'Foto de perfil'}
        />
      </div>
    )}
    <h1 style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 0.95, color: theme.textColor, textTransform: 'uppercase', letterSpacing: '-2px', margin: 0 }}>{data.name}</h1>
    {data.title && (
      <span style={{ display: 'inline-block', marginTop: '14px', padding: '6px 18px', background: `${theme.primaryColor}15`, border: `1.5px solid ${theme.primaryColor}44`, borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: theme.primaryColor, letterSpacing: '1px', textTransform: 'uppercase' }}>{data.title}</span>
    )}
    {data.aboutMe && (
      <p style={{ fontSize: '0.85rem', color: `${theme.textColor}77`, marginTop: '18px', lineHeight: 1.7, maxWidth: '500px' }}>{data.aboutMe}</p>
    )}
  </div>
);

/* ═══════════════════════════════════════
   4. Warm Hello (ResumeE)
   ═══════════════════════════════════════ */
export const WarmHelloHeader = ({ data, theme }) => {
  const firstName = data.name?.split(' ')[0] || 'Tú';
  return (
    <div style={{ padding: '50px 40px 30px', display: 'flex', alignItems: 'center', gap: '30px' }}>
      {data.photo && (
        <div style={{ width: '110px', height: '110px', borderRadius: '30px', overflow: 'hidden', transform: 'rotate(-3deg)', border: `4px solid ${theme.primaryColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={data.photo}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              objectPosition: 'center top',
              borderRadius: '30px'
            }} 
            alt={data.name || 'Foto de perfil'}
          />
        </div>
      )}
      <div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: theme.textColor, lineHeight: 1.1, marginBottom: '8px' }}>
          ¡Hola, soy {firstName}!
          <span style={{ color: theme.primaryColor, marginLeft: '10px', fontSize: '1.8rem' }}>✦</span>
        </h1>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: theme.primaryColor, margin: '10px 0' }}>{data.title}</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   5. Dark Impact (ResumeF)
   ═══════════════════════════════════════ */
export const DarkImpactHeader = ({ data, theme }) => (
  <div style={{ padding: '55px 40px 35px', background: theme.primaryColor, color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '30px' }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.06, background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #fff 20px, #fff 21px)' }} />
    {data.photo && (
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.3)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={data.photo}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center top',
            borderRadius: '50%'
          }} 
          alt={data.name || 'Foto de perfil'}
        />
      </div>
    )}
    <div style={{ position: 'relative' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '6px', margin: 0 }}>Currículum</h1>
      <p style={{ fontSize: '1.1rem', fontWeight: 600, opacity: 0.85, marginTop: '10px' }}>{data.name}</p>
      <p style={{ fontSize: '0.85rem', opacity: 0.65, marginTop: '4px' }}>{data.title}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   6. Neon Gradient (CreativeTemplate)
   ═══════════════════════════════════════ */
export const NeonGradientHeader = ({ data, theme }) => (
  <div style={{ padding: '50px 40px 30px', borderBottom: `1px solid ${theme.primaryColor}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ flex: 1 }}>
      <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}88)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>{data.name}</h1>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: theme.primaryColor, marginTop: '8px', letterSpacing: '1px' }}>{data.title}</h3>
      <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
        {data.email && <span style={{ fontSize: '0.75rem', color: `${theme.textColor}99` }}>✉️ {data.email}</span>}
        {data.phone && <span style={{ fontSize: '0.75rem', color: `${theme.textColor}99` }}>📞 {data.phone}</span>}
      </div>
    </div>
    {data.photo && (
      <div style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', border: `5px solid ${theme.primaryColor}11`, padding: '5px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={data.photo}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center top',
            borderRadius: '50%'
          }} 
          alt={data.name || 'Foto de perfil'}
        />
      </div>
    )}
  </div>
);

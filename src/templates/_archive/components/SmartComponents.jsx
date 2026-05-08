import React from 'react';

// CABECERAS
export const HeaderV1 = ({ data, settings }) => (
  <div style={{ textAlign: 'center', padding: '40px', borderBottom: `4px solid ${settings.primaryColor}` }}>
    <h1 style={{ fontSize: '3.5rem', margin: 0, color: settings.primaryColor, fontWeight: 900, textTransform: 'uppercase' }}>{data.name}</h1>
    <p style={{ fontSize: '1.2rem', letterSpacing: '4px', opacity: 0.7, textTransform: 'uppercase' }}>{data.title}</p>
  </div>
);

export const HeaderV2 = ({ data, settings }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px', background: settings.primaryColor, color: 'white' }}>
    <div>
      <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 800 }}>{data.name}</h1>
      <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>{data.title}</p>
    </div>
    <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
      <p><i className="fa-solid fa-envelope"></i> {data.email}</p>
      <p><i className="fa-solid fa-phone"></i> {data.phone}</p>
    </div>
  </div>
);

export const HeaderV3 = ({ data, settings, profileImage }) => (
  <div style={{ width: '320px', minHeight: '100%', background: settings.primaryColor, color: 'white', padding: '60px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ width: '180px', height: '180px', borderRadius: '15px', background: '#fff', marginBottom: '30px', overflow: 'hidden', border: '5px solid rgba(255,255,255,0.2)' }}>
      <img src={profileImage || `https://ui-avatars.com/api/?name=${data.name}&background=fff&color=${settings.primaryColor.replace('#','')}&size=180`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <h1 style={{ fontSize: '2.2rem', textAlign: 'center', lineHeight: '1', fontWeight: '900', textTransform: 'uppercase' }}>
      {data.name.split(' ')[0]} <br/> <span style={{ color: 'rgba(255,255,255,0.6)' }}>{data.name.split(' ')[1] || ''}</span>
    </h1>
    <p style={{ marginTop: '15px', fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 'bold' }}>{data.title}</p>
    
    <div style={{ marginTop: '50px', width: '100%', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div><i className="fa-solid fa-envelope" style={{ width: '25px' }}></i> {data.email}</div>
      <div><i className="fa-solid fa-phone" style={{ width: '25px' }}></i> {data.phone}</div>
      <div><i className="fa-solid fa-location-dot" style={{ width: '25px' }}></i> {data.address}</div>
    </div>
  </div>
);

export const HeaderV4 = ({ data, settings }) => (
  <div style={{ display: 'flex', width: '100%', paddingBottom: '40px' }}>
    <div style={{ flex: 1, paddingRight: '40px' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: '0.85', textTransform: 'uppercase', color: '#000', letterSpacing: '-4px' }}>
        {data.name.split(' ')[0]} <br/> {data.name.split(' ')[1] || ''}
      </h1>
    </div>
    <div style={{ width: '2px', background: '#eee', margin: '0 40px' }}></div>
    <div style={{ flex: 1.2 }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', color: '#000', letterSpacing: '2px', marginBottom: '20px' }}>CURRICULUM</h2>
    </div>
  </div>
);

// TÍTULOS DE SECCIÓN
export const SectionTitleV1 = ({ title, color }) => (
  <div style={{ marginTop: '40px', marginBottom: '20px' }}>
    <h2 style={{ fontSize: '1.4rem', color: color, borderBottom: `3px solid ${color}`, paddingBottom: '8px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}>
      {title}
    </h2>
  </div>
);

export const SectionTitleV2 = ({ title, color }) => (
  <div style={{ marginTop: '40px', marginBottom: '20px' }}>
    <h2 style={{ fontSize: '1.4rem', color: 'white', background: color, padding: '12px 25px', borderRadius: '0 50px 50px 0', marginLeft: '-40px', width: 'fit-content', fontWeight: 800 }}>
      {title}
    </h2>
  </div>
);

// COMPONENTES ESPECIALES
export const SkillBar = ({ skill, color }) => (
  <div style={{ marginBottom: '18px', width: '100%' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '700', color: '#444' }}>
      <span>{skill}</span>
      <span style={{ color: color }}>90%</span>
    </div>
    <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ width: `90%`, height: '100%', background: color, borderRadius: '10px' }}></div>
    </div>
  </div>
);

export const SkillSlider = ({ skill, level, color }) => (
  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#000', flex: 1 }}>{skill}</span>
    <div style={{ flex: 2, position: 'relative', height: '2px', background: '#ccc' }}>
      <div style={{ position: 'absolute', right: `${100 - level}%`, top: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }}></div>
    </div>
  </div>
);

export const LanguageDots = ({ language, level, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
    <div style={{ display: 'flex', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: i <= level ? color : '#eee' }}></div>
      ))}
    </div>
    <span style={{ fontSize: '1rem', fontWeight: '600' }}>{language}</span>
  </div>
);

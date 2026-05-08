import React from 'react';

const fonts = [
  { name: 'Poppins', family: "'Poppins', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Playfair', family: "'Playfair Display', serif" },
  { name: 'Inter', family: "'Inter', sans-serif" },
  { name: 'Roboto', family: "'Roboto', sans-serif" },
  { name: 'Archivo', family: "'Archivo Black', sans-serif" },
  { name: 'Lora', family: "'Lora', serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" }
];

const TopToolbar = ({ selected, isEditMode }) => {
  if (!isEditMode || !selected) return (
    <div style={{ height: '60px', display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', padding: '0 25px', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
       {isEditMode ? '✨ Haz clic en un elemento para empezar a diseñar' : '🚀 Activa el Modo Editor para mover y redimensionar piezas'}
    </div>
  );

  return (
    <div style={{
      height: '60px',
      background: '#0f172a',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '0 20px',
      border: '1px solid #3b82f6',
      color: 'white',
      width: '100%',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      zIndex: 2000
    }}>
      {/* TIPO DE ELEMENTO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 15px', borderRadius: '10px' }}>
        <i className={`fa-solid ${selected.type === 'text' ? 'fa-font' : 'fa-shapes'}`} style={{ color: '#3b82f6' }}></i>
        <span style={{ fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', color: '#3b82f6', letterSpacing: '1px' }}>{selected.type}</span>
      </div>

      <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>

      {/* SELECTOR DE FUENTES (Solo para texto) */}
      {selected.type === 'text' && (
        <>
          <select 
            value={selected.fontFamily} 
            onChange={(e) => selected.setFontFamily(e.target.value)}
            style={selectStyle}
          >
            {fonts.map(f => <option key={f.name} value={f.family}>{f.name}</option>)}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="number" 
              value={selected.fontSize} 
              onChange={(e) => selected.setFontSize(parseInt(e.target.value) || 12)}
              style={inputStyle}
            />
            <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>PX</span>
          </div>

          <button onClick={() => selected.setIsBold(!selected.isBold)} style={btnStyle(selected.isBold)}>
            <i className="fa-solid fa-bold"></i>
          </button>
        </>
      )}

      {/* COLOR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', width: '28px', height: '28px', borderRadius: '50%', background: selected.color, border: '2px solid white', cursor: 'pointer' }}>
          <input 
            type="color" 
            value={selected.color} 
            onChange={(e) => selected.setColor(e.target.value)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer', opacity: 0 }}
          />
        </div>
      </div>

      <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>

      {/* CAPAS */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={actionBtnStyle} title="Alinear Izquierda"><i className="fa-solid fa-align-left"></i></button>
        <button style={actionBtnStyle} title="Centrar"><i className="fa-solid fa-align-center"></i></button>
        <button style={actionBtnStyle} title="Traer al frente"><i className="fa-solid fa-layer-group"></i></button>
      </div>

      <div style={{ marginLeft: 'auto' }}>
        <button onClick={() => selected.setIsSelected(false)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
          CERRAR EDITOR
        </button>
      </div>
    </div>
  );
};

const selectStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '13px',
  outline: 'none',
  cursor: 'pointer'
};

const inputStyle = {
  width: '50px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  borderRadius: '8px',
  padding: '6px',
  fontSize: '13px',
  textAlign: 'center'
};

const btnStyle = (active) => ({
  background: active ? '#3b82f6' : 'rgba(255,255,255,0.05)',
  border: 'none',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: '0.2s'
});

const actionBtnStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: 'none',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.9rem'
};

export default TopToolbar;

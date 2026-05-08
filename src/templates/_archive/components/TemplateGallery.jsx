import React from 'react';

const templates = [
  { id: 'open-clean', name: 'Open Clean', tag: 'ATS Friendly', color: '#3b82f6', icon: 'fa-file-invoice' },
  { id: 'open-modern', name: 'Modern Sidebar', tag: 'Creative', color: '#8b5cf6', icon: 'fa-table-columns' },
  { id: 'open-elegant', name: 'Elegant Serif', tag: 'Executive', color: '#f59e0b', icon: 'fa-feather-pointed' }
];

const TemplateGallery = ({ activeTemplate, onSelect }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', padding: '10px' }}>
      {templates.map(tpl => (
        <div 
          key={tpl.id}
          onClick={() => onSelect(tpl.id)}
          style={{ 
            background: '#1e293b', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            cursor: 'pointer',
            border: activeTemplate === tpl.id ? `2px solid ${tpl.color}` : '2px solid transparent',
            transition: '0.3s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {/* PREVIEW PLACEHOLDER (Representación visual) */}
          <div style={{ height: '120px', background: `linear-gradient(135deg, ${tpl.color}22 0%, #1e293b 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <i className={`fa-solid ${tpl.icon}`} style={{ fontSize: '2.5rem', color: tpl.color, opacity: 0.5 }}></i>
          </div>
          
          <div style={{ padding: '12px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{tpl.name}</span>
                <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', background: `${tpl.color}33`, color: tpl.color }}>{tpl.tag}</span>
             </div>
          </div>

          {activeTemplate === tpl.id && (
             <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRadius: '50%', background: tpl.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-check" style={{ fontSize: '10px', color: 'white' }}></i>
             </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TemplateGallery;

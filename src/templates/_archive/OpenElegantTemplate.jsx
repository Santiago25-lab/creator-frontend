import React from 'react';
import SmartLayer from './components/SmartLayer';

const OpenElegantTemplate = ({ cvData, profileImage, globalFont, isEditMode, onSelect, pageNumber = 1 }) => {
  return (
    <div className="elegant-resume-container" style={{ 
      width: '800px', 
      minHeight: '1130px', 
      background: '#fff', 
      padding: '40px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
      position: 'relative',
      fontFamily: "'Lora', serif",
      color: '#1a1a1a',
      border: '20px solid #f8fafc'
    }}>
      
      {/* BORDE DECORATIVO INTERNO */}
      <div style={{ 
        border: '1px solid #e2e8f0', 
        height: '100%', 
        padding: '50px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* HEADER ELEGANTE (Centrado) */}
        {pageNumber === 1 && (
           <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <SmartLayer initialText={cvData.personalInfo.name} initialSize={42} initialBold={false} initialColor="#111827" isEditMode={isEditMode} onSelect={onSelect} style={{ fontFamily: "'Lora', serif", letterSpacing: '-1px', textTransform: 'capitalize' }} />
              <div style={{ width: '40px', height: '2px', background: '#111827', margin: '20px auto' }}></div>
              <SmartLayer initialText={cvData.personalInfo.title} initialSize={14} initialBold={true} initialColor="#64748b" isEditMode={isEditMode} onSelect={onSelect} style={{ textTransform: 'uppercase', letterSpacing: '4px' }} />
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-envelope"></i>
                    <SmartLayer initialText={cvData.personalInfo.email} isEditMode={isEditMode} onSelect={onSelect} />
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-phone"></i>
                    <SmartLayer initialText={cvData.personalInfo.phone} isEditMode={isEditMode} onSelect={onSelect} />
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-location-dot"></i>
                    <SmartLayer initialText={cvData.personalInfo.address} isEditMode={isEditMode} onSelect={onSelect} />
                 </div>
              </div>
           </div>
        )}

        {/* CONTENIDO EN DOS COLUMNAS DE LUJO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px', flex: 1 }}>
           
           {/* COLUMNA IZQUIERDA (Perfil y Skills) */}
           <div style={{ borderRight: '1px solid #f1f5f9', paddingRight: '30px' }}>
              <div style={{ marginBottom: '40px' }}>
                 <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px' }}>SUMARIO</h3>
                 <SmartLayer initialText={cvData.personalInfo.aboutMe} initialSize={13} initialColor="#4b5563" isEditMode={isEditMode} onSelect={onSelect} style={{ lineHeight: '1.8', fontStyle: 'italic' }} />
              </div>

              <div style={{ marginBottom: '40px' }}>
                 <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px' }}>EXPERTISE</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {cvData.skills.map((skill, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#111827' }}></div>
                         <SmartLayer initialText={skill} initialSize={13} isEditMode={isEditMode} onSelect={onSelect} />
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* COLUMNA DERECHA (Experiencia y Educación) */}
           <div>
              <div style={{ marginBottom: '50px' }}>
                 <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', marginBottom: '30px', color: '#111827' }}>TRAYECTORIA PROFESIONAL</h3>
                 {cvData.experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '35px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                          <SmartLayer initialText={exp.title} initialSize={17} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ fontFamily: "'Lora', serif" }} />
                          <SmartLayer initialText={exp.period} initialSize={11} isEditMode={isEditMode} onSelect={onSelect} style={{ opacity: 0.5, fontWeight: 'bold' }} />
                       </div>
                       <SmartLayer initialText={exp.description} initialSize={13} initialColor="#4b5563" isEditMode={isEditMode} onSelect={onSelect} style={{ lineHeight: '1.7' }} />
                    </div>
                 ))}
              </div>

              <div>
                 <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', marginBottom: '30px', color: '#111827' }}>FORMACIÓN</h3>
                 {cvData.education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '20px' }}>
                       <SmartLayer initialText={edu.degree} initialSize={14} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', opacity: 0.7 }}>
                          <SmartLayer initialText={edu.institution} initialSize={12} isEditMode={isEditMode} onSelect={onSelect} />
                          <SmartLayer initialText={edu.period} initialSize={11} isEditMode={isEditMode} onSelect={onSelect} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>

    </div>
  );
};

export default OpenElegantTemplate;

import React from 'react';
import { Rnd } from 'react-rnd';
import SmartLayer from './components/SmartLayer';

const OpenModernTemplate = ({ cvData, profileImage, globalFont, isEditMode, onSelect, pageNumber = 1 }) => {
  return (
    <div className="modern-resume-container" style={{ 
      width: '800px', 
      minHeight: '1130px', 
      background: '#fff', 
      display: 'flex', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
      position: 'relative',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* BARRA LATERAL ESTRUCTURAL */}
      <div style={{ 
        width: '280px', 
        background: '#1e293b', 
        color: '#fff', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '40px 30px'
      }}>
        
        {/* FOTO Y NOMBRE (CABECERA LATERAL) */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
           <div style={{ 
             width: '140px', 
             height: '140px', 
             borderRadius: '20px', 
             background: '#334155', 
             margin: '0 auto 25px', 
             overflow: 'hidden',
             border: '4px solid rgba(255,255,255,0.1)',
             transform: 'rotate(-3deg)'
           }}>
              <img src={profileImage || `https://ui-avatars.com/api/?name=${cvData.personalInfo.name}&size=200&background=1e293b&color=fff`} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           </div>
           <SmartLayer initialText={cvData.personalInfo.name} initialSize={24} initialBold={true} initialColor="#fff" isEditMode={isEditMode} onSelect={onSelect} style={{ textTransform: 'uppercase', letterSpacing: '1px' }} />
           <SmartLayer initialText={cvData.personalInfo.title} initialSize={14} initialColor="#94a3b8" isEditMode={isEditMode} onSelect={onSelect} style={{ display: 'block', marginTop: '5px' }} />
        </div>

        {/* INFO DE CONTACTO */}
        <div style={{ marginBottom: '40px' }}>
           <h3 style={{ fontSize: '12px', letterSpacing: '2px', color: '#3b82f6', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>CONTACTO</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <i className="fa-solid fa-envelope" style={{ fontSize: '12px', color: '#3b82f6' }}></i>
                 <SmartLayer initialText={cvData.personalInfo.email} initialSize={11} initialColor="#cbd5e1" isEditMode={isEditMode} onSelect={onSelect} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <i className="fa-solid fa-phone" style={{ fontSize: '12px', color: '#3b82f6' }}></i>
                 <SmartLayer initialText={cvData.personalInfo.phone} initialSize={11} initialColor="#cbd5e1" isEditMode={isEditMode} onSelect={onSelect} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <i className="fa-solid fa-location-dot" style={{ fontSize: '12px', color: '#3b82f6' }}></i>
                 <SmartLayer initialText={cvData.personalInfo.address} initialSize={11} initialColor="#cbd5e1" isEditMode={isEditMode} onSelect={onSelect} />
              </div>
           </div>
        </div>

        {/* SKILLS */}
        <div>
           <h3 style={{ fontSize: '12px', letterSpacing: '2px', color: '#3b82f6', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>HABILIDADES</h3>
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cvData.skills.map((skill, i) => (
                <SmartLayer key={i} initialText={skill} initialSize={10} initialColor="#fff" isEditMode={isEditMode} onSelect={onSelect} style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
           </div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <div style={{ flex: 1, padding: '60px 50px', background: '#fff' }}>
        
        {/* PERFIL / SOBRE MÍ */}
        <div style={{ marginBottom: '50px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ width: '30px', height: '2px', background: '#3b82f6' }}></div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>PERFIL PROFESIONAL</h2>
           </div>
           <SmartLayer initialText={cvData.personalInfo.aboutMe || "Describe tu perfil aquí..."} initialSize={14} initialColor="#475569" isEditMode={isEditMode} onSelect={onSelect} style={{ lineHeight: '1.8' }} />
        </div>

        {/* EXPERIENCIA */}
        <div style={{ marginBottom: '50px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
              <div style={{ width: '30px', height: '2px', background: '#3b82f6' }}></div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>EXPERIENCIA LABORAL</h2>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', position: 'relative' }}>
              {/* Línea de tiempo vertical */}
              <div style={{ position: 'absolute', left: '-20px', top: '5px', bottom: '5px', width: '2px', background: '#f1f5f9' }}></div>

              {cvData.experience.map((exp, i) => (
                <div key={i} style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', left: '-24px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', border: '2px solid #fff' }}></div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <SmartLayer initialText={exp.title} initialSize={16} initialBold={true} initialColor="#1e293b" isEditMode={isEditMode} onSelect={onSelect} />
                      <SmartLayer initialText={exp.period} initialSize={12} initialColor="#3b82f6" initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ background: '#eff6ff', padding: '2px 10px', borderRadius: '15px' }} />
                   </div>
                   <SmartLayer initialText={exp.description} initialSize={13} initialColor="#64748b" isEditMode={isEditMode} onSelect={onSelect} style={{ lineHeight: '1.6', display: 'block', marginTop: '10px' }} />
                </div>
              ))}
           </div>
        </div>

        {/* EDUCACIÓN */}
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
              <div style={{ width: '30px', height: '2px', background: '#3b82f6' }}></div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>FORMACIÓN ACADÉMICA</h2>
           </div>
           {cvData.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                 <SmartLayer initialText={edu.degree} initialSize={15} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                    <SmartLayer initialText={edu.institution} initialSize={13} initialColor="#64748b" isEditMode={isEditMode} onSelect={onSelect} />
                    <SmartLayer initialText={edu.period} initialSize={12} initialColor="#94a3b8" isEditMode={isEditMode} onSelect={onSelect} />
                 </div>
              </div>
           ))}
        </div>

      </div>

    </div>
  );
};

export default OpenModernTemplate;

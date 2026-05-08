import React from 'react';
import { Rnd } from 'react-rnd';
import SmartLayer from './components/SmartLayer';
import './OpenResumeTemplate.css';

const DraggableItem = ({ defaultPos, children, isEditMode }) => (
  <Rnd
    default={defaultPos}
    disableDragging={!isEditMode}
    enableResizing={isEditMode}
    style={{ zIndex: 10 }}
  >
    {children}
  </Rnd>
);

const OpenResumeTemplate = ({ cvData, profileImage, globalFont, isEditMode, onSelect, pageNumber = 1 }) => {
  return (
    <div className="open-resume-cv" style={{ fontFamily: globalFont, position: 'relative', overflow: 'hidden', padding: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
      
      {/* HEADER (Página 1 únicamente) */}
      {pageNumber === 1 && (
        <DraggableItem defaultPos={{ x: 50, y: 50, width: 700, height: 'auto' }} isEditMode={isEditMode}>
           <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
              <SmartLayer initialText={cvData.personalInfo.name || "TU NOMBRE AQUÍ"} initialSize={42} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ textTransform: 'uppercase', letterSpacing: '2px' }} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px', opacity: 0.7 }}>
                 <SmartLayer initialText={cvData.personalInfo.email} initialSize={12} isEditMode={isEditMode} onSelect={onSelect} />
                 <span>•</span>
                 <SmartLayer initialText={cvData.personalInfo.phone} initialSize={12} isEditMode={isEditMode} onSelect={onSelect} />
                 <span>•</span>
                 <SmartLayer initialText={cvData.personalInfo.address} initialSize={12} isEditMode={isEditMode} onSelect={onSelect} />
              </div>
           </div>
        </DraggableItem>
      )}

      {/* SECCIÓN: EXPERIENCIA */}
      <DraggableItem defaultPos={{ x: 50, y: pageNumber === 1 ? 220 : 50, width: 700, height: 'auto' }} isEditMode={isEditMode}>
        <div style={{ width: '100%' }}>
          <div style={{ borderBottom: '1px solid #eee', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <SmartLayer initialText="EXPERIENCIA PROFESIONAL" initialSize={14} initialBold={true} initialColor="#3b82f6" isEditMode={isEditMode} onSelect={onSelect} style={{ letterSpacing: '1px' }} />
          </div>
          
          {cvData.experience && cvData.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <SmartLayer initialText={exp.title} initialSize={16} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
                  <SmartLayer initialText={exp.period} initialSize={12} isEditMode={isEditMode} onSelect={onSelect} style={{ opacity: 0.6 }} />
               </div>
               <SmartLayer initialText={exp.description} initialSize={13} isEditMode={isEditMode} onSelect={onSelect} style={{ marginTop: '5px', lineHeight: '1.6', display: 'block' }} />
            </div>
          ))}
        </div>
      </DraggableItem>

      {/* SECCIÓN: EDUCACIÓN */}
      <DraggableItem defaultPos={{ x: 50, y: 550, width: 700, height: 'auto' }} isEditMode={isEditMode}>
        <div style={{ width: '100%' }}>
          <div style={{ borderBottom: '1px solid #eee', marginBottom: '15px' }}>
             <SmartLayer initialText="EDUCACIÓN" initialSize={14} initialBold={true} initialColor="#3b82f6" isEditMode={isEditMode} onSelect={onSelect} style={{ letterSpacing: '1px' }} />
          </div>
          
          {cvData.education && cvData.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '15px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <SmartLayer initialText={edu.degree} initialSize={15} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
                  <SmartLayer initialText={edu.period} initialSize={12} isEditMode={isEditMode} onSelect={onSelect} style={{ opacity: 0.6 }} />
               </div>
               <SmartLayer initialText={edu.institution} initialSize={13} isEditMode={isEditMode} onSelect={onSelect} />
            </div>
          ))}
        </div>
      </DraggableItem>

      {/* SECCIÓN: SKILLS */}
      <DraggableItem defaultPos={{ x: 50, y: 800, width: 700, height: 'auto' }} isEditMode={isEditMode}>
        <div style={{ width: '100%' }}>
          <div style={{ borderBottom: '1px solid #eee', marginBottom: '15px' }}>
             <SmartLayer initialText="HABILIDADES Y APTITUDES" initialSize={14} initialBold={true} initialColor="#3b82f6" isEditMode={isEditMode} onSelect={onSelect} style={{ letterSpacing: '1px' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
             {cvData.skills && cvData.skills.map((skill, i) => (
               <SmartLayer key={i} initialText={skill} initialSize={12} isEditMode={isEditMode} onSelect={onSelect} style={{ background: '#f8fafc', padding: '4px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
             ))}
          </div>
        </div>
      </DraggableItem>

    </div>
  );
};

export default OpenResumeTemplate;

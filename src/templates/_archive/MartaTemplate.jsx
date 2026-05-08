import React from 'react';
import { Rnd } from 'react-rnd';
import SmartLayer from './components/SmartLayer';
import './MartaTemplate.css';

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

const MartaTemplate = ({ cvData, profileImage, globalFont, isEditMode, onSelect, pageNumber = 1 }) => {
  const nameParts = cvData.personalInfo.name.split(' ');
  const firstName = nameParts[0] || '';
  const remainingName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="marta-cv" style={{ fontFamily: globalFont, position: 'relative', overflow: 'hidden', padding: 0, background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)' }}>
      
      {/* LÍNEA CENTRAL PERSISTENTE */}
      <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', borderLeft: '2px dashed #bbb', pointerEvents: 'none' }}></div>

      {/* CONTENIDO PÁGINA 1 */}
      {pageNumber === 1 && (
        <>
          <DraggableItem defaultPos={{ x: 40, y: 60, width: 400, height: 'auto' }} isEditMode={isEditMode}>
            <div className="marta-name" style={{ padding: 0 }}>
              <SmartLayer initialText={firstName} initialSize={70} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
              <SmartLayer initialText={remainingName} initialSize={40} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ display: 'block' }} />
            </div>
          </DraggableItem>

          <DraggableItem defaultPos={{ x: 40, y: 550, width: 380, height: 380 }} isEditMode={isEditMode}>
            <div className="marta-photo" style={{ margin: 0 }}>
              <img src={profileImage || `https://ui-avatars.com/api/?name=${cvData.personalInfo.name}&size=500&background=fff&color=000`} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </DraggableItem>

          <DraggableItem defaultPos={{ x: 480, y: 60, width: 400, height: 'auto' }} isEditMode={isEditMode}>
            <div className="marta-section" style={{ margin: 0 }}>
              <SmartLayer initialText="EXPERIENCIA" initialSize={32} initialBold={true} initialColor="#7b3fe4" isEditMode={isEditMode} onSelect={onSelect} style={{ marginBottom: '20px' }} />
              {cvData.experience.map((exp, i) => (
                <div key={i} className="marta-item">
                  <SmartLayer initialText={exp.period} initialSize={12} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ background: '#e5e5e5', padding: '2px 10px' }} />
                  <SmartLayer initialText={exp.title} initialSize={16} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
                  <SmartLayer initialText={exp.description} initialSize={13} isEditMode={isEditMode} onSelect={onSelect} style={{ color: '#555' }} />
                </div>
              ))}
            </div>
          </DraggableItem>
        </>
      )}

      {/* CONTENIDO PÁGINA 2+ */}
      {pageNumber > 1 && (
        <>
          <DraggableItem defaultPos={{ x: 480, y: 60, width: 400, height: 'auto' }} isEditMode={isEditMode}>
            <div className="marta-section" style={{ margin: 0 }}>
              <SmartLayer initialText="FORMACIÓN Y TÍTULOS" initialSize={32} initialBold={true} initialColor="#7b3fe4" isEditMode={isEditMode} onSelect={onSelect} style={{ marginBottom: '20px' }} />
              {cvData.education.map((edu, i) => (
                <div key={i} className="marta-item">
                  <SmartLayer initialText={edu.period} initialSize={12} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ background: '#e5e5e5', padding: '2px 10px' }} />
                  <SmartLayer initialText={edu.degree} initialSize={16} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
                  <SmartLayer initialText={edu.institution} initialSize={13} isEditMode={isEditMode} onSelect={onSelect} style={{ color: '#555' }} />
                </div>
              ))}
            </div>
          </DraggableItem>
        </>
      )}

    </div>
  );
};

export default MartaTemplate;

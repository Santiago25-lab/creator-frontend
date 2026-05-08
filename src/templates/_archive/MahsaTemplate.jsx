import React from 'react';
import { Rnd } from 'react-rnd';
import SmartLayer from './components/SmartLayer';
import ShapeLayer from './components/ShapeLayer';
import './MahsaTemplate.css';

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

const MahsaTemplate = ({ cvData, profileImage, globalFont, isEditMode, onSelect, pageNumber = 1 }) => {
  const nameParts = cvData.personalInfo.name.split(' ');
  const firstName = nameParts[0] || '';
  const remainingName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="mahsa-cv" style={{ fontFamily: globalFont, position: 'relative', overflow: 'hidden', padding: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
      
      {/* FONDO PERSISTENTE (En todas las páginas) */}
      <ShapeLayer 
        defaultPos={{ x: 0, y: 0, width: '40%', height: '100%' }} 
        initialColor="linear-gradient(180deg, #ff5f8a 0%, #ffc1d3 100%)" 
        isEditMode={isEditMode} 
        onSelect={onSelect} 
      />

      {/* CONTENIDO DE LA PÁGINA 1 */}
      {pageNumber === 1 && (
        <>
          <DraggableItem defaultPos={{ x: 40, y: 60, width: 300, height: 'auto' }} isEditMode={isEditMode}>
            <div className="mahsa-name" style={{ padding: 0 }}>
              <SmartLayer initialText={firstName} initialSize={56} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
              <SmartLayer initialText={remainingName} initialSize={44} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ display: 'block', opacity: 0.8 }} />
            </div>
          </DraggableItem>

          <DraggableItem defaultPos={{ x: 40, y: 220, width: 300, height: 'auto' }} isEditMode={isEditMode}>
            <div className="mahsa-info" style={{ margin: 0 }}>
              <SmartLayer initialText={cvData.personalInfo.address} initialSize={14} isEditMode={isEditMode} onSelect={onSelect} />
              <SmartLayer initialText={cvData.personalInfo.email} initialSize={14} isEditMode={isEditMode} onSelect={onSelect} />
              <SmartLayer initialText={cvData.personalInfo.phone} initialSize={14} isEditMode={isEditMode} onSelect={onSelect} />
            </div>
          </DraggableItem>

          <DraggableItem defaultPos={{ x: 40, y: 420, width: 280, height: 280 }} isEditMode={isEditMode}>
            <div className="mahsa-photo" style={{ margin: 0 }}>
              <img src={profileImage || `https://ui-avatars.com/api/?name=${cvData.personalInfo.name}&size=400&background=fff&color=000`} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </DraggableItem>

          <DraggableItem defaultPos={{ x: 400, y: 60, width: 450, height: 'auto' }} isEditMode={isEditMode}>
            <div className="mahsa-section" style={{ margin: 0 }}>
              <SmartLayer initialText="EXPERIENCIA" initialSize={24} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ marginBottom: '20px' }} />
              {cvData.experience.map((exp, i) => (
                <div key={i} className="mahsa-row">
                  <div style={{ minWidth: '100px' }}>
                    <SmartLayer initialText={exp.period} initialSize={14} isEditMode={isEditMode} onSelect={onSelect} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <SmartLayer initialText={exp.title} initialSize={16} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} />
                    <SmartLayer initialText={exp.description} initialSize={13} isEditMode={isEditMode} onSelect={onSelect} style={{ opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
          </DraggableItem>
        </>
      )}

      {/* CONTENIDO DE LA PÁGINA 2 (Para arrastrar títulos o más info) */}
      {pageNumber > 1 && (
        <>
          <DraggableItem defaultPos={{ x: 400, y: 60, width: 450, height: 'auto' }} isEditMode={isEditMode}>
            <div className="mahsa-section" style={{ margin: 0 }}>
              <SmartLayer initialText="MÁS EXPERIENCIA / TÍTULOS" initialSize={24} initialBold={true} isEditMode={isEditMode} onSelect={onSelect} style={{ marginBottom: '20px' }} />
              <div style={{ padding: '20px', border: '2px dashed #ddd', borderRadius: '10px', textAlign: 'center', color: '#ccc' }}>
                 Arrastra tus componentes adicionales aquí
              </div>
            </div>
          </DraggableItem>
        </>
      )}

    </div>
  );
};

export default MahsaTemplate;

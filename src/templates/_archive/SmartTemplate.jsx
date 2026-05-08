import React from 'react';
import './SmartTemplate.css';
import { HeaderV1, HeaderV2, HeaderV3, HeaderV4, SectionTitleV1, SectionTitleV2, SkillBar, SkillSlider, LanguageDots } from './components/SmartComponents';

const SmartTemplate = ({ cvData, settings, profileImage }) => {
  const styleVars = {
    '--smart-primary': settings.primaryColor || '#e91e63',
    '--smart-bg': settings.backgroundColor || '#ffffff',
    '--smart-text': settings.textColor || '#000000',
    '--smart-font': settings.fontFamily || "'Inter', sans-serif",
  };

  const Header = settings.headerVersion === 'v4' ? HeaderV4 : (settings.headerVersion === 'v3' ? HeaderV3 : (settings.headerVersion === 'v2' ? HeaderV2 : HeaderV1));
  const SectionTitle = settings.sectionVersion === 'v2' ? SectionTitleV2 : SectionTitleV1;
  const isSidebar = settings.headerVersion === 'v3';
  const isMahsa = settings.headerVersion === 'v4';

  const backgroundStyle = isMahsa ? {
    background: `radial-gradient(circle at 10% 10%, rgba(233, 30, 99, 0.2), transparent 40%),
                 radial-gradient(circle at 90% 90%, rgba(233, 30, 99, 0.15), transparent 40%),
                 radial-gradient(circle at 50% 50%, rgba(233, 30, 99, 0.05), transparent 60%)`,
    backgroundColor: '#fff'
  } : { background: styleVars['--smart-bg'] };

  return (
    <div className="smart-template-container" style={{ ...styleVars, ...backgroundStyle, flexDirection: isSidebar ? 'row' : 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: isMahsa ? 'row' : 'column' }}>
        
        {isMahsa ? (
          <>
            <div style={{ flex: 1, padding: '60px 40px' }}>
              <HeaderV4 data={cvData.personalInfo} settings={{ primaryColor: styleVars['--smart-primary'] }} profileImage={profileImage} />
              
              <div style={{ marginTop: '100px' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{cvData.personalInfo.address}</p>
                <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{cvData.personalInfo.email}</p>
                <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>{cvData.personalInfo.phone}</p>
                
                <h3 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>{cvData.personalInfo.title}</h3>
                
                <div style={{ width: '250px', height: '250px', background: '#eee', marginTop: '20px', overflow: 'hidden' }}>
                   <img src={profileImage || `https://ui-avatars.com/api/?name=${cvData.personalInfo.name}&size=250&background=eee&color=000`} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>

            <div style={{ width: '2px', background: '#eee', margin: '60px 0' }}></div>

            <div style={{ flex: 1.2, padding: '60px 40px' }}>
               <SectionTitle title="Trayectoria" color="#000" />
               {cvData.experience.map((exp, i) => (
                 <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                   <span style={{ fontSize: '0.85rem', color: '#666', minWidth: '80px' }}>{exp.period}</span>
                   <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{exp.title}</span>
                 </div>
               ))}

               <SectionTitle title="Idiomas" color="#000" />
               <div style={{ marginTop: '15px' }}>
                 {cvData.languages.map(lang => <LanguageDots key={lang} language={lang} level={4} color={styleVars['--smart-primary']} />)}
               </div>

               <SectionTitle title="Sobre Mí" color="#000" />
               <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginTop: '15px' }}>{cvData.personalInfo.aboutMe}</p>

               <SectionTitle title="Skills" color="#000" />
               <div style={{ marginTop: '20px' }}>
                  {cvData.skills.map(skill => <SkillSlider key={skill} skill={skill} level={85} color={styleVars['--smart-primary']} />)}
               </div>
            </div>
          </>
        ) : (
          <>
            <Header data={cvData.personalInfo} settings={{ primaryColor: styleVars['--smart-primary'] }} profileImage={profileImage} />
            <div className="smart-main-content" style={{ flex: 1, padding: '50px 60px' }}>
              <SectionTitle title="Perfil Profesional" color={styleVars['--smart-primary']} />
              <p style={{ lineHeight: 1.8, marginTop: '20px', fontSize: '1.05rem', color: '#444' }}>{cvData.personalInfo.aboutMe}</p>

              <SectionTitle title="Experiencia Laboral" color={styleVars['--smart-primary']} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {cvData.experience.map((exp, i) => (
                  <div key={i} className="smart-item">
                    <h3 style={{ color: styleVars['--smart-primary'], fontSize: '1.2rem', marginBottom: '5px' }}>{exp.title}</h3>
                    <span className="smart-period" style={{ fontWeight: 'bold', color: '#888' }}>{exp.period}</span>
                    <p style={{ marginTop: '10px', color: '#555' }}>{exp.description}</p>
                  </div>
                ))}
              </div>

              <SectionTitle title="Habilidades" color={styleVars['--smart-primary']} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'x 40px', marginTop: '20px' }}>
                {cvData.skills.map(skill => (
                  <SkillBar key={skill} skill={skill} color={styleVars['--smart-primary']} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SmartTemplate;

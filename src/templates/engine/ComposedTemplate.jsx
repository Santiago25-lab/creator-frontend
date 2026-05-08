import React from 'react';
import { HEADERS, EXPERIENCE, EDUCATION, SKILLS, CONTACT } from './registry';
import LanguagesBlock from './blocks/LanguagesBlock';

/**
 * ComposedTemplate — Motor de composición.
 * Recibe una "receta" (recipe) y los datos del CV, 
 * y renderiza el CV compuesto usando los bloques correspondientes.
 */
const ComposedTemplate = ({ data, recipe }) => {
  const HeaderComp = HEADERS[recipe.header]?.component;
  const ExpComp = EXPERIENCE[recipe.experience]?.component;
  const EduComp = EDUCATION[recipe.education]?.component;
  const SkillsComp = SKILLS[recipe.skills]?.component;
  const ContactComp = CONTACT[recipe.contact]?.component;

  const { theme } = recipe;

  const mainSections = (
    <>
      {ExpComp && <ExpComp items={data.experience} theme={theme} />}
      {EduComp && <EduComp items={data.education} theme={theme} />}
    </>
  );

  const sideSections = (
    <>
      {ContactComp && <ContactComp data={data.personalInfo} theme={theme} />}
      {SkillsComp && <SkillsComp items={data.skills} theme={theme} />}
      <LanguagesBlock items={data.languages} theme={theme} />
    </>
  );

  /* ── LAYOUT: Sidebar Left ── */
  if (recipe.layout === 'sidebar-left') {
    return (
      <div className="composed-cv" style={{
        width: '210mm', minHeight: '297mm',
        background: theme.backgroundColor, color: theme.textColor,
        fontFamily: "'Inter', sans-serif", display: 'flex',
        boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
      }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px', flexShrink: 0,
          background: `${theme.primaryColor}08`,
          borderRight: `1px solid ${theme.primaryColor}15`,
          paddingTop: '10px',
        }}>
          {HeaderComp && <HeaderComp data={data.personalInfo} theme={theme} />}
          <div style={{ padding: '10px 0' }}>
            {ContactComp && <ContactComp data={data.personalInfo} theme={theme} />}
            {SkillsComp && <SkillsComp items={data.skills} theme={theme} />}
            <LanguagesBlock items={data.languages} theme={theme} />
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, paddingTop: '10px' }}>
          {data.personalInfo.aboutMe && (
            <div style={{ padding: '30px 40px 10px' }}>
              <h2 style={{
                fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '2px', color: theme.primaryColor,
                borderBottom: `2px solid ${theme.primaryColor}`,
                paddingBottom: '8px', marginBottom: '14px',
              }}>Perfil</h2>
              <p style={{ fontSize: '0.85rem', color: `${theme.textColor}88`, lineHeight: 1.7 }}>{data.personalInfo.aboutMe}</p>
            </div>
          )}
          {ExpComp && <ExpComp items={data.experience} theme={theme} />}
          {EduComp && <EduComp items={data.education} theme={theme} />}
        </main>
      </div>
    );
  }

  /* ── LAYOUT: Two Column ── */
  if (recipe.layout === 'two-column') {
    return (
      <div className="composed-cv" style={{
        width: '210mm', minHeight: '297mm',
        background: theme.backgroundColor, color: theme.textColor,
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
      }}>
        {HeaderComp && <HeaderComp data={data.personalInfo} theme={theme} />}
        <div style={{ display: 'flex', gap: '10px', padding: '10px 0' }}>
          <div style={{ flex: 1.2 }}>
            {ExpComp && <ExpComp items={data.experience} theme={theme} />}
            {EduComp && <EduComp items={data.education} theme={theme} />}
          </div>
          <div style={{
            width: '2px', background: `${theme.primaryColor}15`,
            margin: '0 5px', flexShrink: 0,
          }} />
          <div style={{ flex: 0.8 }}>
            {sideSections}
          </div>
        </div>
      </div>
    );
  }

  /* ── LAYOUT: Single Column (default) ── */
  return (
    <div className="composed-cv" style={{
      width: '210mm', minHeight: '297mm',
      background: theme.backgroundColor, color: theme.textColor,
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
    }}>
      {HeaderComp && <HeaderComp data={data.personalInfo} theme={theme} />}
      <div style={{ padding: '10px 0' }}>
        {mainSections}
        <div style={{ display: 'flex', gap: '20px', padding: '0 40px 20px' }}>
          <div style={{ flex: 1 }}>
            {SkillsComp && <SkillsComp items={data.skills} theme={theme} />}
          </div>
          <div style={{ flex: 1 }}>
            {ContactComp && <ContactComp data={data.personalInfo} theme={theme} />}
            <LanguagesBlock items={data.languages} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposedTemplate;

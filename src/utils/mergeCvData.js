/**
 * mergeCvData.js — Helper para fusionar datos de CV tras una respuesta de IA.
 * Preserva la foto del usuario, la visibilidad de secciones y sobrescribe/agrega limpiamente.
 */

/**
 * Fusiona los datos actuales del CV con una respuesta parcial de la IA.
 *
 * @param {Object} current — Estado actual del CV
 * @param {Object} incoming — Respuesta de la IA (parcial)
 * @returns {Object} — CV fusionado
 */
export const mergeCvData = (current, incoming) => ({
  ...current,
  personalInfo: {
    ...current.personalInfo,
    ...(incoming.personalInfo ? Object.fromEntries(Object.entries(incoming.personalInfo).filter(([, v]) => v)) : {}),
    photo: current.personalInfo?.photo,  // Siempre preservar la foto
  },
  experience: incoming.experience && incoming.experience.length > 0 ? incoming.experience : current.experience,
  education:  incoming.education && incoming.education.length > 0   ? incoming.education  : current.education,
  skills:     incoming.skills && incoming.skills.length > 0         ? incoming.skills     : current.skills,
  softSkills: incoming.softSkills && incoming.softSkills.length > 0 ? incoming.softSkills : current.softSkills,
  languages:  incoming.languages && incoming.languages.length > 0   ? incoming.languages  : current.languages,
  certifications: incoming.certifications && incoming.certifications.length > 0 ? incoming.certifications : current.certifications,
  projects:   incoming.projects && incoming.projects.length > 0     ? incoming.projects   : current.projects,
  publications: incoming.publications && incoming.publications.length > 0 ? incoming.publications : current.publications,
  awards:     incoming.awards && incoming.awards.length > 0         ? incoming.awards     : current.awards,
  volunteer:  incoming.volunteer && incoming.volunteer.length > 0   ? incoming.volunteer  : current.volunteer,
  references: incoming.references && incoming.references.length > 0 ? incoming.references : current.references,
  interests:  incoming.interests && incoming.interests.length > 0   ? incoming.interests  : current.interests,
  socialLinks: incoming.socialLinks && incoming.socialLinks.length > 0 ? incoming.socialLinks : current.socialLinks,
  sectionsVisibility: current.sectionsVisibility, // Siempre preservar visibilidad configurada
});

/**
 * Fusiona datos extraídos de documentos (análisis IA) con el CV actual.
 * AGREGA en vez de reemplazar.
 */
export const mergeExtractedData = (current, extracted) => ({
  ...current,
  personalInfo: {
    ...current.personalInfo,
    ...Object.fromEntries(
      Object.entries(extracted.personalInfo || {}).filter(([, v]) => v)
    ),
  },
  experience: extracted.experience?.filter(e => e.title || e.description).length > 0
    ? [...(current.experience || []), ...extracted.experience.filter(e => e.title || e.description)]
    : current.experience,
  education: extracted.education?.filter(e => e.degree || e.institution).length > 0
    ? [...(current.education || []), ...extracted.education.filter(e => e.degree || e.institution)]
    : current.education,
  skills: extracted.skills?.length > 0
    ? [...new Set([...(current.skills || []), ...extracted.skills.filter(Boolean)])]
    : current.skills,
  softSkills: extracted.softSkills?.length > 0
    ? [...new Set([...(current.softSkills || []), ...extracted.softSkills.filter(Boolean)])]
    : current.softSkills,
  languages: extracted.languages?.length > 0
    ? [...new Set([...(current.languages || []), ...extracted.languages.filter(Boolean)])]
    : current.languages,
  certifications: extracted.certifications?.length > 0
    ? [...(current.certifications || []), ...extracted.certifications]
    : current.certifications,
  projects: extracted.projects?.length > 0
    ? [...(current.projects || []), ...extracted.projects]
    : current.projects,
  publications: extracted.publications?.length > 0
    ? [...(current.publications || []), ...extracted.publications]
    : current.publications,
  awards: extracted.awards?.length > 0
    ? [...(current.awards || []), ...extracted.awards]
    : current.awards,
  volunteer: extracted.volunteer?.length > 0
    ? [...(current.volunteer || []), ...extracted.volunteer]
    : current.volunteer,
  references: extracted.references?.length > 0
    ? [...(current.references || []), ...extracted.references]
    : current.references,
  interests: extracted.interests?.length > 0
    ? [...new Set([...(current.interests || []), ...extracted.interests.filter(Boolean)])]
    : current.interests,
  socialLinks: extracted.socialLinks?.length > 0
    ? [...(current.socialLinks || []), ...extracted.socialLinks]
    : current.socialLinks,
  sectionsVisibility: current.sectionsVisibility,
});

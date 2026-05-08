/**
 * mergeCvData.js — Helper para fusionar datos de CV tras una respuesta de IA.
 * Preserva la foto del usuario y solo sobrescribe campos que la IA devolvió.
 */

/**
 * Fusiona los datos actuales del CV con una respuesta parcial de la IA.
 * - Preserva siempre la foto del usuario (photo)
 * - Solo sobrescribe un campo si la IA lo devolvió (no undefined/null)
 *
 * @param {Object} current — Estado actual del CV
 * @param {Object} incoming — Respuesta de la IA (parcial)
 * @returns {Object} — CV fusionado
 */
export const mergeCvData = (current, incoming) => ({
  personalInfo: {
    ...(incoming.personalInfo || current.personalInfo),
    photo: current.personalInfo.photo,  // Siempre preservar la foto
  },
  experience: incoming.experience || current.experience,
  education:  incoming.education  || current.education,
  skills:     incoming.skills     || current.skills,
  languages:  incoming.languages  || current.languages,
});

/**
 * Fusiona datos extraídos de documentos (análisis IA) con el CV actual.
 * A diferencia de mergeCvData, este AGREGA en vez de reemplazar.
 *
 * @param {Object} current — Estado actual del CV
 * @param {Object} extracted — Datos extraídos del documento
 * @returns {Object} — CV con datos adicionales
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
    ? [...current.experience, ...extracted.experience.filter(e => e.title || e.description)]
    : current.experience,
  education: extracted.education?.filter(e => e.degree || e.institution).length > 0
    ? [...current.education, ...extracted.education.filter(e => e.degree || e.institution)]
    : current.education,
  skills: extracted.skills?.length > 0
    ? [...new Set([...current.skills, ...extracted.skills.filter(Boolean)])]
    : current.skills,
  languages: extracted.languages?.length > 0
    ? [...new Set([...current.languages, ...extracted.languages.filter(Boolean)])]
    : current.languages,
});

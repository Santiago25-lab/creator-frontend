/**
 * formatters.js — Funciones de formato reutilizables.
 * Extraídas de DocumentsPanel y CertificatePage para eliminar duplicación.
 */

/**
 * Formatea bytes a tamaño legible (B, KB, MB)
 */
export const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * Formatea fecha ISO a formato corto (ej: "07 may. 2026")
 */
export const formatDateShort = (isoStr) => {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

/**
 * Formatea fecha ISO a formato largo (ej: "07 mayo 2026")
 */
export const formatDateLong = (isoStr) => {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

/**
 * Devuelve el icono FontAwesome apropiado para un tipo de archivo
 */
export const getFileIcon = (contentType) => {
  if (!contentType) return 'fa-file';
  if (contentType === 'application/pdf') return 'fa-file-pdf';
  if (contentType.startsWith('image/')) return 'fa-file-image';
  return 'fa-file';
};

/**
 * Devuelve un color de acento para un tipo de archivo
 */
export const getFileColor = (contentType) => {
  if (contentType === 'application/pdf') return '#ef4444';
  if (contentType?.startsWith('image/')) return '#3b82f6';
  return '#6b7280';
};

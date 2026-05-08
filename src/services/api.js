/**
 * api.js — Configuración centralizada de endpoints del backend.
 * Usa la variable de entorno VITE_API_URL o el valor por defecto para desarrollo.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export const API_URLS = {
  documents:      `${API_BASE}/api/documents`,
  documentUpload: `${API_BASE}/api/documents/upload`,
  aiGenerate:     `${API_BASE}/api/cv/ai/generate`,
  aiAnalyzeStyle: `${API_BASE}/api/cv/ai/analyze-style`,
  aiAnalyzeDesign:`${API_BASE}/api/cv/ai/analyze-design`,
  cv:              `${API_BASE}/api/cv`
};

/**
 * Helper para construir URL de vista de un documento
 */
export const getDocumentViewUrl = (docId) =>
  `${API_BASE}/api/documents/${docId}/view`;

/**
 * Helper para construir URL de análisis de un documento
 */
export const getDocumentAnalyzeUrl = (docId) =>
  `${API_BASE}/api/documents/${docId}/analyze`;

export default API_URLS;

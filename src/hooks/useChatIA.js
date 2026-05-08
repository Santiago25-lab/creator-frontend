import { useState, useRef, useEffect } from 'react';
import { API_URLS } from '../services/api';
import { mergeCvData } from '../utils/mergeCvData';

/**
 * useChatIA — Custom hook para la funcionalidad del chat con IA.
 *
 * Encapsula: mensajes, input, loading, sugerencias de skills/idiomas, y regeneración.
 *
 * @param {Object}   cvData    — Estado actual del CV
 * @param {Function} setCvData — Setter del estado del CV
 * @returns {Object} — API completa del chat IA
 */
export const useChatIA = (cvData, setCvData) => {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu redactor. Cuéntame sobre ti y yo optimizaré tu CV con lenguaje de alto impacto.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [langSuggestions, setLangSuggestions] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  /* ── Enviar mensaje al chat IA ── */
  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    const msg = userInput.trim();
    const newMsgs = [...chatMessages, { role: 'user', content: msg }];
    setChatMessages(newMsgs);
    setUserInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos de espera

      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: msg, currentState: cvData }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setCvData(mergeCvData(cvData, data));
        setChatMessages([...newMsgs, { role: 'assistant', content: data.ai_message || '✅ CV actualizado.' }]);
      } else {
        const errorText = await res.text();
        let errorMsg = '⚠️ Error del servidor.';
        if (res.status === 429) errorMsg = '⚠️ Límite de mensajes alcanzado. Espera un momento.';
        if (errorText.includes('timeout')) errorMsg = '⚠️ La IA tardó demasiado en responder. Reintenta.';
        
        setChatMessages([...newMsgs, { role: 'assistant', content: errorMsg }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const isTimeout = err.name === 'AbortError';
      setChatMessages([...newMsgs, { 
        role: 'assistant', 
        content: isTimeout ? '⚠️ Tiempo de espera agotado. Reintentando...' : '⚠️ Error de conexión. Verifica tu internet.' 
      }]);
    }
    setIsLoading(false);
  };

  /* ── Regenerar todo el CV con IA ── */
  const regenerateCV = async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    try {
      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'REGENERA todo el contenido de mi CV. Reescribe el perfil profesional (aboutMe), las descripciones de experiencia y el título profesional usando un enfoque COMPLETAMENTE DIFERENTE al actual. Usa sinónimos, cambia la estructura de las oraciones, y dale un tono fresco y renovado. MANTÉN los mismos hechos (nombres, fechas, empresas, instituciones) pero CAMBIA cómo están redactados.',
          currentState: cvData
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCvData(mergeCvData(cvData, data));
      }
    } catch {}
    setIsRegenerating(false);
  };

  /* ── Sugerencias de skills ── */
  const suggestSkills = async () => {
    const title = cvData.personalInfo.title;
    if (!title) return;
    try {
      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Sugiere 8 habilidades profesionales clave para un ${title} que NO estén ya en la lista: ${cvData.skills.join(', ')}. Devuelve SOLO el JSON con el campo skills (array de strings) y ai_message.`, currentState: cvData })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.skills) setSkillSuggestions(data.skills.filter(s => !cvData.skills.includes(s)));
      }
    } catch {}
  };

  /* ── Sugerencias de idiomas ── */
  const suggestLanguages = async () => {
    try {
      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Sugiere 5 idiomas relevantes para un ${cvData.personalInfo.title} con formato "Idioma (Nivel)". Que NO estén ya: ${cvData.languages.join(', ')}. Devuelve SOLO el JSON con el campo languages (array de strings) y ai_message.`, currentState: cvData })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.languages) setLangSuggestions(data.languages.filter(l => !cvData.languages.includes(l)));
      }
    } catch {}
  };

  return {
    chatMessages,
    userInput, setUserInput,
    isLoading,
    isRegenerating,
    skillSuggestions, setSkillSuggestions,
    langSuggestions, setLangSuggestions,
    chatEndRef,
    sendMessage,
    regenerateCV,
    suggestSkills,
    suggestLanguages,
  };
};

import { useState, useRef, useEffect } from 'react';
import { API_URLS } from '../services/api';
import { mergeCvData } from '../utils/mergeCvData';
import { supabase } from '../lib/supabase';

export const useChatIA = (cvData, setCvData, user, projectId) => {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu redactor. Cuéntame sobre ti y yo optimizaré tu CV con lenguaje de alto impacto.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [langSuggestions, setLangSuggestions] = useState([]);
  const chatEndRef = useRef(null);
  
  const cvDataRef = useRef(cvData);
  useEffect(() => {
    cvDataRef.current = cvData;
  }, [cvData]);

  // 1. Cargar historial desde Supabase al iniciar
  useEffect(() => {
    if (!user || !projectId) {
      // Si no hay usuario o proyecto, resetear chat al mensaje de bienvenida inicial
      setChatMessages([
        { role: 'assistant', content: '¡Hola! Soy tu redactor. Cuéntame sobre ti y yo optimizaré tu CV con lenguaje de alto impacto.' }
      ]);
      return;
    }

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('role, content')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setChatMessages(data);
      }
    };

    fetchHistory();
  }, [user, projectId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Función auxiliar para guardar mensaje en DB
  const saveMessage = async (role, content) => {
    if (!user || !projectId) return;
    await supabase.from('chat_history').insert({
      user_id: user.id,
      project_id: projectId,
      role,
      content
    });
  };

  /* ── Enviar mensaje al chat IA ── */
  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    const msg = userInput.trim();
    
    // Guardar y mostrar mensaje del usuario
    await saveMessage('user', msg);
    const newMsgs = [...chatMessages, { role: 'user', content: msg }];
    setChatMessages(newMsgs);
    setUserInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: msg, 
          currentState: cvData,
          history: chatMessages // ENVIAR HISTORIAL COMPLETO
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const aiResponse = data.ai_message;
        
        if (!aiResponse) {
          throw new Error('La IA no devolvió un mensaje conversacional.');
        }

        // ── SANITIZACIÓN DE RESPUESTAS ──
        // Prevenir que ChatGPT pegue su respuesta conversacional (ej: "Claro, aquí tienes...") dentro de los campos del CV
        const cleanAiArtifacts = (text) => {
          if (!text || typeof text !== 'string') return text;
          let cleaned = text;
          // Si el texto completo del chat se coló dentro del campo, lo quitamos
          if (aiResponse.length > 10 && cleaned.includes(aiResponse.substring(0, 20))) {
            cleaned = cleaned.replace(aiResponse, '');
          }
          // Limpiar introducciones comunes (ej: "Claro, aquí tienes la descripción: ")
          cleaned = cleaned.replace(/^(¡Claro!|Aquí tienes|Claro,|Por supuesto,)[^\n]*?:\s*\n*/i, '');
          // Quitar comillas dobles residuales al inicio y fin si la IA las pone por error
          cleaned = cleaned.replace(/^["']|["']$/g, '');
          return cleaned.trim();
        };

        if (data.personalInfo && data.personalInfo.aboutMe) {
          data.personalInfo.aboutMe = cleanAiArtifacts(data.personalInfo.aboutMe);
        }
        if (data.experience) {
          data.experience = data.experience.map(exp => ({ ...exp, description: cleanAiArtifacts(exp.description) }));
        }

        // Usar cvDataRef.current para asegurar que combinamos con los cambios más recientes que haya hecho el usuario
        setCvData(mergeCvData(cvDataRef.current, data));
        
        // Guardar y mostrar respuesta de la IA
        await saveMessage('assistant', aiResponse);
        setChatMessages([...newMsgs, { role: 'assistant', content: aiResponse }]);
      } else {
        let errText = '⚠️ El servidor está ocupado. Reintenta en un momento.';
        try {
          const errData = await res.json();
          if (errData.ai_message) errText = errData.ai_message;
          else if (errData.error) errText = '⚠️ ' + errData.error;
        } catch {}
        setChatMessages([...newMsgs, { role: 'assistant', content: errText }]);
      }
    } catch (err) {
      const isTimeout = err.name === 'AbortError';
      setChatMessages([...newMsgs, { 
        role: 'assistant', 
        content: isTimeout ? '⚠️ Tiempo agotado. La IA tardó demasiado en procesar la respuesta, intenta de nuevo.' : '⚠️ Error de conexión.' 
      }]);
    }
    setIsLoading(false);
  };

  /* ── Sugerencias y Regeneración (sin cambios mayores en lógica, solo retornos) ── */
  const regenerateCV = async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    try {
      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'REGENERA todo el contenido de mi CV...',
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

  const suggestSkills = async () => {
    const title = cvData.personalInfo.title;
    if (!title) return;
    try {
      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Sugiere 8 habilidades...`, currentState: cvData })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.skills) setSkillSuggestions(data.skills.filter(s => !cvData.skills.includes(s)));
      }
    } catch {}
  };

  const suggestLanguages = async () => {
    try {
      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Sugiere 5 idiomas...`, currentState: cvData })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.languages) setLangSuggestions(data.languages.filter(l => !cvData.languages.includes(l)));
      }
    } catch {}
  };

  return {
    chatMessages, userInput, setUserInput, isLoading, isRegenerating,
    skillSuggestions, setSkillSuggestions, langSuggestions, setLangSuggestions,
    chatEndRef, sendMessage, regenerateCV, suggestSkills, suggestLanguages,
  };
};

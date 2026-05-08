import { useState, useRef, useEffect } from 'react';
import { API_URLS } from '../services/api';
import { mergeCvData } from '../utils/mergeCvData';
import { supabase } from '../lib/supabase';

export const useChatIA = (cvData, setCvData, user) => {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu redactor. Cuéntame sobre ti y yo optimizaré tu CV con lenguaje de alto impacto.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [langSuggestions, setLangSuggestions] = useState([]);
  const chatEndRef = useRef(null);

  // 1. Cargar historial desde Supabase al iniciar
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('role, content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setChatMessages(data);
      }
    };

    fetchHistory();
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Función auxiliar para guardar mensaje en DB
  const saveMessage = async (role, content) => {
    if (!user) return;
    await supabase.from('chat_history').insert({
      user_id: user.id,
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
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(API_URLS.aiGenerate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: msg, currentState: cvData }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const aiResponse = data.ai_message;
        
        if (!aiResponse) {
          throw new Error('La IA no devolvió un mensaje conversacional.');
        }

        setCvData(mergeCvData(cvData, data));
        
        // Guardar y mostrar respuesta de la IA
        await saveMessage('assistant', aiResponse);
        setChatMessages([...newMsgs, { role: 'assistant', content: aiResponse }]);
      } else {
        setChatMessages([...newMsgs, { role: 'assistant', content: '⚠️ El servidor está ocupado. Reintenta en un momento.' }]);
      }
    } catch (err) {
      const isTimeout = err.name === 'AbortError';
      setChatMessages([...newMsgs, { 
        role: 'assistant', 
        content: isTimeout ? '⚠️ Tiempo agotado. La IA está tardando mucho, prueba con un mensaje más corto.' : '⚠️ Error de conexión.' 
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

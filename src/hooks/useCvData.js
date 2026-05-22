import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const CV_STORAGE_KEY = 'creator_cv_data';

export const blankCV = {
  personalInfo: {
    name: "",
    title: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    aboutMe: ""
  },
  experience: [],
  education: [],
  skills: [],
  languages: []
};

// Mantenemos una referencia por compatibilidad, pero vacía
export const defaultCV = blankCV;

export const useCvData = (user) => {
  const [cvData, setCvData] = useState(blankCV);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Cargar datos de forma segura (Nube manda sobre Local)
  useEffect(() => {
    if (!user) {
      setCvData(blankCV);
      localStorage.removeItem(CV_STORAGE_KEY);
      return;
    }

    const fetchSupabaseData = async () => {
      const { data, error } = await supabase
        .from('cv_data')
        .select('content')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .maybeSingle();

      if (data && !error) {
        // Usuario antiguo: restaurar su contenido
        setCvData(data.content);
        localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(data.content));
      } else {
        // Usuario nuevo o error: empezar de cero
        setCvData(blankCV);
        localStorage.removeItem(CV_STORAGE_KEY);
      }
    };

    fetchSupabaseData();
  }, [user]);

  // 2. Guardar en Supabase y LocalStorage (con manejo de errores)
  useEffect(() => {
    try {
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvData));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('LocalStorage lleno. Los datos solo se guardarán en la nube.');
        // Opcional: Podríamos quitar la foto del localStorage para que el resto quepa
        const dataWithoutPhoto = { ...cvData, personalInfo: { ...cvData.personalInfo, photo: null } };
        try { localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(dataWithoutPhoto)); } catch {}
      }
    }
    
    if (!user) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await supabase
          .from('cv_data')
          .upsert({ 
            user_id: user.id, 
            content: cvData, 
            is_primary: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id, is_primary' });
      } catch (err) {
        console.error("Error al guardar en Supabase:", err);
      }
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [cvData, user]);

  /* ── Métodos de actualización ── */
  const updatePersonal = (field, value) => {
    setCvData(d => ({ ...d, personalInfo: { ...d.personalInfo, [field]: value } }));
  };

  const setPhoto = (dataUrl) => {
    // Si la imagen es muy grande (> 1MB aprox), intentamos avisar o procesar
    // Por ahora, la guardamos y dejamos que el try-catch de arriba maneje el localstorage
    setCvData(d => ({ ...d, personalInfo: { ...d.personalInfo, photo: dataUrl } }));
  };

  const removePhoto = () => {
    setCvData(d => ({ ...d, personalInfo: { ...d.personalInfo, photo: null } }));
  };

  const addExperience = () => {
    setCvData(d => ({ ...d, experience: [...d.experience, { period: "", title: "", description: "" }] }));
  };

  const updateExperience = (i, field, value) => {
    setCvData(d => {
      const exp = [...d.experience];
      exp[i] = { ...exp[i], [field]: value };
      return { ...d, experience: exp };
    });
  };

  const removeExperience = (i) => {
    setCvData(d => ({ ...d, experience: d.experience.filter((_, idx) => idx !== i) }));
  };

  const addEducation = () => {
    setCvData(d => ({ ...d, education: [...d.education, { period: "", degree: "", institution: "" }] }));
  };

  const updateEducation = (i, field, value) => {
    setCvData(d => {
      const edu = [...d.education];
      edu[i] = { ...edu[i], [field]: value };
      return { ...d, education: edu };
    });
  };

  const removeEducation = (i) => {
    setCvData(d => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }));
  };

  const addSkill = (skill) => {
    if (!skill || !skill.trim()) return;
    setCvData(d => ({ ...d, skills: [...d.skills, skill.trim()] }));
  };

  const removeSkill = (i) => {
    setCvData(d => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }));
  };

  const addLanguage = (lang) => {
    if (!lang || !lang.trim()) return;
    setCvData(d => ({ ...d, languages: [...d.languages, lang.trim()] }));
  };

  const removeLanguage = (i) => {
    setCvData(d => ({ ...d, languages: d.languages.filter((_, idx) => idx !== i) }));
  };

  const saveToBackend = async (customName = null) => {
    if (!user) return;
    setIsSaving(true);
    
    let contentToSave = cvData;
    if (customName !== null) {
      contentToSave = { ...cvData, cvName: customName };
      setCvData(contentToSave);
    }

    try {
      await supabase
        .from('cv_data')
        .upsert({ 
          user_id: user.id, 
          content: contentToSave, 
          is_primary: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, is_primary' });
    } catch (err) {
      console.error("Error al guardar manualmente:", err);
    }
    setIsSaving(false);
  };

  return {
    cvData,
    setCvData,
    isSaving,
    saveToBackend,
    updatePersonal,
    setPhoto,
    removePhoto,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addLanguage, removeLanguage,
  };
};

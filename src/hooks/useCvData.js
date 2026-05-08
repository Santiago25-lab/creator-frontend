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

  // 2. Guardar en Supabase cuando cvData cambia (Debounced)
  useEffect(() => {
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvData));
    
    if (!user) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      await supabase
        .from('cv_data')
        .upsert({ 
          user_id: user.id, 
          content: cvData, 
          is_primary: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, is_primary' });
      setIsSaving(false);
    }, 2000); // Guardado automático cada 2 segundos de inactividad

    return () => clearTimeout(timer);
  }, [cvData, user]);

  /* ── Métodos de actualización ── */
  const updatePersonal = (field, value) => {
    setCvData(d => ({ ...d, personalInfo: { ...d.personalInfo, [field]: value } }));
  };

  const setPhoto = (dataUrl) => {
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

  return {
    cvData,
    setCvData,
    isSaving,
    updatePersonal,
    setPhoto,
    removePhoto,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addLanguage, removeLanguage,
  };
};

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

export const useCvData = (user, projectId) => {
  const [cvData, setCvData] = useState(blankCV);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 1. Cargar datos de forma segura (Nube manda sobre Local)
  useEffect(() => {
    if (!user || !projectId) {
      setCvData(blankCV);
      localStorage.removeItem(CV_STORAGE_KEY);
      return;
    }

    const fetchSupabaseData = async () => {
      const { data, error } = await supabase
        .from('cv_projects')
        .select('content')
        .eq('id', projectId)
        .maybeSingle();

      if (data && data.content && Object.keys(data.content).length > 0) {
        setCvData(data.content);
        localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(data.content));
      } else {
        // Proyecto nuevo sin contenido
        setCvData(blankCV);
      }
    };

    fetchSupabaseData();
  }, [user, projectId]);

  // 2. Guardar en LocalStorage y autoguardado en BD (cada 2 seg si hay cambios)
  useEffect(() => {
    try {
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvData));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        const dataWithoutPhoto = { ...cvData, personalInfo: { ...cvData.personalInfo, photo: null } };
        try { localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(dataWithoutPhoto)); } catch {}
      }
    }

    if (!user || !projectId || !hasUnsavedChanges) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await supabase
          .from('cv_projects')
          .update({ 
            content: cvData, 
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error("Error al autoguardar:", err);
      }
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [cvData, user, projectId, hasUnsavedChanges]);

  /* ── Métodos de actualización ── */
  const markUnsaved = () => setHasUnsavedChanges(true);

  const updatePersonal = (field, value) => {
    setCvData(d => ({ ...d, personalInfo: { ...d.personalInfo, [field]: value } }));
    markUnsaved();
  };

  const setPhoto = (dataUrl) => {
    setCvData(d => ({ ...d, personalInfo: { ...d.personalInfo, photo: dataUrl } }));
    markUnsaved();
  };

  const removePhoto = () => {
    setCvData(d => ({ ...d, personalInfo: { ...d.personalInfo, photo: null } }));
    markUnsaved();
  };

  const addExperience = () => {
    setCvData(d => ({ ...d, experience: [...d.experience, { period: "", title: "", description: "" }] }));
    markUnsaved();
  };

  const updateExperience = (i, field, value) => {
    setCvData(d => {
      const exp = [...d.experience];
      exp[i] = { ...exp[i], [field]: value };
      return { ...d, experience: exp };
    });
    markUnsaved();
  };

  const removeExperience = (i) => {
    setCvData(d => ({ ...d, experience: d.experience.filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  const addEducation = () => {
    setCvData(d => ({ ...d, education: [...d.education, { period: "", degree: "", institution: "" }] }));
    markUnsaved();
  };

  const updateEducation = (i, field, value) => {
    setCvData(d => {
      const edu = [...d.education];
      edu[i] = { ...edu[i], [field]: value };
      return { ...d, education: edu };
    });
    markUnsaved();
  };

  const removeEducation = (i) => {
    setCvData(d => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  const addSkill = (skill) => {
    if (!skill || !skill.trim()) return;
    setCvData(d => ({ ...d, skills: [...d.skills, skill.trim()] }));
    markUnsaved();
  };

  const removeSkill = (i) => {
    setCvData(d => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  const addLanguage = (lang) => {
    if (!lang || !lang.trim()) return;
    setCvData(d => ({ ...d, languages: [...d.languages, lang.trim()] }));
    markUnsaved();
  };

  const removeLanguage = (i) => {
    setCvData(d => ({ ...d, languages: d.languages.filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  const updateConfig = (config) => {
    setCvData(d => ({ ...d, ...config }));
    markUnsaved();
  };

  const saveToBackend = async (customName = null, recipe = null, activeTemplate = null, composerMode = null) => {
    if (!user || !projectId) return;
    setIsSaving(true);
    
    let contentToSave = cvData;
    if (customName !== null || recipe !== null || activeTemplate !== null || composerMode !== null) {
      contentToSave = { ...cvData };
      if (customName !== null) contentToSave.cvName = customName;
      if (recipe !== null) contentToSave.recipe = recipe;
      if (activeTemplate !== null) contentToSave.activeTemplate = activeTemplate;
      if (composerMode !== null) contentToSave.composerMode = composerMode;
      setCvData(contentToSave);
    }

    try {
      // 1. Guardar o actualizar el CV principal en cv_projects
      await supabase
        .from('cv_projects')
        .update({ 
          content: contentToSave, 
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      // 2. Guardar en el historial de versiones (cv_versions)
      const versionName = customName ? customName : `Versión ${new Date().toLocaleString()}`;
      await supabase
        .from('cv_versions')
        .insert({
          user_id: user.id,
          name: versionName,
          content: contentToSave,
          created_at: new Date().toISOString()
        });
        
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error al guardar manualmente:", err);
    }
    setIsSaving(false);
  };

  return {
    cvData,
    setCvData,
    isSaving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    saveToBackend,
    updateConfig,
    updatePersonal,
    setPhoto,
    removePhoto,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addLanguage, removeLanguage,
  };
};

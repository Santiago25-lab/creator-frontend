import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { customAlert } from '../utils/dialogs';

const CV_STORAGE_KEY = 'creator_cv_data';
let lastAutoVersionTime = 0;
const AUTO_VERSION_COOLDOWN = 1000 * 60 * 1; // 1 minuto

export const defaultSectionsVisibility = {
  personalInfo: true,
  photo: true,
  aboutMe: true,
  objective: false,
  experience: true,
  education: true,
  skills: true,
  softSkills: true,
  languages: true,
  certifications: true,
  projects: true,
  publications: false,
  awards: false,
  volunteer: false,
  references: false,
  interests: true,
  socialLinks: true
};

export const blankCV = {
  personalInfo: {
    name: "",
    title: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    aboutMe: "",
    objective: "",
    photo: null
  },
  experience: [],
  education: [],
  skills: [],
  softSkills: [],
  languages: [],
  certifications: [],
  projects: [],
  publications: [],
  awards: [],
  volunteer: [],
  references: [],
  interests: [],
  socialLinks: [],
  sectionsVisibility: defaultSectionsVisibility
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
        const loadedContent = {
          ...blankCV,
          ...data.content,
          personalInfo: { ...blankCV.personalInfo, ...(data.content.personalInfo || {}) },
          sectionsVisibility: { ...defaultSectionsVisibility, ...(data.content.sectionsVisibility || {}) }
        };
        setCvData(loadedContent);
        localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(loadedContent));
      } else {
        // Proyecto nuevo sin contenido
        setCvData(blankCV);
      }
    };

    fetchSupabaseData();
  }, [user, projectId]);

  // 2. Guardar en LocalStorage y autoguardado en BD (cada 60 seg si hay cambios)
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
    }, 60000);

    return () => clearTimeout(timer);
  }, [cvData, user, projectId, hasUnsavedChanges]);

  /* ── Métodos de actualización ── */
  const markUnsaved = () => setHasUnsavedChanges(true);

  // Visibilidad de secciones
  const toggleSectionVisibility = (key) => {
    setCvData(d => {
      const currentVis = d.sectionsVisibility || defaultSectionsVisibility;
      return {
        ...d,
        sectionsVisibility: {
          ...currentVis,
          [key]: !currentVis[key]
        }
      };
    });
    markUnsaved();
  };

  const setSectionVisibility = (key, isVisible) => {
    setCvData(d => ({
      ...d,
      sectionsVisibility: {
        ...(d.sectionsVisibility || defaultSectionsVisibility),
        [key]: isVisible
      }
    }));
    markUnsaved();
  };

  const setAllSectionsVisibility = (isVisible) => {
    setCvData(d => {
      const updated = {};
      Object.keys(defaultSectionsVisibility).forEach(k => {
        updated[k] = isVisible;
      });
      return { ...d, sectionsVisibility: updated };
    });
    markUnsaved();
  };

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

  // Experiencia
  const addExperience = () => {
    setCvData(d => ({ ...d, experience: [...(d.experience || []), { period: "", title: "", company: "", description: "" }] }));
    markUnsaved();
  };

  const updateExperience = (i, field, value) => {
    setCvData(d => {
      const exp = [...(d.experience || [])];
      exp[i] = { ...exp[i], [field]: value };
      return { ...d, experience: exp };
    });
    markUnsaved();
  };

  const removeExperience = (i) => {
    setCvData(d => ({ ...d, experience: (d.experience || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Educación
  const addEducation = () => {
    setCvData(d => ({ ...d, education: [...(d.education || []), { period: "", degree: "", institution: "" }] }));
    markUnsaved();
  };

  const updateEducation = (i, field, value) => {
    setCvData(d => {
      const edu = [...(d.education || [])];
      edu[i] = { ...edu[i], [field]: value };
      return { ...d, education: edu };
    });
    markUnsaved();
  };

  const removeEducation = (i) => {
    setCvData(d => ({ ...d, education: (d.education || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Habilidades Técnicas (Hard Skills)
  const addSkill = (skill) => {
    if (!skill || !skill.trim()) return;
    setCvData(d => ({ ...d, skills: [...(d.skills || []), skill.trim()] }));
    markUnsaved();
  };

  const removeSkill = (i) => {
    setCvData(d => ({ ...d, skills: (d.skills || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Habilidades Blandas (Soft Skills)
  const addSoftSkill = (skill) => {
    if (!skill || !skill.trim()) return;
    setCvData(d => ({ ...d, softSkills: [...(d.softSkills || []), skill.trim()] }));
    markUnsaved();
  };

  const removeSoftSkill = (i) => {
    setCvData(d => ({ ...d, softSkills: (d.softSkills || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Idiomas
  const addLanguage = (lang) => {
    if (!lang || !lang.trim()) return;
    setCvData(d => ({ ...d, languages: [...(d.languages || []), lang.trim()] }));
    markUnsaved();
  };

  const removeLanguage = (i) => {
    setCvData(d => ({ ...d, languages: (d.languages || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Certificaciones
  const addCertification = () => {
    setCvData(d => ({ ...d, certifications: [...(d.certifications || []), { name: "", issuer: "", date: "" }] }));
    markUnsaved();
  };

  const updateCertification = (i, field, value) => {
    setCvData(d => {
      const certs = [...(d.certifications || [])];
      certs[i] = { ...certs[i], [field]: value };
      return { ...d, certifications: certs };
    });
    markUnsaved();
  };

  const removeCertification = (i) => {
    setCvData(d => ({ ...d, certifications: (d.certifications || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Proyectos
  const addProject = () => {
    setCvData(d => ({ ...d, projects: [...(d.projects || []), { name: "", role: "", link: "", description: "" }] }));
    markUnsaved();
  };

  const updateProject = (i, field, value) => {
    setCvData(d => {
      const projs = [...(d.projects || [])];
      projs[i] = { ...projs[i], [field]: value };
      return { ...d, projects: projs };
    });
    markUnsaved();
  };

  const removeProject = (i) => {
    setCvData(d => ({ ...d, projects: (d.projects || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Publicaciones
  const addPublication = () => {
    setCvData(d => ({ ...d, publications: [...(d.publications || []), { title: "", publisher: "", date: "", link: "" }] }));
    markUnsaved();
  };

  const updatePublication = (i, field, value) => {
    setCvData(d => {
      const pubs = [...(d.publications || [])];
      pubs[i] = { ...pubs[i], [field]: value };
      return { ...d, publications: pubs };
    });
    markUnsaved();
  };

  const removePublication = (i) => {
    setCvData(d => ({ ...d, publications: (d.publications || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Reconocimientos / Premios
  const addAward = () => {
    setCvData(d => ({ ...d, awards: [...(d.awards || []), { title: "", issuer: "", date: "", description: "" }] }));
    markUnsaved();
  };

  const updateAward = (i, field, value) => {
    setCvData(d => {
      const arr = [...(d.awards || [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...d, awards: arr };
    });
    markUnsaved();
  };

  const removeAward = (i) => {
    setCvData(d => ({ ...d, awards: (d.awards || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Voluntariado
  const addVolunteer = () => {
    setCvData(d => ({ ...d, volunteer: [...(d.volunteer || []), { role: "", organization: "", period: "", description: "" }] }));
    markUnsaved();
  };

  const updateVolunteer = (i, field, value) => {
    setCvData(d => {
      const arr = [...(d.volunteer || [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...d, volunteer: arr };
    });
    markUnsaved();
  };

  const removeVolunteer = (i) => {
    setCvData(d => ({ ...d, volunteer: (d.volunteer || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Referencias
  const addReference = () => {
    setCvData(d => ({ ...d, references: [...(d.references || []), { name: "", company: "", position: "", phone: "", email: "" }] }));
    markUnsaved();
  };

  const updateReference = (i, field, value) => {
    setCvData(d => {
      const arr = [...(d.references || [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...d, references: arr };
    });
    markUnsaved();
  };

  const removeReference = (i) => {
    setCvData(d => ({ ...d, references: (d.references || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Intereses
  const addInterest = (interest) => {
    if (!interest || !interest.trim()) return;
    setCvData(d => ({ ...d, interests: [...(d.interests || []), interest.trim()] }));
    markUnsaved();
  };

  const removeInterest = (i) => {
    setCvData(d => ({ ...d, interests: (d.interests || []).filter((_, idx) => idx !== i) }));
    markUnsaved();
  };

  // Redes / Portafolio
  const addSocialLink = () => {
    setCvData(d => ({ ...d, socialLinks: [...(d.socialLinks || []), { platform: "LinkedIn", url: "", username: "" }] }));
    markUnsaved();
  };

  const updateSocialLink = (i, field, value) => {
    setCvData(d => {
      const arr = [...(d.socialLinks || [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...d, socialLinks: arr };
    });
    markUnsaved();
  };

  const removeSocialLink = (i) => {
    setCvData(d => ({ ...d, socialLinks: (d.socialLinks || []).filter((_, idx) => idx !== i) }));
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
      await supabase
        .from('cv_projects')
        .update({ 
          content: contentToSave, 
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      let shouldSaveVersion = true;
      let isAuto = false;
      
      if (customName === null && recipe === null && activeTemplate === null && composerMode === null) {
        isAuto = true;
        shouldSaveVersion = false;
      }

      if (shouldSaveVersion) {
        const versionName = customName ? customName : (isAuto ? `Autoguardado (${new Date().toLocaleString()})` : `Versión ${new Date().toLocaleString()}`);
        const { error } = await supabase
          .from('cv_versions')
          .insert({
            user_id: user.id,
            project_id: projectId,
            name: versionName,
            content: contentToSave,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error("Error en cv_versions:", error);
          if (!isAuto) customAlert("Error al guardar la versión en historial.\nDetalle: " + error.message);
        }
      }
        
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
    toggleSectionVisibility,
    setSectionVisibility,
    setAllSectionsVisibility,
    updatePersonal,
    setPhoto,
    removePhoto,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addSoftSkill, removeSoftSkill,
    addLanguage, removeLanguage,
    addCertification, updateCertification, removeCertification,
    addProject, updateProject, removeProject,
    addPublication, updatePublication, removePublication,
    addAward, updateAward, removeAward,
    addVolunteer, updateVolunteer, removeVolunteer,
    addReference, updateReference, removeReference,
    addInterest, removeInterest,
    addSocialLink, updateSocialLink, removeSocialLink,
  };
};

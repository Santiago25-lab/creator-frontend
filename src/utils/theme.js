export const accentThemes = {
  lilac: {
    name: 'Lila Mágico',
    colors: {
      '--color-primary': '#d0bcff',
      '--color-primary-light': '#e9ddff',
      '--color-primary-glow': 'rgba(208, 188, 255, 0.15)',
      '--color-secondary': '#4cd7f6',
      '--color-secondary-light': '#acedff',
      '--color-secondary-glow': 'rgba(76, 215, 246, 0.2)'
    }
  },
  emerald: {
    name: 'Esmeralda Tech',
    colors: {
      '--color-primary': '#34d399',
      '--color-primary-light': '#6ee7b7',
      '--color-primary-glow': 'rgba(52, 211, 153, 0.15)',
      '--color-secondary': '#818cf8',
      '--color-secondary-light': '#a5b4fc',
      '--color-secondary-glow': 'rgba(129, 140, 248, 0.2)'
    }
  },
  sapphire: {
    name: 'Zafiro Profundo',
    colors: {
      '--color-primary': '#60a5fa',
      '--color-primary-light': '#93c5fd',
      '--color-primary-glow': 'rgba(96, 165, 250, 0.15)',
      '--color-secondary': '#f472b6',
      '--color-secondary-light': '#fbcfe8',
      '--color-secondary-glow': 'rgba(244, 114, 182, 0.2)'
    }
  },
  amber: {
    name: 'Ámbar Cálido',
    colors: {
      '--color-primary': '#fbbf24',
      '--color-primary-light': '#fcd34d',
      '--color-primary-glow': 'rgba(251, 191, 36, 0.15)',
      '--color-secondary': '#f43f5e',
      '--color-secondary-light': '#fb7185',
      '--color-secondary-glow': 'rgba(244, 63, 94, 0.2)'
    }
  }
};

export const modeThemes = {
  dark: {
    name: 'Oscuro',
    colors: {
      '--bg-app': '#0f0d15',
      '--bg-slate-deep': '#15121b',
      '--panel-bg': 'rgba(29, 26, 35, 0.6)',
      '--panel-border': 'rgba(149, 142, 160, 0.1)',
      '--surface-container': '#211e27',
      '--surface-container-high': '#2c2832',
      '--surface-bright': '#3b3742',
      '--text-on-surface': '#e7e0ed',
      '--text-muted': '#cbc3d7',
      '--text-dim': '#958ea0',
    }
  },
  light: {
    name: 'Claro',
    colors: {
      '--bg-app': '#f8fafc',
      '--bg-slate-deep': '#ffffff',
      '--panel-bg': 'rgba(255, 255, 255, 0.8)',
      '--panel-border': 'rgba(0, 0, 0, 0.08)',
      '--surface-container': '#ffffff',
      '--surface-container-high': '#f1f5f9',
      '--surface-bright': '#e2e8f0',
      '--text-on-surface': '#0f172a',
      '--text-muted': '#475569',
      '--text-dim': '#64748b',
    }
  }
};

export const applyTheme = (accentKey, modeKey) => {
  const accent = accentThemes[accentKey];
  const mode = modeThemes[modeKey];
  
  if (accent) {
    Object.entries(accent.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem('creatorcv_accent', accentKey);
  }
  
  if (mode) {
    Object.entries(mode.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem('creatorcv_mode', modeKey);
  }
};

export const getSavedTheme = () => {
  return {
    accent: localStorage.getItem('creatorcv_accent') || 'lilac',
    mode: localStorage.getItem('creatorcv_mode') || 'dark'
  };
};

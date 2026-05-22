export const themes = {
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

export const applyTheme = (themeKey) => {
  const theme = themes[themeKey];
  if (!theme) return;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  
  localStorage.setItem('creatorcv_theme', themeKey);
};

export const getSavedTheme = () => {
  return localStorage.getItem('creatorcv_theme') || 'lilac';
};

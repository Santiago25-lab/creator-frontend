/**
 * registry.js — Catálogo central de todos los bloques disponibles.
 * Cada entrada tiene: component, label, description, icon, origin.
 */
import { SidebarPhotoHeader, CenteredCleanHeader, BoldEditorialHeader, WarmHelloHeader, DarkImpactHeader, NeonGradientHeader } from './blocks/HeaderBlocks';
import { StandardExp, TimelineDotsExp, DiamondCardExp, DatesSplitExp } from './blocks/ExperienceBlocks';
import { CompactEdu, PeriodBadgeEdu, DiamondListEdu } from './blocks/EducationBlocks';
import { TagsSkills, BadgesBoldSkills, PillsWarmSkills, CirclesAbbrSkills, ProgressBarsSkills, NeonTagsSkills } from './blocks/SkillBlocks';
import { IconListContact, PillsEmojiContact, DarkGlowContact } from './blocks/ContactBlocks';

/* ── HEADERS ── */
export const HEADERS = {
  'sidebar-photo':   { component: SidebarPhotoHeader,   label: 'Sidebar con Foto',   icon: 'fa-id-badge',         origin: 'ResumeA' },
  'centered-clean':  { component: CenteredCleanHeader,  label: 'Centrado Limpio',    icon: 'fa-align-center',     origin: 'ResumeB' },
  'bold-editorial':  { component: BoldEditorialHeader,  label: 'Bold Editorial',     icon: 'fa-bold',             origin: 'ResumeD' },
  'warm-hello':      { component: WarmHelloHeader,      label: 'Warm Hello',         icon: 'fa-hand-peace',       origin: 'ResumeE' },
  'dark-impact':     { component: DarkImpactHeader,     label: 'Dark Impact',        icon: 'fa-moon',             origin: 'ResumeF' },
  'neon-gradient':   { component: NeonGradientHeader,   label: 'Neon Gradient',      icon: 'fa-wand-sparkles',    origin: 'Creative' },
};

/* ── EXPERIENCE ── */
export const EXPERIENCE = {
  'standard':       { component: StandardExp,      label: 'Estándar',          icon: 'fa-list',             origin: 'ResumeA' },
  'timeline-dots':  { component: TimelineDotsExp,  label: 'Timeline con Dots', icon: 'fa-timeline',         origin: 'Creative' },
  'diamond-card':   { component: DiamondCardExp,   label: 'Diamond Card',      icon: 'fa-gem',              origin: 'ResumeE' },
  'dates-split':    { component: DatesSplitExp,    label: 'Fechas Separadas',  icon: 'fa-calendar-days',    origin: 'ResumeD' },
};

/* ── EDUCATION ── */
export const EDUCATION = {
  'compact':       { component: CompactEdu,      label: 'Compacto',        icon: 'fa-list',             origin: 'ResumeA' },
  'period-badge':  { component: PeriodBadgeEdu,  label: 'Badge Periodo',   icon: 'fa-tag',              origin: 'ResumeD' },
  'diamond-list':  { component: DiamondListEdu,  label: 'Diamond List',    icon: 'fa-gem',              origin: 'ResumeE' },
};

/* ── SKILLS ── */
export const SKILLS = {
  'tags-simple':    { component: TagsSkills,          label: 'Tags Simples',       icon: 'fa-tags',             origin: 'ResumeA' },
  'badges-bold':    { component: BadgesBoldSkills,    label: 'Badges Bold',        icon: 'fa-certificate',      origin: 'ResumeD' },
  'pills-warm':     { component: PillsWarmSkills,     label: 'Pills Rellenos',     icon: 'fa-capsules',         origin: 'ResumeE' },
  'circles-abbr':   { component: CirclesAbbrSkills,   label: 'Círculos',           icon: 'fa-circle',           origin: 'ResumeF' },
  'progress-bars':  { component: ProgressBarsSkills,  label: 'Barras de Progreso', icon: 'fa-chart-simple',     origin: 'Smart' },
  'neon-tags':      { component: NeonTagsSkills,      label: 'Neon Tags',          icon: 'fa-bolt',             origin: 'Creative' },
};

/* ── CONTACT ── */
export const CONTACT = {
  'icon-list':     { component: IconListContact,    label: 'Lista con Íconos',  icon: 'fa-address-card',     origin: 'ResumeA' },
  'pills-emoji':   { component: PillsEmojiContact,  label: 'Pills con Emoji',   icon: 'fa-face-smile',       origin: 'Creative' },
  'dark-glow':     { component: DarkGlowContact,    label: 'Cards con Glow',    icon: 'fa-moon',             origin: 'ResumeF' },
};

/* ── LAYOUTS ── */
export const LAYOUTS = {
  'single-column': { label: 'Una Columna',     icon: 'fa-square',           description: 'Todo centrado en una columna' },
  'two-column':    { label: 'Dos Columnas',    icon: 'fa-table-columns',    description: 'Contenido dividido 60/40' },
  'sidebar-left':  { label: 'Sidebar Izq.',    icon: 'fa-indent',           description: 'Barra lateral con contenido principal' },
};

/* ── RECETA POR DEFECTO ── */
export const DEFAULT_RECIPE = {
  layout: 'single-column',
  header: 'centered-clean',
  experience: 'standard',
  education: 'compact',
  skills: 'tags-simple',
  contact: 'icon-list',
  theme: {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
  },
};

/* ── PRESETS (plantillas como recetas) ── */
export const PRESETS = [
  {
    id: 'preset-professional',
    name: 'Professional',
    recipe: {
      layout: 'sidebar-left', header: 'sidebar-photo', experience: 'standard',
      education: 'compact', skills: 'tags-simple', contact: 'icon-list',
      theme: { primaryColor: '#3b82f6', backgroundColor: '#ffffff', textColor: '#1e293b' },
    },
  },
  {
    id: 'preset-creative',
    name: 'Creative Neon',
    recipe: {
      layout: 'single-column', header: 'neon-gradient', experience: 'timeline-dots',
      education: 'period-badge', skills: 'neon-tags', contact: 'pills-emoji',
      theme: { primaryColor: '#8b5cf6', backgroundColor: '#ffffff', textColor: '#1e293b' },
    },
  },
  {
    id: 'preset-editorial',
    name: 'Bold Editorial',
    recipe: {
      layout: 'two-column', header: 'bold-editorial', experience: 'dates-split',
      education: 'period-badge', skills: 'badges-bold', contact: 'dark-glow',
      theme: { primaryColor: '#7c3aed', backgroundColor: '#ffffff', textColor: '#1e293b' },
    },
  },
  {
    id: 'preset-warm',
    name: 'Warm & Friendly',
    recipe: {
      layout: 'single-column', header: 'warm-hello', experience: 'diamond-card',
      education: 'diamond-list', skills: 'pills-warm', contact: 'pills-emoji',
      theme: { primaryColor: '#e11d48', backgroundColor: '#ffffff', textColor: '#1e293b' },
    },
  },
  {
    id: 'preset-dark',
    name: 'Dark Impact',
    recipe: {
      layout: 'two-column', header: 'dark-impact', experience: 'standard',
      education: 'compact', skills: 'circles-abbr', contact: 'dark-glow',
      theme: { primaryColor: '#64748b', backgroundColor: '#ffffff', textColor: '#1e293b' },
    },
  },
  {
    id: 'preset-tech',
    name: 'Tech Pro',
    recipe: {
      layout: 'single-column', header: 'centered-clean', experience: 'timeline-dots',
      education: 'compact', skills: 'progress-bars', contact: 'icon-list',
      theme: { primaryColor: '#0ea5e9', backgroundColor: '#ffffff', textColor: '#0f172a' },
    },
  },
];

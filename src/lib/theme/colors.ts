import type { Brand } from '@/types';

export interface ThemeColors {
  '--bg-primary': string;
  '--bg-secondary': string;
  '--bg-card': string;
  '--bg-card-hover': string;
  '--bg-input': string;
  '--brand-primary': string;
  '--brand-light': string;
  '--brand-dark': string;
  '--brand-glow': string;
  '--brand-accent': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-muted': string;
  '--accent-green': string;
  '--accent-red': string;
  '--border': string;
  '--border-strong': string;
  '--ticker-bg': string;
  '--ticker-border': string;
}

const vvipColors: ThemeColors = {
  '--bg-primary': '#0b0e14',
  '--bg-secondary': '#131722',
  '--bg-card': '#151924',
  '--bg-card-hover': '#1c2030',
  '--bg-input': '#1a1e2e',
  '--brand-primary': '#d4a829',
  '--brand-light': '#f0d060',
  '--brand-dark': '#a07d1a',
  '--brand-glow': 'rgba(212, 168, 41, 0.3)',
  '--brand-accent': '#d4a829',
  '--text-primary': '#e8ecf2',
  '--text-secondary': '#848e9c',
  '--text-muted': '#474d57',
  '--accent-green': '#0ecb81',
  '--accent-red': '#f6465d',
  '--border': '#2a2e39',
  '--border-strong': '#363a45',
  '--ticker-bg': '#111520',
  '--ticker-border': '#2a2e39',
};

const platinumColors: ThemeColors = {
  '--bg-primary': '#0b0e14',
  '--bg-secondary': '#131722',
  '--bg-card': '#151924',
  '--bg-card-hover': '#1c2030',
  '--bg-input': '#1a1e2e',
  '--brand-primary': '#00c2c7',
  '--brand-light': '#33d6da',
  '--brand-dark': '#009a9e',
  '--brand-glow': 'rgba(0, 194, 199, 0.25)',
  '--brand-accent': '#00c2c7',
  '--text-primary': '#e8ecf2',
  '--text-secondary': '#848e9c',
  '--text-muted': '#474d57',
  '--accent-green': '#0ecb81',
  '--accent-red': '#f6465d',
  '--border': '#2a2e39',
  '--border-strong': '#363a45',
  '--ticker-bg': '#111520',
  '--ticker-border': '#2a2e39',
};

export function getThemeColors(brand: Brand): ThemeColors {
  return brand === 'platinum' ? platinumColors : vvipColors;
}

export function getThemeCSSString(brand: Brand): string {
  const colors = getThemeColors(brand);
  return Object.entries(colors)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n    ');
}

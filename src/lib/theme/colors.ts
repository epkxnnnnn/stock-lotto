import type { Brand } from '@/types';

export interface ThemeColors {
  '--bg-primary': string;
  '--bg-secondary': string;
  '--bg-card': string;
  '--bg-card-hover': string;
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
}

const vvipColors: ThemeColors = {
  '--bg-primary': '#0a0a0f',
  '--bg-secondary': '#111118',
  '--bg-card': '#16161f',
  '--bg-card-hover': '#1c1c28',
  '--brand-primary': '#d4a829',
  '--brand-light': '#f0d060',
  '--brand-dark': '#a07d1a',
  '--brand-glow': 'rgba(212, 168, 41, 0.3)',
  '--brand-accent': '#d4a829',
  '--text-primary': '#f0ece0',
  '--text-secondary': '#8a8690',
  '--text-muted': '#5a5660',
  '--accent-green': '#2ecc71',
  '--accent-red': '#e74c3c',
  '--border': 'rgba(212, 168, 41, 0.15)',
};

const platinumColors: ThemeColors = {
  '--bg-primary': '#080a0e',
  '--bg-secondary': '#0e1117',
  '--bg-card': '#131720',
  '--bg-card-hover': '#1a1f2c',
  '--brand-primary': '#a8b4c4',
  '--brand-light': '#d0dae8',
  '--brand-dark': '#6e7a8a',
  '--brand-glow': 'rgba(168, 180, 196, 0.25)',
  '--brand-accent': '#7eb8e0',
  '--text-primary': '#e8ecf2',
  '--text-secondary': '#7a8292',
  '--text-muted': '#4a5060',
  '--accent-green': '#2ecc71',
  '--accent-red': '#e74c3c',
  '--border': 'rgba(168, 180, 196, 0.12)',
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

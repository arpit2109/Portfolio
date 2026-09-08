export const theme = {
  colors: {
    bg: '#050505',
    bgAlt: '#0a0a0a',
    bgElevated: '#111111',
    bgCard: 'rgba(255,255,255,0.04)',
    primary: '#ffffff',
    secondary: '#a0a0a0',
    textPrimary: '#f5f5f5',
    textMuted: '#777777',
    borderSubtle: 'rgba(255,255,255,0.06)',
    borderHover: 'rgba(255,255,255,0.12)',
    glowSoft: '0 0 30px rgba(255,255,255,0.08)',
    glowHover: '0 0 20px rgba(255,255,255,0.12)',
    glowStrong: '0 0 40px rgba(255,255,255,0.15)',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #888888 100%)',
    gradientText: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
  },
  fonts: {
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  glass: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    blur: 'blur(16px)',
    hoverBorder: '1px solid rgba(255,255,255,0.14)',
  },
} as const;

export type Theme = typeof theme;

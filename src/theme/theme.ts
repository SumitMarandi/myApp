const base = {
  typography: {
    h1: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
      letterSpacing: -0.2,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    full: 999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export const light = {
  ...base,
  colors: {
    primary: '#007AFF',
    accent: '#FF5A5F',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: {
      primary: '#1C1E21',
      secondary: '#65676B',
      muted: '#8A8D91',
      white: '#FFFFFF',
      link: '#007AFF',
    },
    border: '#E4E6EA',
    divider: '#F0F2F5',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: '#42B883',
    warning: '#F39C12',
    error: '#E74C3C',
  },
} as const;

export const dark = {
  ...base,
  colors: {
    primary: '#0A84FF',
    accent: '#FF6B6B',
    background: '#0B1020',
    surface: '#0F1724',
    text: {
      primary: '#E6EDF3',
      secondary: '#B0B9C4',
      muted: '#9AA6B2',
      white: '#FFFFFF',
      link: '#4EA1FF',
    },
    border: '#1F2937',
    divider: '#111827',
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(255, 255, 255, 0.06)',
    success: '#2ECC71',
    warning: '#F59E0B',
    error: '#EF4444',
  },
} as const;

export const solarized = {
  ...base,
  colors: {
    primary: '#268BD2',
    accent: '#B58900',
    background: '#002b36',
    surface: '#073642',
    text: {
      primary: '#839496',
      secondary: '#93A1A1',
      muted: '#586E75',
      white: '#FFFFFF',
      link: '#268BD2',
    },
    border: '#073642',
    divider: '#002b36',
    shadow: 'rgba(0, 0, 0, 0.4)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: '#2AA198',
    warning: '#B58900',
    error: '#DC322F',
  },
} as const;

export const themes = { light, dark, solarized } as const;

export type Theme = typeof themes[keyof typeof themes];

// Backwards-compatibility: export a `theme` object (default to light)
export const theme = themes.light;
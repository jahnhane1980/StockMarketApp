// src/theme/Theme.js - Semantisches Design System

const grid = 4; // Basis-Einheit für alle Abstände

const sharedTokens = {
  spacing: {
    xs: grid * 1, // 4
    sm: grid * 2, // 8
    md: grid * 4, // 16
    lg: grid * 6, // 24
    xl: grid * 8, // 32
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 999,
  },
  typography: {
    size: {
      caption: 10,
      body: 14,
      subheading: 16,
      heading: 20,
      display: 24,
    },
    weight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
    style: { italic: 'italic' }
  },
  layout: {
    icon: { sm: 18, md: 24, lg: 32 },
    headerHeight: 60,
    modalWidth: '92%',
  },
  effects: {
    border: 1,
    opacityDisabled: 0.5,
  }
};

export const DarkTheme = {
  ...sharedTokens,
  dark: true,
  colors: {
    background: '#1E1F22',
    surface: '#2B2D30',
    overlay: 'rgba(0, 0, 0, 0.7)',
    border: '#323232',
    primary: '#3574F0',
    onPrimary: '#FFFFFF',
    text: '#A9B7C6',
    textSubtle: '#6A6E73',
    success: '#629755',
    warning: '#CC7832',
    error: '#BC3F3C',
  }
};

export const LightTheme = {
  ...sharedTokens,
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#D3E3FD',
    overlay: 'rgba(0, 0, 0, 0.3)',
    border: '#C7D8F0',
    primary: '#3574F0',
    onPrimary: '#FFFFFF',
    text: '#041E49',
    textSubtle: '#5F6368',
    success: '#146C2E',
    warning: '#BF5000',
    error: '#B3261E',
  }
};
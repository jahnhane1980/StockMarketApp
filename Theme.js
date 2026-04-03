// Theme.js - Unsere zentralen Design Tokens (Variablen)

export const Theme = {
  colors: {
    // Backgrounds
    bgMain: '#1E1F22',      
    bgSurface: '#2B2D30',   
    bgOverlay: 'rgba(0, 0, 0, 0.7)', // Neu für Modal-Hintergrund

    // Borders & Dividers
    borderSubtle: '#323232', 
    shadowDefault: '#000',           // Neu für Schatten

    // Text Colors
    textPrimary: '#A9B7C6',   
    textOnPrimary: '#FFFFFF', 
    textSubtle: '#6A6E73',   

    // Brand & Interactions
    brandPrimary: '#3574F0', 
    inputFocus: '#808080',   

    // Status Colors
    statusCritical: '#BC3F3C', 
    statusAlert: '#CC7832',   
  },

  radii: {
    standard: 6,   
    input: 4,      
    dialog: 8,     
    full: 99,      // Neu für runde Marker
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Neu: Typografie-Tokens
  typography: {
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    },
    weight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: 'bold',
    }
  },

  // Neu: Effekt-Tokens
  effects: {
    shadowOpacityFull: 1,
    shadowOpacityDialog: 0.3,
    shadowRadiusMarker: 6,
    shadowRadiusDialog: 10,
    borderWidthThin: 1,
  },

  // Neu: Icon-Größen
  icons: {
    sm: 16,
    md: 24,
  }
};

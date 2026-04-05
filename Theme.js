// Theme.js - Unsere zentralen Design Tokens

export const Theme = {
  colors: {
    bgMain: '#1E1F22',      
    bgSurface: '#2B2D30',   
    bgOverlay: 'rgba(0, 0, 0, 0.7)', 
    borderSubtle: '#323232', 
    shadowDefault: '#000',           
    textPrimary: '#A9B7C6',   
    textOnPrimary: '#FFFFFF', 
    textSubtle: '#6A6E73',   
    brandPrimary: '#3574F0', 
    inputFocus: '#808080',   
    statusCritical: '#BC3F3C', 
    statusAlert: '#CC7832',   
    statusSuccess: '#629755', 
  },
  radii: {
    standard: 6,   
    input: 4,      
    dialog: 8,     
    full: 99,      
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  layout: {
    fabBottom: 30,
    fabRight: 20,
    fabSize: 56,
    toolbarHeight: 60,
    tickerWidth: 80,
    priceMinWidth: 60,
    dialogMaxHeight: '85%',
    iconButtonSize: 40,
  },
  typography: {
    size: {
      xs: 12, 
      sm: 14, 
      md: 16, 
      lg: 18, 
      xl: 22, 
    },
    weight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: 'bold',
    }
  },
  effects: {
    shadowOpacityFull: 1,
    shadowOpacityDialog: 0.3,
    shadowOpacityFab: 0.4,
    shadowRadiusMarker: 6,
    shadowRadiusDialog: 10,
    borderWidthThin: 1,
  },
  icons: {
    sm: 16,
    md: 24,
    lg: 30,
  }
};
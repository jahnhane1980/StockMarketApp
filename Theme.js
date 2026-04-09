// Theme.js - 100% Abstraktion aller visuellen Parameter (Full-Body)

const sharedTokens = {
  radii: { standard: 6, input: 4, dialog: 8, indicator: 6, full: 99 },
  spacing: { 
    xs: 4, 
    sm: 8, 
    md: 16, 
    lg: 24, 
    xl: 32 
  },
  layout: { 
    fabBottom: 30, 
    fabRight: 20, 
    fabSize: 56, 
    toolbarHeight: 60, 
    tickerWidth: 80, 
    priceMinWidth: 60, 
    dialogMaxHeight: '85%', 
    modalWidth: '90%', 
    iconButtonSize: 40,
    macroIndicatorSize: 12, // Neu
    standardGap: 8 // Neu
  },
  typography: {
    size: { xxs: 10, xs: 12, sm: 14, md: 16, lg: 18, xl: 22 },
    weight: { normal: '400', medium: '500', semibold: '600', bold: 'bold' },
    style: { italic: 'italic', normal: 'normal' }
  },
  effects: { 
    shadowOpacityFull: 1, 
    shadowOpacityDialog: 0.3, 
    shadowOpacityFab: 0.4, 
    shadowRadiusMarker: 6, 
    shadowRadiusDialog: 10, 
    borderWidthThin: 1,
    opacityDisabled: 0.5 
  },
  icons: { xs: 16, sm: 18, md: 24, lg: 30 }
};

export const DarkTheme = {
  ...sharedTokens,
  dark: true,
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
  }
};

export const LightTheme = {
  ...sharedTokens,
  dark: false,
  colors: {
    bgMain: '#ffffff',      
    bgSurface: '#d3e3fd',   
    bgOverlay: 'rgba(0, 0, 0, 0.3)', 
    borderSubtle: '#c7d8f0', 
    shadowDefault: '#000',           
    textPrimary: '#041e49', 
    textOnPrimary: '#FFFFFF', 
    textSubtle: '#5f6368',   
    brandPrimary: '#3574F0', 
    inputFocus: '#3574F0',   
    statusCritical: '#b3261e', 
    statusAlert: '#bf5000',   
    statusSuccess: '#146c2e', 
  }
};

export const Theme = DarkTheme;
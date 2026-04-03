// Theme.js - Unsere zentralen Design Tokens (Variablen)

export const Theme = {
  colors: {
    // Backgrounds (wie besprochen identisch für Dialog & Main)
    bgMain: '#1E1F22',      // Sehr dunkles Grau (aus image_9.png)
    bgSurface: '#2B2D30',   // Etwas helleres Grau für Karten/Items

    // Borders & Dividers
    borderSubtle: '#323232', // Dezente 1px Linien & Dialog-Rand

    // Text Colors
    textPrimary: '#A9B7C6',   // Standard (aus image_2.png/Darcula)
    textOnPrimary: '#FFFFFF', // Weiß für Text auf blauem Button
    textSubtle: '#6A6E73',   // Dunkleres Grau für Labels/Placeholder

    // Brand & Interactions
    brandPrimary: '#3574F0', // Das "Action Blue" für den Speicher-Button
    inputFocus: '#808080',   // Neutrale graue Outline für das aktive Feld

    // Status Colors (aus image_2.png für Aktien)
    statusCritical: '#BC3F3C', // Fehler-Rot (RIVN)
    statusAlert: '#CC7832',   // Warn-Orange (TSLA)
  },

  radii: {
    standard: 6,   // Buttons, Aktien-Karten
    input: 4,      // Eingabefelder
    dialog: 8,     // Äußere Ecken des Einstellungs-Dialogs
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

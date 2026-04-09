// src/core/InputUtils.js - Vollständige Transformation & Validierung (Full-Body)

export const InputUtils = {
  /**
   * Verarbeitet lokalisierte Eingaben (Komma) zu einem gültigen Float.
   */
  localizeStringToFloat: (value) => {
    if (typeof value !== 'string') return value || 0;
    const normalized = value.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  },

  /**
   * Prüft, ob ein Wert positiv ist.
   */
  validateIsPositiveAmount: (value, label = "Der Wert") => {
    const numericValue = InputUtils.localizeStringToFloat(value);
    if (numericValue < 0) return `${label} darf nicht negativ sein`;
    if (numericValue === 0 && value !== '0' && value !== '') return `Bitte gültige Zahl für ${label} eingeben`;
    return null;
  },

  /**
   * Normalisiert Ticker-Symbole (Trimmen & Großbuchstaben).
   */
  formatTickerSymbol: (ticker) => {
    return (ticker || '').trim().toUpperCase();
  },

  /**
   * Prüft, ob ein Pflichtfeld ausgefüllt ist.
   */
  validateRequired: (value, label = "Dieses Feld") => {
    if (!value || value.trim().length === 0) return `${label} ist ein Pflichtfeld`;
    return null;
  },

  /**
   * Bereinigt Schlüssel (z.B. API Keys) von versehentlichen Leerzeichen.
   */
  sanitizeKey: (key) => {
    return (key || '').trim();
  },

  /**
   * Hilfsfunktion für die Suche (Case-Insensitive Vergleich).
   */
  matchesSearchFilter: (itemValue, filterTerm) => {
    if (!filterTerm) return true;
    const normalizedItem = (itemValue || '').toLowerCase();
    const normalizedFilter = filterTerm.toLowerCase();
    return normalizedItem.includes(normalizedFilter);
  }
};
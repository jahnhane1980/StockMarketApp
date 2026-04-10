// src/core/Constants.js - Vollständige System-Konfiguration (Full-Body)

export const ASSET_STATUS = {
  WATCH: 'WATCH',
  OWNED: 'OWNED',
  ARCHIVED: 'ARCHIVED'
};

export const ASSET_TYPES = {
  A: { id: 'A', label: 'A: Growth' },
  B: { id: 'B', label: 'B: Big Cap' },
  C: { id: 'C', label: 'C: Macro / Crypto' },
  D: { id: 'D', label: 'D: High Risk' }
};

export const ACTIONS = {
  BUY: 'Kauf',
  SELL: 'Verkauf'
};

export const CURRENCIES = {
  EUR: 'EUR',
  USD: 'USD'
};

export const FUNDING_SOURCES = {
  EQUITY: 'EK',
  DEBT: 'FK'
};

export const MARKET_THRESHOLDS = {
  BULLISH: 7.1,
  NEUTRAL: 3.6
};

export const MARKET_STATUS = {
  BULLISH: 'BULLISH',
  NEUTRAL: 'NEUTRAL',
  BEARISH: 'BEARISH',
  UNKNOWN: 'UNKNOWN'
};

// Metrik-Zustände für die UI-Logik
export const METRIC_STATES = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE'
};

// Cache-Dauern
export const MACRO_CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 Stunden
export const T212_CACHE_DURATION = 1 * 60 * 60 * 1000;  // 1 Stunde für Trading212 Daten
export const RADAR_CACHE_DURATION = 4 * 60 * 60 * 1000; // NEU: 4 Stunden für Radar Daten

// Hintergrund-Worker Konfigurationen
const SHARED_WORKER_CONFIG = {
  TASK_NAME: 'MARKET_SCAN_TASK',
};

export const PRODUCTION_WORKER_CONFIG = {
  ...SHARED_WORKER_CONFIG,
  SCAN_TIMES: ['15:35', '20:15', '21:45'], 
  FETCH_INTERVAL: 60 * 15 // 15 Minuten
};

export const TEST_WORKER_CONFIG = {
  ...SHARED_WORKER_CONFIG,
  SCAN_TIMES: [], 
  FETCH_INTERVAL: 60 // 1 Minute
};
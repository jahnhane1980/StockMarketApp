// src/core/Constants.js - Strukturierte Konfiguration (Full-Body)

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

export const METRIC_STATES = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE'
};

// Hintergrund-Worker Konfigurationen (Ähnlich wie Theme-Ansatz)
const SHARED_WORKER_CONFIG = {
  TASK_NAME: 'MARKET_SCAN_TASK',
};

export const PRODUCTION_WORKER_CONFIG = {
  ...SHARED_WORKER_CONFIG,
  SCAN_TIMES: ['15:35', '20:15', '21:45'], // MEZ (CET)
  FETCH_INTERVAL: 60 * 15 // 15 Minuten
};

export const TEST_WORKER_CONFIG = {
  ...SHARED_WORKER_CONFIG,
  // Im Testmodus: Scannt zu jeder vollen Minute (Simuliert durch leere Liste oder speziellen Trigger)
  SCAN_TIMES: [], 
  FETCH_INTERVAL: 60 // 1 Minute für schnelles Feedback
};
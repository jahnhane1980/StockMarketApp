// src/core/Constants.js - Vollständige System-Konstanten (Final Clean-up)

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

// Schwellenwerte für Markt-Scores
export const MARKET_THRESHOLDS = {
  BULLISH: 7.1,
  NEUTRAL: 3.6
};

// NEU: Markt-Status Konstanten
export const MARKET_STATUS = {
  BULLISH: 'BULLISH',
  NEUTRAL: 'NEUTRAL',
  BEARISH: 'BEARISH',
  UNKNOWN: 'UNKNOWN'
};

// NEU: Metrik-Zustände aus der API
export const METRIC_STATES = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE'
};
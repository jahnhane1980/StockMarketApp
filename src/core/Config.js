// src/core/Config.js - Production Sync (Full-Body)

import { PRODUCTION_WORKER_CONFIG, TEST_WORKER_CONFIG } from './Constants';

// Auf FALSE setzen, damit GoogleApiService aktiv wird
const IS_TEST_MODE = false; 

export const Config = {
  GOOGLE_API: {
    URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    KEY: "", // Über das Settings-Menü in der App eintragen
    PROMPT_PATH: 'assets/prompt_stock_analyser.md'
  },
  TEST: IS_TEST_MODE,
  ADMIN_EMAIL: "jahnhane@gmail.com",
  WORKER: IS_TEST_MODE ? TEST_WORKER_CONFIG : PRODUCTION_WORKER_CONFIG
};
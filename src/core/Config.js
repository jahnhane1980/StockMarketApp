// src/core/Config.js - Update: Dynamischer Test-Modus (Full-Body)

import { PRODUCTION_WORKER_CONFIG, TEST_WORKER_CONFIG } from './Constants';

export const Config = {
  GOOGLE_API: {
    URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    KEY: "", 
    PROMPT_PATH: 'assets/prompt_stock_analyser.js'
  },
  // Wird nun initial durch den usePortfolioManager aus den Settings gesetzt
  TEST: true, 
  ADMIN_EMAIL: "jahnhane@gmail.com",
  WORKER: PRODUCTION_WORKER_CONFIG
};
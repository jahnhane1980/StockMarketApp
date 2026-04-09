// src/core/Config.js - Update: Gemini 2.5 Flash Sync (Full-Body)

import { PRODUCTION_WORKER_CONFIG, TEST_WORKER_CONFIG } from './Constants';

const IS_TEST_MODE = false; 

export const Config = {
  GOOGLE_API: {
    // v1beta ist notwendig für die neuesten Flash-Modelle und JSON-Features
    URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    KEY: "", // Bleibt leer für GitHub, Eintragung nur via App-Settings
    PROMPT_PATH: 'assets/prompt_stock_analyser.js'
  },
  TEST: IS_TEST_MODE,
  ADMIN_EMAIL: "jahnhane@gmail.com",
  WORKER: IS_TEST_MODE ? TEST_WORKER_CONFIG : PRODUCTION_WORKER_CONFIG
};
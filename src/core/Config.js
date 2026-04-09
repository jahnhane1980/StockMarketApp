// src/core/Config.js - Update: Local Prompt Path (Full-Body)

import { PRODUCTION_WORKER_CONFIG, TEST_WORKER_CONFIG } from './Constants';

const IS_TEST_MODE = false; 

export const Config = {
  GOOGLE_API: {
    URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    KEY: "", 
    // Pfad zur lokalen Prompt-Datei im Source
    PROMPT_PATH: 'assets/prompt_stock_analyser.md'
  },
  TEST: IS_TEST_MODE,
  ADMIN_EMAIL: "jahnhane@gmail.com",
  WORKER: IS_TEST_MODE ? TEST_WORKER_CONFIG : PRODUCTION_WORKER_CONFIG
};
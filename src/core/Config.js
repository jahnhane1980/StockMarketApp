// src/core/Config.js - Aktive Konfigurations-Logik (Full-Body)

import { PRODUCTION_WORKER_CONFIG, TEST_WORKER_CONFIG } from './Constants';

const IS_TEST_MODE = true; // Zentrale Steuerung

export const Config = {
  GOOGLE_API: {
    URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    KEY: "",
  },
  TEST: IS_TEST_MODE,
  ADMIN_EMAIL: "jahnhane@gmail.com",
  
  // Dynamische Zuweisung basierend auf dem Modus (Theme-Style)
  WORKER: IS_TEST_MODE ? TEST_WORKER_CONFIG : PRODUCTION_WORKER_CONFIG
};
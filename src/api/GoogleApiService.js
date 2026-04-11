// src/api/GoogleApiService.js - Refactored AI Core & Radar Prompt (Full-Body)

import { Config } from '../core/Config';
import { HttpClient } from './HttpClient';
import { SYSTEM_PROMPT as MACRO_PROMPT } from '../assets/prompt_stock_analyser';
import { RADAR_SYSTEM_PROMPT } from '../assets/prompt_stock_radar'; 

export class GoogleApiService {
  async _callAi(prompt, inputData) {
    if (!Config.GOOGLE_API.KEY) {
      throw new Error("API_KEY_MISSING");
    }

    const payload = {
      contents: [{
        parts: [{ text: `${prompt}\n\nINPUT_DATA: ${JSON.stringify(inputData)}` }]
      }],
      generationConfig: { response_mime_type: "application/json", temperature: 0.1 }
    };

    try {
      if (global.log) global.log.info("GoogleApiService: Sende Request an Gemini API...");

      // HttpClient übernimmt Fetch, Timeout und Retries!
      // Wir überschreiben das Default-Timeout mit deinen 90s und übergeben den Auth-Header.
      const response = await HttpClient.post(Config.GOOGLE_API.URL, payload, { 
        retries: 2,
        timeout: 90000, 
        headers: {
          'x-goog-api-key': Config.GOOGLE_API.KEY
        }
      });

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) throw new Error("INVALID_AI_RESPONSE");

      // JSON Sanitizing: Workaround für Markdown-Backticks der KI
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("KI lieferte kein valides JSON-Format.");
      }
      
      const cleanJson = rawText.substring(firstBrace, lastBrace + 1);
      return JSON.parse(cleanJson);
      
    } catch (error) {
      // Spezifisches Error-Handling für den AbortError (Timeout) beibehalten
      if (error.name === 'AbortError') {
        throw new Error("TIMEOUT: KI-Anfrage überschritt 90s.");
      }
      
      // NEU: Fange die HTTP-Fehler vom HttpClient ab und mappe sie auf dein altes Format
      if (error.status) {
        throw new Error(`SERVER_ERROR_${error.status}`);
      }
      
      if (global.log) global.log.error("GoogleApiService: Fehler bei der KI-Analyse", error);
      throw error;
    }
  }

  async getMacroScore(inputData) {
    return this._callAi(MACRO_PROMPT, inputData);
  }

  async getRadarData() {
    const now = new Date();
    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    
    // Daten vorbereiten
    const currentMonthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    const currentDate = now.toISOString().split('T')[0];
    const lastAndCurrentYear = `${now.getFullYear() - 1}/${now.getFullYear()}`;
    const currentIsoTimestamp = now.toISOString();

    // Platzhalter im Prompt ersetzen
    const dynamicPrompt = RADAR_SYSTEM_PROMPT
      .replace(/\{\{CURRENT_MONTH_YEAR\}\}/g, currentMonthYear)
      .replace(/\{\{CURRENT_DATE\}\}/g, currentDate)
      .replace(/\{\{LAST_AND_CURRENT_YEAR\}\}/g, lastAndCurrentYear)
      .replace(/\{\{CURRENT_ISO_TIMESTAMP\}\}/g, currentIsoTimestamp);

    if (global.log) global.log.info(`Radar Engine gestartet. Zeitstempel: ${currentDate}`);

    return this._callAi(dynamicPrompt, { mode: 'autonomous_scan' });
  }

  /**
   * Das ist aktuell ein reiner Platzhalter (Stub).
   */
  async getStockDetails(ticker) {
    return { ticker, price: "0.00", logic_notes: ["Live-Analyse V34.0 aktiv."] };
  }
}
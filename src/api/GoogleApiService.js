// src/api/GoogleApiService.js - Refactored AI Core & Radar Prompt (Full-Body)

import { Config } from '../core/Config';
import { SYSTEM_PROMPT as MACRO_PROMPT } from '../assets/prompt_stock_analyser';
import { RADAR_SYSTEM_PROMPT } from '../assets/prompt_stock_radar'; // NEU IMPORTIERT

export class GoogleApiService {
  async _callAi(prompt, inputData, retryCount = 0) {
    if (!Config.GOOGLE_API.KEY) {
      throw new Error("API_KEY_MISSING");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      const payload = {
        contents: [{
          parts: [{ text: `${prompt}\n\nINPUT_DATA: ${JSON.stringify(inputData)}` }]
        }],
        generationConfig: { response_mime_type: "application/json", temperature: 0.1 }
      };

      const response = await fetch(Config.GOOGLE_API.URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': Config.GOOGLE_API.KEY 
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if ((response.status === 503 || response.status === 429) && retryCount < 2) {
        const delay = response.status === 429 ? 5000 : 3000; 
        if (global.log) global.log.warn(`API Status ${response.status}: Retry ${retryCount + 1} nach ${delay}ms`);
        await new Promise(res => setTimeout(res, delay));
        return this._callAi(prompt, inputData, retryCount + 1);
      }

      if (!response.ok) throw new Error(`SERVER_ERROR_${response.status}`);

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("INVALID_AI_RESPONSE");

      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("KI lieferte kein valides JSON-Format.");
      }
      
      const cleanJson = rawText.substring(firstBrace, lastBrace + 1);
      return JSON.parse(cleanJson);
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error("TIMEOUT: KI-Anfrage überschritt 90s.");
      }
      throw error;
    }
  }

  async getMacroScore(inputData) {
    return this._callAi(MACRO_PROMPT, inputData);
  }

  // NEU: Dynamische Prompt-Injektion für den Radar
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
 * Das ist aktuell ein reiner Platzhalter (Stub). Wir haben sie beim initialen API-Design mit angelegt für den *  Fall, dass du später mal in der MainView auf eine einzelne Aktie (z. B. "AAPL") klickst und sich dann ein 
 * Dialog mit einem exakten KI-Deep-Dive nur für diesen einen Ticker öffnet.
 */
  async getStockDetails(ticker) {
    return { ticker, price: "0.00", logic_notes: ["Live-Analyse V34.0 aktiv."] };
  }
}
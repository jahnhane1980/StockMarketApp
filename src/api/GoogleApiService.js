// src/api/GoogleApiService.js - Refactored AI Core & Radar Support (Full-Body)

import { Config } from '../core/Config';
import { SYSTEM_PROMPT as MACRO_PROMPT } from '../assets/prompt_stock_analyser';

export class GoogleApiService {
  /**
   * Zentraler AI-Executor mit robustem Error-Handling und Retries
   */
  async _executeAiRequest(prompt, inputData, retryCount = 0) {
    if (!Config.GOOGLE_API.KEY || Config.GOOGLE_API.KEY.length < 10) {
      throw new Error("API_KEY_MISSING");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 95000); // Erhöht auf 95s

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

      // Erweitertes Retry-Management für 503 (Server Overloaded)
      if (response.status === 503 && retryCount < 3) {
        const waitTime = (retryCount + 1) * 5000; // 5s, 10s, 15s
        if (global.log) global.log.warn(`API 503: Retry ${retryCount + 1} in ${waitTime}ms...`);
        await new Promise(res => setTimeout(res, waitTime));
        return this._executeAiRequest(prompt, inputData, retryCount + 1);
      }

      if (!response.ok) throw new Error(`SERVER_ERROR_${response.status}`);

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("INVALID_AI_RESPONSE");

      return JSON.parse(rawText.replace(/```json|```/g, '').trim());
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error("TIMEOUT: KI-Recherche dauerte zu lange (>95s).");
      throw error;
    }
  }

  async getMacroScore(inputData) {
    return this._executeAiRequest(MACRO_PROMPT, inputData);
  }

  /**
   * NEU: Echte Radar-Anbindung (To-Do #8)
   */
  async getRadarData() {
    // Hinweis: Hier wird ein spezialisierter Radar-Prompt erwartet.
    // Falls noch kein eigener Prompt-File existiert, nutzen wir einen optimierten Scan-Befehl.
    const RADAR_PROMPT = "SCAN_MARKET_FOR_GROWTH_LEADERS_V2: Return JSON with watchlist_results (ticker, score, core_reason_short, core_reason_long, zones).";
    return this._executeAiRequest(RADAR_PROMPT, { mode: 'autonomous_scan' });
  }

  async getStockDetails(ticker) {
    return { ticker, price: "0.00", logic_notes: ["V34.0 Live-Analyse aktiv."] };
  }
}
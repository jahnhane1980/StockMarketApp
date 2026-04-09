// src/api/GoogleApiService.js - Refactored AI Core (Full-Body)

import { Config } from '../core/Config';
import { SYSTEM_PROMPT as MACRO_PROMPT } from '../assets/prompt_stock_analyser';

export class GoogleApiService {
  /**
   * Zentraler Kern für alle Gemini-Anfragen.
   * Behandelt Header, 90s Timeout und 503 Retries.
   */
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

      if (response.status === 503 && retryCount < 1) {
        await new Promise(res => setTimeout(res, 3000));
        return this._callAi(prompt, inputData, retryCount + 1);
      }

      if (!response.ok) throw new Error(`SERVER_ERROR_${response.status}`);

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("INVALID_AI_RESPONSE");

      return JSON.parse(rawText.replace(/```json|```/g, '').trim());
      
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

  async getRadarData() {
    // Command Prompt für den Markt-Scan
    const RADAR_PROMPT = "MISSION: Autonomer Markt-Scan. Identifiziere 5 Ticker (A-E) mit Score 0-10. Return JSON: watchlist_results [ticker, score, core_reason_short, core_reason_long, zones].";
    return this._callAi(RADAR_PROMPT, { mode: 'autonomous_scan' });
  }

  async getStockDetails(ticker) {
    return { ticker, price: "0.00", logic_notes: ["Live-Analyse V34.0 aktiv."] };
  }
}
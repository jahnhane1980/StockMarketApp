// src/api/GoogleApiService.js - Timeout & Abort Logic (Full-Body)

import { Config } from '../core/Config';
import { SYSTEM_PROMPT } from '../assets/prompt_stock_analyser';

export class GoogleApiService {
  async getMacroScore(inputData, retryCount = 0) {
    if (!Config.GOOGLE_API.KEY || Config.GOOGLE_API.KEY.length < 10) {
      throw new Error("API_KEY_MISSING");
    }

    // Harter Timeout nach 90 Sekunden für komplexe V34-Recherchen
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      const payload = {
        contents: [{
          parts: [{ text: `${SYSTEM_PROMPT}\n\nINPUT_DATA: ${JSON.stringify(inputData)}` }]
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
        signal: controller.signal // Signal für den Abbruch
      });

      clearTimeout(timeoutId); // Timeout löschen, wenn Antwort kam

      if (response.status === 503 && retryCount < 1) {
        await new Promise(res => setTimeout(res, 3000));
        return this.getMacroScore(inputData, retryCount + 1);
      }

      if (!response.ok) throw new Error(`SERVER_ERROR_${response.status}`);

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("INVALID_AI_RESPONSE");

      return JSON.parse(rawText.replace(/```json|```/g, '').trim());
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error("TIMEOUT: KI-Recherche dauerte zu lange (>90s).");
      }
      throw error;
    }
  }

  async getStockDetails(ticker) {
    return { ticker, price: "0.00", logic_notes: ["V34.0 aktiv."] };
  }
}
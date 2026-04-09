// src/api/GoogleApiService.js - Echte API-Anbindung (Full-Body)

import { Config } from '../core/Config';
import { Asset } from 'expo-asset';

export class GoogleApiService {
  /**
   * Lädt den System-Prompt aus den lokalen Assets
   */
  async _fetchSystemPrompt() {
    try {
      const asset = Asset.fromModule(require('../assets/prompt_stock_analyser.md'));
      await asset.downloadAsync();
      
      const response = await fetch(asset.localUri || asset.uri);
      const content = await response.text();
      
      // Deine Debug-Logs (jetzt als Info für bessere Sichtbarkeit)
      if (global.log) {
        global.log.info("Prompt-Asset geladen:", asset.uri);
        global.log.info("Prompt-Inhalt (Teil):", content.substring(0, 50) + "...");
      }
      
      return content;
    } catch (error) {
      if (global.log) global.log.error("GoogleApiService: Prompt-Fehler", error.message);
      return "Analysiere das Portfolio und antworte im JSON-Format.";
    }
  }

  /**
   * Sendet die Daten an Gemini (Flash 1.5)
   */
  async getMacroScore(inputData) {
    if (!Config.GOOGLE_API.KEY || Config.GOOGLE_API.KEY.length < 5) {
      throw new Error("API_KEY_MISSING");
    }

    try {
      const systemPrompt = await this._fetchSystemPrompt();

      const payload = {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nINPUT_DATA: ${JSON.stringify(inputData)}`
          }]
        }],
        generationConfig: { response_mime_type: "application/json" }
      };

      const response = await fetch(`${Config.GOOGLE_API.URL}?key=${Config.GOOGLE_API.KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 403 || response.status === 401) throw new Error("PERMISSION_DENIED");
      if (!response.ok) throw new Error(`SERVER_ERROR_${response.status}`);

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) throw new Error("INVALID_AI_RESPONSE");
      return JSON.parse(rawText.replace(/```json|```/g, '').trim());
      
    } catch (error) {
      if (global.log) global.log.error("GoogleApiService: Fehler", error.message);
      throw error;
    }
  }

  async getStockDetails(ticker) {
    return { ticker, price: "0.00", logic_notes: ["Verwende Macro-Analyse."] };
  }
}
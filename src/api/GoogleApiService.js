// src/api/GoogleApiService.js - Real Gemini Integration (Full-Body Sync)

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
      
      if (global.log) {
        global.log.info("Prompt-Asset geladen:", asset.uri);
        global.log.info("Prompt-Inhalt (Vorschau):", content.substring(0, 40) + "...");
      }
      
      return content;
    } catch (error) {
      if (global.log) global.log.error("GoogleApiService: Prompt-Fehler", error.message);
      return "Analysiere das Portfolio und antworte strikt im JSON-Format.";
    }
  }

  /**
   * Sendet die Portfolio-Daten an Gemini (V1.5 Flash)
   */
  async getMacroScore(inputData) {
    if (!Config.GOOGLE_API.KEY || Config.GOOGLE_API.KEY.length < 5) {
      throw new Error("API_KEY_MISSING");
    }

    try {
      // 1. Lokalen Prompt laden
      const systemPrompt = await this._fetchSystemPrompt();

      // 2. Payload gemäß deinem Interface vorbereiten
      const payload = {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nINPUT_DATA: ${JSON.stringify(inputData)}`
          }]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      };

      // 3. API-Call an Google
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

      // Markdown-Bereinigung und Parsing
      return JSON.parse(rawText.replace(/```json|```/g, '').trim());
      
    } catch (error) {
      if (global.log) global.log.error("GoogleApiService: Fehler", error.message);
      throw error;
    }
  }

  async getStockDetails(ticker) {
    return { ticker, price: "0.00", logic_notes: ["Verwende Macro-Score Analyse."] };
  }
}
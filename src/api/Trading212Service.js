// src/api/Trading212Service.js - API Kommunikation mit JSON-Logging (Full-Body)

import { Config } from '../core/Config';
import * as FileSystem from 'expo-file-system/legacy'; // NEU: FileSystem importiert

export class Trading212Service {
  /**
   * Zentraler Wrapper für alle Trading212 API-Aufrufe
   */
  static async fetchFromAPI(endpoint, method = 'GET', body = null) {
    if (!Config.TRADING212_API.KEY) {
      throw new Error("TRADING212_API_KEY_MISSING");
    }

    const headers = {
      'Authorization': Config.TRADING212_API.KEY,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${Config.TRADING212_API.URL}${endpoint}`, options);

      if (!response.ok) {
        throw new Error(`T212_API_ERROR_${response.status}`);
      }

      const jsonResponse = await response.json();

      // NEU: Rohe API-Antwort lokal als JSON-Datei speichern
      try {
        // Wandelt "/equity/account/cash" in "equity_account_cash" um
        const safeName = endpoint.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+/, '');
        const filePath = `${FileSystem.documentDirectory}t212_${safeName}.json`;
        
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(jsonResponse, null, 2));
        if (global.log) global.log.info(`T212 Response gespeichert unter: t212_${safeName}.json`);
      } catch (fsError) {
        if (global.log) global.log.warn(`Konnte T212 JSON nicht speichern: ${fsError.message}`);
      }

      return jsonResponse;
    } catch (error) {
      if (global.log) global.log.error(`Trading212Service Error [${endpoint}]:`, error);
      throw error;
    }
  }

  static async getAccountCash() {
    return this.fetchFromAPI('/equity/account/cash', 'GET');
  }

  static async getPortfolio() {
    return this.fetchFromAPI('/equity/portfolio', 'GET');
  }
}
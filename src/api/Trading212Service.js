// src/api/Trading212Service.js - API Kommunikation mit Base64-Auth (Full-Body)

import { Config } from '../core/Config';
import * as FileSystem from 'expo-file-system/legacy';
import { HttpClient } from './HttpClient';

export class Trading212Service {
  /**
   * Hilfsmethode zur Base64-Kodierung für den Auth-Header.
   * In Expo/React Native nutzen wir das globale btoa oder einen Fallback.
   */
  static _encodeCredentials(key, secret) {
    const credentials = `${key}:${secret}`;
    try {
      // btoa ist in den meisten modernen JS-Umgebungen (auch Expo) verfügbar
      return btoa(credentials);
    } catch (e) {
      if (global.log) global.log.error("Trading212Service: Fehler bei der Base64-Kodierung");
      return "";
    }
  }

  /**
   * Zentraler Wrapper für alle Trading212 API-Aufrufe mit HttpClient
   */
  static async fetchFromAPI(endpoint, method = 'GET', body = null) {
    if (!Config.TRADING212_API.KEY || !Config.TRADING212_API.SECRET) {
      throw new Error("TRADING212_API_CREDENTIALS_MISSING");
    }

    // Erstellung des Basic Auth Headers gemäß Dokumentation
    const encodedAuth = this._encodeCredentials(
      Config.TRADING212_API.KEY, 
      Config.TRADING212_API.SECRET
    );

    const headers = {
      'Authorization': `Basic ${encodedAuth}`,
    };

    // Nur bei Schreibzugriffen Content-Type setzen
    if (method !== 'GET' && method !== 'HEAD') {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const url = `${Config.TRADING212_API.URL}${endpoint}`;
      
      if (global.log) global.log.info(`T212 Request: ${method} ${endpoint}`);

      // Nutzung des Smart Clients (inkl. Retries und Timeout-Handling)
      // Wir setzen hier ein explizites Timeout von 15s für T212
      const response = await HttpClient.request(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        timeout: 15000, 
        retries: 1
      });

      // Der HttpClient wirft bei !response.ok bereits einen Fehler, 
      // den wir hier ggf. noch spezifisch für T212 mappen könnten.
      const jsonResponse = await response.json();

      // Rohe API-Antwort lokal als JSON-Datei speichern für Debugging-Zwecke
      try {
        const safeName = endpoint.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+/, '');
        const filePath = `${FileSystem.documentDirectory}t212_${safeName}.json`;
        
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(jsonResponse, null, 2));
        if (global.log) global.log.info(`T212 Response gespeichert: t212_${safeName}.json`);
      } catch (fsError) {
        if (global.log) global.log.warn(`T212 JSON Logging fehlgeschlagen: ${fsError.message}`);
      }

      return jsonResponse;
    } catch (error) {
      // Mapping des HttpClient Fehlers auf T212 Format
      if (error.status) {
        throw new Error(`T212_API_ERROR_${error.status}`);
      }
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
// src/api/Trading212Service.js - API Kommunikation (Full-Body)

import { Config } from '../core/Config';

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

      return await response.json();
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
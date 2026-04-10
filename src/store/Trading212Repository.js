// src/store/Trading212Repository.js - Caching für T212 Live-Daten (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { Trading212Service } from '../api/Trading212Service';
import { T212_CACHE_DURATION } from '../core/Constants';
import { Config } from '../core/Config';

const CACHE_KEY = '@t212_portfolio_cache';

export class Trading212Repository {
  static async getPortfolioData(forceRefresh = false) {
    const storage = StorageServiceFactory.getService();

    try {
      // 1. Cache prüfen (falls kein Force Refresh)
      if (!forceRefresh) {
        const cached = await storage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          if (age < T212_CACHE_DURATION) {
            if (global.log) global.log.info(`T212Repository: Nutze Cache (Alter: ${Math.round(age/60000)} Min)`);
            return data;
          }
        }
      }

      // 2. Live-Abruf (Account & Portfolio)
      if (global.log) global.log.info("T212Repository: Starte Live-Abruf von Trading212...");
      
      const [cash, portfolio] = await Promise.all([
        Trading212Service.getAccountCash(),
        Trading212Service.getPortfolio()
      ]);

      const combinedData = { cash, portfolio };

      // 3. Speichern im Cache
      await storage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: combinedData
      }));

      return combinedData;
    } catch (error) {
      if (global.log) global.log.error("T212Repository Error:", error.message);
      throw error;
    }
  }

  static async clearCache() {
    const storage = StorageServiceFactory.getService();
    await storage.removeItem(CACHE_KEY);
    if (global.log) global.log.info("T212Repository: Cache manuell gelöscht.");
  }
}
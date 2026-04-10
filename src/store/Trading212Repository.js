// src/store/Trading212Repository.js - Fix: Error Handling & Test-Modus (Full-Body)

import { StorageServiceFactory, STORAGE_KEYS } from './StorageService';
import { Trading212Service } from '../api/Trading212Service';
import { T212_CACHE_DURATION } from '../core/Constants';
import { Config } from '../core/Config';

export class Trading212Repository {
  static async getPortfolioData(forceRefresh = false) {
    const storage = StorageServiceFactory.getService();
    const cacheKey = STORAGE_KEYS.t212Cache(); // NEU: Nutzung der zentralen Key-Registry

    try {
      if (Config.TEST) {
        if (global.log) global.log.info("T212Repository: Test-Modus aktiv, API übersprungen.");
        return { cash: null, portfolio: null };
      }

      if (!Config.TRADING212_API.KEY) {
        if (global.log) global.log.info("T212Repository: Kein API Key gefunden.");
        return null;
      }

      if (!forceRefresh) {
        const cached = await storage.getItem(cacheKey);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          if (age < T212_CACHE_DURATION) {
            if (global.log) global.log.info(`T212Repository: Nutze Cache (Alter: ${Math.round(age/60000)} Min)`);
            return data;
          }
        }
      }

      if (global.log) global.log.info("T212Repository: Starte Live-Abruf von Trading212...");
      
      const [cash, portfolio] = await Promise.all([
        Trading212Service.getAccountCash(),
        Trading212Service.getPortfolio()
      ]);

      const combinedData = { cash, portfolio };

      await storage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: combinedData
      }));

      return combinedData;
    } catch (error) {
      if (global.log) global.log.error("T212Repository Error:", error.message);
      return null;
    }
  }

  static async clearCache() {
    const storage = StorageServiceFactory.getService();
    const cacheKey = STORAGE_KEYS.t212Cache(); // NEU
    await storage.removeItem(cacheKey);
    if (global.log) global.log.info("T212Repository: Cache manuell gelöscht.");
  }
}
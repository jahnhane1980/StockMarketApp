// src/store/MacroRepository.js - V34 TTL Caching (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { DataServiceFactory } from '../api/DataService';
import { AssetRepository } from './AssetRepository';
import { FinancialRepository } from './FinancialRepository';
import { MACRO_CACHE_DURATION } from '../core/Constants';

const CACHE_KEY = '@macro_status_cache_v2';

export class MacroRepository {
  static async getStatus() {
    const storage = StorageServiceFactory.getService();
    const dataService = DataServiceFactory.getService();

    try {
      // 1. Lokalen Cache prüfen
      const cachedData = await storage.getItem(CACHE_KEY);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        const age = Date.now() - timestamp;

        if (age < MACRO_CACHE_DURATION) {
          if (global.log) global.log.info(`MacroRepository: Nutze Cache (Alter: ${Math.round(age/60000)} Min)`);
          return data;
        }
      }

      // 2. Daten für den V34 Request sammeln
      const [assets, fin] = await Promise.all([
        AssetRepository.getAll(),
        FinancialRepository.getData()
      ]);

      const inputData = {
        portfolio: {
          total_val: assets.reduce((sum, a) => sum + (AssetRepository.getPositionStats(a)?.EUR?.totalFiat || 0), 0) + fin.currentCash,
          cash: fin.currentCash
        },
        debt: {
          principal: fin.debtAmount,
          interest_rate_pa: fin.debtInterest,
          start_date: fin.debtStartDate || new Date().toISOString().split('T')[0]
        },
        tickers: assets.map(a => ({
          id: a.ticker,
          type: a.type || 'A',
          current_pos: AssetRepository.getPositionStats(a)?.EUR?.totalFiat || 0,
          funding_source: a.fundingSource || 'EQUITY',
          override_dark_pool_delta: a.override_dark_pool_delta || null
        }))
      };

      // 3. API Request
      const remoteData = await dataService.getMacroScore(inputData);
      
      if (remoteData && !remoteData.error) {
        await storage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: remoteData
        }));
        return remoteData;
      }
      throw new Error("KI lieferte keine validen Daten.");
    } catch (error) {
      if (global.log) global.log.error("MacroRepository Error:", error.message);
      const lastResort = await storage.getItem(CACHE_KEY);
      if (lastResort) {
        const { data } = JSON.parse(lastResort);
        return { ...data, error: `Netzwerkfehler: ${error.message}` };
      }
      return { error: error.message };
    }
  }

  static async clearCache() {
    const storage = StorageServiceFactory.getService();
    await storage.removeItem(CACHE_KEY);
    if (global.log) global.log.info("MacroRepository: Cache manuell gelöscht.");
  }
}
// src/store/MacroRepository.js - Dynamischer Cache Key + V34 Payload (Full-Body)

import { StorageServiceFactory, STORAGE_KEYS } from './StorageService';
import { DataServiceFactory } from '../api/DataService';
import { AssetRepository } from './AssetRepository';
import { FinancialRepository } from './FinancialRepository';
import { MACRO_CACHE_DURATION } from '../core/Constants';
import { Config } from '../core/Config';

export class MacroRepository {
  static async getStatus() {
    const storage = StorageServiceFactory.getService();
    const dataService = DataServiceFactory.getService();
    const currentKey = STORAGE_KEYS.macroCache(); // NEU: Nutzung der zentralen Key-Registry

    try {
      // 1. Lokalen Cache prüfen
      const cachedData = await storage.getItem(currentKey);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        const age = Date.now() - timestamp;

        if (age < MACRO_CACHE_DURATION) {
          if (global.log) global.log.info(`MacroRepository: Nutze Cache [${currentKey}] (Alter: ${Math.round(age/60000)} Min)`);
          return data;
        }
      }

      // 2. Daten für den V34 Request sammeln (Deine essenzielle Logik bleibt unangetastet!)
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

      // 3. API Request mit aggregierten Daten
      const remoteData = await dataService.getMacroScore(inputData);
      
      if (remoteData && !remoteData.error) {
        await storage.setItem(currentKey, JSON.stringify({
          timestamp: Date.now(),
          data: remoteData
        }));
        return remoteData;
      }
      throw new Error("KI lieferte keine validen Daten.");
    } catch (error) {
      if (global.log) global.log.error("MacroRepository Error:", error.message);
      // Fallback: Wenn API fehlschlägt, letzten Cache (Test oder Live) laden, auch wenn abgelaufen
      const lastResort = await storage.getItem(currentKey);
      if (lastResort) {
        const { data } = JSON.parse(lastResort);
        return { ...data, error: `Netzwerkfehler: ${error.message}` };
      }
      return { error: error.message };
    }
  }

  static async clearCache() {
    const storage = StorageServiceFactory.getService();
    const currentKey = STORAGE_KEYS.macroCache(); // NEU
    await storage.removeItem(currentKey);
    if (global.log) global.log.info(`MacroRepository: Cache manuell gelöscht [${currentKey}].`);
  }
}
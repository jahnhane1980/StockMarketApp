// src/store/MacroRepository.js - Data Aggregator (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { DataServiceFactory } from '../api/DataService';
import { AssetRepository } from './AssetRepository';
import { FinancialRepository } from './FinancialRepository';

const CACHE_KEY = '@macro_status_cache_v1';

export class MacroRepository {
  static async getStatus() {
    const storage = StorageServiceFactory.getService();
    const dataService = DataServiceFactory.getService();

    try {
      // 1. Daten für INPUT_DATA sammeln
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
          start_date: new Date().toISOString().split('T')[0]
        },
        tickers: assets.map(a => ({
          id: a.ticker,
          type: a.type || 'A',
          current_pos: AssetRepository.getPositionStats(a)?.EUR?.totalFiat || 0,
          funding_source: 'EQUITY'
        }))
      };

      // 2. API Call mit Daten ausführen
      const remoteData = await dataService.getMacroScore(inputData);
      
      if (remoteData) {
        await storage.setItem(CACHE_KEY, JSON.stringify(remoteData));
        if (global.log) global.log.info("MacroRepository: Daten empfangen und gecached.");
        return remoteData;
      }

      const cached = await storage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      if (global.log) global.log.error("MacroRepository: Fehler", error.message);
      // Wir geben das Error-Objekt für die UI zurück
      return { error: error.message };
    }
  }
}
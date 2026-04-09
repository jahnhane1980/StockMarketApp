// src/store/MacroRepository.js - Data Only (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { DataServiceFactory } from '../api/DataService';

const CACHE_KEY = '@macro_status_cache_v1';

export class MacroRepository {
  static getService() {
    return DataServiceFactory.getService();
  }

  static async getStatus() {
    const storage = StorageServiceFactory.getService();
    const dataService = this.getService();

    try {
      const cachedData = await storage.getItem(CACHE_KEY);
      let macroData = cachedData ? JSON.parse(cachedData) : null;

      const remoteData = await dataService.getMacroScore();
      
      if (remoteData && (!macroData || remoteData.timestamp !== macroData.timestamp)) {
        await storage.setItem(CACHE_KEY, JSON.stringify(remoteData));
        if (global.log) global.log.info("MacroRepository: Neue Daten empfangen.");
        return remoteData;
      }
      return macroData;
    } catch (error) {
      if (global.log) global.log.error("MacroRepository: Fehler", error);
      return null;
    }
  }
}
// src/store/MacroRepository.js - Logger Fix (Full-Body)

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
        // FIX: Zugriff über global.log
        if (global.log) global.log.info("MacroRepository: Neue Daten empfangen.");
        return remoteData;
      }
      return macroData;
    } catch (error) {
      // FIX: Zugriff über global.log
      if (global.log) global.log.error("MacroRepository: Fehler", error);
      return null;
    }
  }

  static getColorForScore(score, theme) {
    if (!score) return theme.colors.textSubtle;
    if (score >= 7.1) return theme.colors.success;
    if (score >= 3.6) return theme.colors.warning;
    return theme.colors.error;
  }
}
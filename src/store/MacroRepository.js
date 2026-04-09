// src/store/MacroRepository.js - Refactored for Semantic Theme (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { DataServiceFactory } from '../api/DataService';

const CACHE_KEY = '@macro_status_cache_v1';
const storage = StorageServiceFactory.getService();
const dataService = DataServiceFactory.getService();

export class MacroRepository {
  static async getStatus() {
    try {
      const cachedData = await storage.getItem(CACHE_KEY);
      let macroData = cachedData ? JSON.parse(cachedData) : null;

      const remoteData = await dataService.getMacroScore();
      
      if (remoteData && (!macroData || remoteData.timestamp !== macroData.timestamp)) {
        await storage.setItem(CACHE_KEY, JSON.stringify(remoteData));
        if (global.log) log.info("MacroRepository: Neue Daten empfangen.");
        return remoteData;
      }
      return macroData;
    } catch (error) {
      if (global.log) log.error("MacroRepository: Fehler", error);
      return null;
    }
  }

  /**
   * Nutzt die neuen semantischen Theme-Farben
   */
  static getColorForScore(score, theme) {
    if (!score) return theme.colors.textSubtle;
    
    // Mapping auf semantische Tokens
    if (score >= 7.1) return theme.colors.success;
    if (score >= 3.6) return theme.colors.warning;
    return theme.colors.error;
  }
}
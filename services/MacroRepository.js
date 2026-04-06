// services/MacroRepository.js - Spezialisiertes Repository für Markt-Status-Daten

import { StorageServiceFactory } from './StorageService';
import { DataServiceFactory } from './DataService';

const CACHE_KEY = '@macro_status_cache_v1';
const storage = StorageServiceFactory.getService();
const dataService = DataServiceFactory.getService();

export class MacroRepository {
  /**
   * Holt die aktuellen Macro-Daten. Versucht erst den Cache, dann Remote.
   */
  static async getStatus() {
    try {
      // 1. Cache laden für sofortige Anzeige
      const cachedData = await storage.getItem(CACHE_KEY);
      let macroData = cachedData ? JSON.parse(cachedData) : null;

      // 2. Remote Fetch via DataService
      const remoteData = await dataService.getMacroScore();
      
      // 3. Nur speichern und zurückgeben, wenn sich etwas geändert hat (Timestamp-Check)
      if (remoteData && (!macroData || remoteData.timestamp !== macroData.timestamp)) {
        await storage.setItem(CACHE_KEY, JSON.stringify(remoteData));
        if (global.log) log.info("MacroRepository: Neue Daten empfangen und gecached.");
        return remoteData;
      }

      return macroData;
    } catch (error) {
      if (global.log) log.error("MacroRepository: Fehler beim Abrufen des Status", error);
      return null;
    }
  }

  /**
   * Hilfsfunktion zur Farbberechnung basierend auf dem global_ui_score (1-10)
   */
  static getColorForScore(score, theme) {
    if (!score) return theme.colors.textSubtle;
    
    // Einfache Interpolation/Mapping
    if (score >= 7.1) return theme.colors.statusSuccess;
    if (score >= 3.6) return theme.colors.statusAlert;
    return theme.colors.statusCritical;
  }
}
// src/store/RadarRepository.js - Fix: Dynamischer Cache Key + Laufzeit-Storage (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { DataServiceFactory } from '../api/DataService';
import { Config } from '../core/Config';

// Dynamischer Cache-Key für den Radar
const getCacheKey = () => Config.TEST ? '@radar_cache_test_v1' : '@radar_cache_live_v1';
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 Stunden Cache

// FIX: Globaler storage-Aufruf entfernt, da Factory beim App-Start noch undefined sein kann.

export class RadarRepository {
  static async getData() {
    // FIX: Initialisierung sicher zur Laufzeit in der Methode
    const storage = StorageServiceFactory.getService();
    
    try {
      const currentKey = getCacheKey();
      const cached = await storage.getItem(currentKey);
      
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        
        if (age < CACHE_TTL) {
          return parsed.data;
        }
      }

      const apiService = DataServiceFactory.getService();
      const data = await apiService.getRadarData();
      
      await storage.setItem(currentKey, JSON.stringify({ timestamp: Date.now(), data }));
      return data;
      
    } catch (error) {
      if (global.log) global.log.error("RadarRepository Fehler", error);
      return null;
    }
  }

  static async clearCache() {
    // FIX: Initialisierung sicher zur Laufzeit
    const storage = StorageServiceFactory.getService();
    
    const currentKey = getCacheKey();
    await storage.removeItem(currentKey);
    if (global.log) global.log.info(`RadarRepository: Cache gelöscht [${currentKey}]`);
  }
}
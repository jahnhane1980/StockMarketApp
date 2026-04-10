// src/store/RadarRepository.js - Fix: Dynamischer Cache Key + Laufzeit-Storage (Full-Body)

import { StorageServiceFactory, STORAGE_KEYS } from './StorageService';
import { DataServiceFactory } from '../api/DataService';
import { Config } from '../core/Config';
import { RADAR_CACHE_DURATION } from '../core/Constants'; // NEU: Konstante importiert

export class RadarRepository {
  static async getData() {
    // FIX: Initialisierung sicher zur Laufzeit in der Methode
    const storage = StorageServiceFactory.getService();
    
    try {
      const currentKey = STORAGE_KEYS.radarCache();
      const cached = await storage.getItem(currentKey);
      
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        
        if (age < RADAR_CACHE_DURATION) { // NEU: Nutzung der zentralen Konstante
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
    
    const currentKey = STORAGE_KEYS.radarCache();
    await storage.removeItem(currentKey);
    if (global.log) global.log.info(`RadarRepository: Cache gelöscht [${currentKey}]`);
  }
}
// src/store/RadarRepository.js - Verwaltung der Radar-Daten

import { StorageServiceFactory } from './StorageService';
import { DataServiceFactory } from '../api/DataService';

const CACHE_KEY = '@radar_cache_v1';

export class RadarRepository {
  static async getData() {
    const storage = StorageServiceFactory.getService();
    const dataService = DataServiceFactory.getService();

    try {
      // 1. Cache prüfen
      const cached = await storage.getItem(CACHE_KEY);
      
      // 2. Frische Daten holen
      const remoteData = await dataService.getRadarData();
      
      if (remoteData) {
        await storage.setItem(CACHE_KEY, JSON.stringify(remoteData));
        return remoteData;
      }
      
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      if (global.log) global.log.error("RadarRepository: Fehler", error);
      return null;
    }
  }
}
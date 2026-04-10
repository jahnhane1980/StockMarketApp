// src/store/StorageService.js - Base Storage Adapter & Factory (Full-Body Sync)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../core/Config';

// NEU: Domain-Aware Key Registry (Zentrales Schlüssel-Management)
export const STORAGE_KEYS = {
  // --- PERSISTENTE CORE-DATEN (Echte User-Daten) ---
  asset: () => Config.TEST ? '@assets_v1_test' : '@assets_v1_live',
  assetArchive: () => Config.TEST ? '@assets_archived_v1_test' : '@assets_archived_v1_live',
  financial: () => Config.TEST ? '@financial_v1_test' : '@financial_v1_live',
  settings: () => '@settings_v1', // Umgebungsunabhängig

  // --- FLÜCHTIGE CACHES (API-Schutz & Temporäre Daten) ---
  macroCache: () => Config.TEST ? '@macro_status_cache_test_v2' : '@macro_status_cache_live_v2',
  radarCache: () => Config.TEST ? '@radar_cache_test_v1' : '@radar_cache_live_v1',
  t212Cache: () => '@t212_portfolio_cache', // T212 nutzt keine Test-Trennung
};

class AsyncStorageAdapter {
  async getItem(key) {
    return await AsyncStorage.getItem(key);
  }
  async setItem(key, value) {
    await AsyncStorage.setItem(key, value);
  }
  async removeItem(key) {
    await AsyncStorage.removeItem(key);
  }
}

class MockStorageAdapter {
  constructor() {
    this.storage = new Map();
  }
  async getItem(key) {
    return this.storage.get(key) || null;
  }
  async setItem(key, value) {
    this.storage.set(key, value);
  }
  async removeItem(key) {
    this.storage.delete(key);
  }
}

export class StorageServiceFactory {
  // NEU: Explizite statische Variable für saubere Referenz im RAM
  static mockInstance = null;

  static getService() {
    if (Config.TEST) {
      if (!StorageServiceFactory.mockInstance) {
        StorageServiceFactory.mockInstance = new MockStorageAdapter();
      }
      return StorageServiceFactory.mockInstance;
    }
    return new AsyncStorageAdapter();
  }

  static getPersistentService() {
    return new AsyncStorageAdapter();
  }
}
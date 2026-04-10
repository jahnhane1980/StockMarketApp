// src/store/SettingsRepository.js - Fix: Laufzeit-Initialisierung des Storage (Full-Body)

import { StorageServiceFactory } from './StorageService';

const STORAGE_KEY = '@settings_v1';

const DEFAULT_SETTINGS = {
  apiKey: '',
  t212Key: '', 
  t212Secret: '',
  theme: 'dark',
  testMode: true, 
};

export class SettingsRepository {
  static async getSettings() {
    // FIX: Initialisierung in die Methode verschoben, um 'undefined' beim Import zu verhindern
    const storage = StorageServiceFactory.getPersistentService();
    
    try {
      const data = await storage.getItem(STORAGE_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      if (global.log) global.log.error("SettingsRepository: Ladefehler", error);
      return DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings) {
    // FIX: Initialisierung in die Methode verschoben
    const storage = StorageServiceFactory.getPersistentService();
    
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await storage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      
      if (global.log) global.log.info("SettingsRepository: Einstellungen dauerhaft (persistent) gespeichert.");
      return newSettings;
    } catch (error) {
      if (global.log) global.log.error("SettingsRepository: Speicherfehler", error);
      throw error;
    }
  }
}
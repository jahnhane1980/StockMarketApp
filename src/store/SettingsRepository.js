// src/store/SettingsRepository.js - Logger Fix (Full-Body)

import { StorageServiceFactory } from './StorageService';

const STORAGE_KEY = '@settings_v1';
const storage = StorageServiceFactory.getService();

const DEFAULT_SETTINGS = {
  apiKey: '',
  theme: 'dark',
};

export class SettingsRepository {
  static async getSettings() {
    try {
      const data = await storage.getItem(STORAGE_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      if (global.log) global.log.error("SettingsRepository: Ladefehler", error);
      return DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings) {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await storage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      
      // FIX: Korrekter Zugriff auf global.log
      if (global.log) global.log.info("SettingsRepository: Einstellungen erfolgreich gespeichert.");
      return newSettings;
    } catch (error) {
      if (global.log) global.log.error("SettingsRepository: Speicherfehler", error);
      throw error;
    }
  }
}
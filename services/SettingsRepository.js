// services/SettingsRepository.js - Domain Repository für Settings

import { StorageServiceFactory } from './StorageService';

const STORAGE_KEY = '@settings_v1';
const storage = StorageServiceFactory.getService();

const DEFAULT_SETTINGS = {
  apiKey: '',
  theme: 'dark', // Dark Mode als Default
};

export class SettingsRepository {
  static async getSettings() {
    try {
      const data = await storage.getItem(STORAGE_KEY);
      // Mergen mit Defaults, falls Felder fehlen
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      if (global.log) log.error("Fehler beim Laden der Settings", error);
      return DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings) {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await storage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      if (global.log) log.info("Settings gespeichert (inkl. Theme).");
      return newSettings;
    } catch (error) {
      if (global.log) log.error("Fehler beim Speichern der Settings", error);
      throw error;
    }
  }
}
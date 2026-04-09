// src/store/SettingsRepository.js - Verwaltung der Benutzerpräferenzen (Full-Body)

import { StorageServiceFactory } from './StorageService';

const STORAGE_KEY = '@settings_v1';
const storage = StorageServiceFactory.getService();

const DEFAULT_SETTINGS = {
  apiKey: '',
  theme: 'dark', // Standardwert bei Erststart
};

export class SettingsRepository {
  /**
   * Lädt die gespeicherten Einstellungen oder liefert Defaults zurück.
   */
  static async getSettings() {
    try {
      const data = await storage.getItem(STORAGE_KEY);
      // Mergen mit Defaults, falls Felder (wie 'theme') fehlen
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      if (global.log) log.error("SettingsRepository: Ladefehler", error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Speichert neue Einstellungen dauerhaft ab.
   */
  static async saveSettings(settings) {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await storage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      if (global.log) log.info("SettingsRepository: Einstellungen erfolgreich gespeichert.");
      return newSettings;
    } catch (error) {
      if (global.log) log.error("SettingsRepository: Speicherfehler", error);
      throw error;
    }
  }
}
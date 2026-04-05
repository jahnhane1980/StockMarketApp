// services/AssetRepository.js - Domain Repository für Assets
import { StorageServiceFactory } from './StorageService';

const STORAGE_KEY = '@assets_v1';
const storage = StorageServiceFactory.getService();

export class AssetRepository {
  
  static async getAll() {
    try {
      const data = await storage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      if (global.log) log.error("Fehler beim Laden der Assets", error);
      return [];
    }
  }

  static async save(asset) {
    if (!asset || !asset.ticker) {
      throw new Error("Asset oder Ticker fehlt beim Speichern.");
    }

    try {
      const assets = await this.getAll();
      const existingIndex = assets.findIndex(a => a.ticker === asset.ticker);
      
      if (existingIndex >= 0) {
        // UPDATE (Upsert-Logik)
        assets[existingIndex] = { ...assets[existingIndex], ...asset };
        if (global.log) log.info(`Asset aktualisiert: ${asset.ticker}`);
      } else {
        // INSERT
        assets.push(asset);
        if (global.log) log.info(`Asset hinzugefügt: ${asset.ticker}`);
      }
      
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets; // Gibt die aktualisierte Liste zurück
    } catch (error) {
      if (global.log) log.error("Fehler beim Speichern des Assets", error);
      throw error;
    }
  }

  static async remove(ticker) {
    try {
      let assets = await this.getAll();
      assets = assets.filter(a => a.ticker !== ticker);
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      if (global.log) log.info(`Asset entfernt: ${ticker}`);
      return assets; // Gibt die aktualisierte Liste zurück
    } catch (error) {
      if (global.log) log.error("Fehler beim Löschen des Assets", error);
      throw error;
    }
  }
}
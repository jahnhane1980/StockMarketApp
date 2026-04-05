// services/AssetRepository.js - Domain Repository für Assets

import { StorageServiceFactory } from './StorageService';

const STORAGE_KEY = '@assets_v1';
const STORAGE_KEY_ARCHIVE = '@assets_archived_v1';

export class AssetRepository {
  
  static async getAll() {
    const storage = StorageServiceFactory.getService();
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

    const storage = StorageServiceFactory.getService();
    try {
      const assets = await this.getAll();
      const existingIndex = assets.findIndex(a => a.ticker === asset.ticker);
      
      if (existingIndex >= 0) {
        // UPDATE: Kopfdaten aktualisieren, Transaktionen behalten
        assets[existingIndex] = { 
          ...assets[existingIndex], 
          ...asset,
          transactions: assets[existingIndex].transactions || [] 
        };
        if (global.log) log.info(`Asset Kopf aktualisiert: ${asset.ticker}`);
      } else {
        // INSERT: Neues Asset mit leerem Tx-Array
        const newAsset = { ...asset, transactions: [] };
        assets.push(newAsset);
        if (global.log) log.info(`Asset hinzugefügt: ${asset.ticker}`);
      }
      
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets;
    } catch (error) {
      if (global.log) log.error("Fehler beim Speichern des Assets", error);
      throw error;
    }
  }

  static async addTransaction(ticker, transactionData) {
    const storage = StorageServiceFactory.getService();
    try {
      let assets = await this.getAll();
      const assetIndex = assets.findIndex(a => a.ticker === ticker);
      
      if (assetIndex === -1) throw new Error("Asset nicht gefunden.");

      const asset = assets[assetIndex];
      if (!asset.transactions) asset.transactions = [];

      const newTx = {
        ...transactionData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };

      asset.transactions.push(newTx);
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));

      // Auto-Archive Check: Bestand berechnen
      let totalShares = 0;
      asset.transactions.forEach(tx => {
        const shares = parseFloat(tx.totalFiat) / parseFloat(tx.pricePerUnit);
        if (tx.action === 'BUY') totalShares += shares;
        if (tx.action === 'SELL') totalShares -= shares;
      });

      if (asset.transactions.length > 0 && totalShares <= 0.00001) {
        if (global.log) log.info(`${ticker} Bestand ist 0. Archivierung läuft...`);
        return await this.archive(ticker);
      }

      return await this.getAll();
    } catch (error) {
      if (global.log) log.error("Fehler bei Transaktion", error);
      throw error;
    }
  }

  static async archive(ticker) {
    const storage = StorageServiceFactory.getService();
    try {
      let activeAssets = await this.getAll();
      const assetToArchive = activeAssets.find(a => a.ticker === ticker);
      if (!assetToArchive) return activeAssets;

      activeAssets = activeAssets.filter(a => a.ticker !== ticker);
      await storage.setItem(STORAGE_KEY, JSON.stringify(activeAssets));

      const archivedData = await storage.getItem(STORAGE_KEY_ARCHIVE);
      const archivedAssets = archivedData ? JSON.parse(archivedData) : [];
      
      assetToArchive.archivedAt = new Date().toISOString();
      archivedAssets.push(assetToArchive);
      await storage.setItem(STORAGE_KEY_ARCHIVE, JSON.stringify(archivedAssets));

      return activeAssets;
    } catch (error) {
      throw error;
    }
  }

  static async remove(ticker) {
    const storage = StorageServiceFactory.getService();
    try {
      let assets = await this.getAll();
      assets = assets.filter(a => a.ticker !== ticker);
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets;
    } catch (error) {
      throw error;
    }
  }
}
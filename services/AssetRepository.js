// services/AssetRepository.js - Domain Repository mit Konstanten

import { StorageServiceFactory } from './StorageService';
import { ACTIONS, ASSET_STATUS } from '../Constants';

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
    const storage = StorageServiceFactory.getService();
    try {
      const assets = await this.getAll();
      const existingIndex = assets.findIndex(a => a.ticker === asset.ticker);
      
      if (existingIndex >= 0) {
        assets[existingIndex] = { 
          ...assets[existingIndex], 
          ...asset,
          transactions: assets[existingIndex].transactions || [] 
        };
      } else {
        assets.push({ ...asset, transactions: [] });
      }
      
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets;
    } catch (error) {
      if (global.log) log.error("Save Fehler", error);
      throw error;
    }
  }

  static async addTransaction(ticker, transactionData) {
    const storage = StorageServiceFactory.getService();
    try {
      let assets = await this.getAll();
      const assetIndex = assets.findIndex(a => a.ticker === ticker);
      if (assetIndex === -1) return assets;

      const asset = assets[assetIndex];
      const newTx = {
        ...transactionData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };

      asset.transactions.push(newTx);
      
      // Auto-Archive Logik
      let totalShares = 0;
      asset.transactions.forEach(tx => {
        const shares = tx.totalFiat / tx.pricePerUnit;
        if (tx.action === ACTIONS.BUY) totalShares += shares;
        if (tx.action === ACTIONS.SELL) totalShares -= shares;
      });

      if (totalShares <= 0.00001) {
        return await this.archive(ticker);
      }

      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets;
    } catch (error) {
      throw error;
    }
  }

  static async archive(ticker) {
    const storage = StorageServiceFactory.getService();
    let active = await this.getAll();
    const toArchive = active.find(a => a.ticker === ticker);
    if (!toArchive) return active;

    active = active.filter(a => a.ticker !== ticker);
    await storage.setItem(STORAGE_KEY, JSON.stringify(active));

    const archivedRaw = await storage.getItem(STORAGE_KEY_ARCHIVE);
    const archived = archivedRaw ? JSON.parse(archivedRaw) : [];
    toArchive.archivedAt = new Date().toISOString();
    archived.push(toArchive);
    await storage.setItem(STORAGE_KEY_ARCHIVE, JSON.stringify(archived));

    return active;
  }

  static async remove(ticker) {
    const storage = StorageServiceFactory.getService();
    let assets = await this.getAll();
    assets = assets.filter(a => a.ticker !== ticker);
    await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
    return assets;
  }
}
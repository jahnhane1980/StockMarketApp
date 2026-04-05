// services/AssetRepository.js - Domain Repository mit Performance-Logik

import { StorageServiceFactory } from './StorageService';
import { ACTIONS } from '../Constants';

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

  // Hilfsmethode zur Berechnung der Bestände und Durchschnittspreise
  static getPositionStats(asset) {
    if (!asset.transactions || asset.transactions.length === 0) return null;

    const stats = {}; // Key: Währung (EUR/USD)

    asset.transactions.forEach(tx => {
      const curr = tx.currency;
      if (!stats[curr]) {
        stats[curr] = { totalShares: 0, totalFiat: 0, avgPrice: 0 };
      }

      const shares = tx.totalFiat / tx.pricePerUnit;

      if (tx.action === ACTIONS.BUY) {
        stats[curr].totalShares += shares;
        stats[curr].totalFiat += tx.totalFiat;
      } else if (tx.action === ACTIONS.SELL) {
        // Bei Verkauf reduziert sich der Bestand, aber die Cost-Basis (avgPrice) bleibt gleich
        const ratio = shares / stats[curr].totalShares;
        stats[curr].totalFiat -= (stats[curr].totalFiat * ratio);
        stats[curr].totalShares -= shares;
      }

      if (stats[curr].totalShares > 0) {
        stats[curr].avgPrice = stats[curr].totalFiat / stats[curr].totalShares;
      }
    });

    return stats;
  }

  static async addTransaction(ticker, transactionData) {
    const storage = StorageServiceFactory.getService();
    try {
      let assets = await this.getAll();
      const assetIndex = assets.findIndex(a => a.ticker === ticker);
      if (assetIndex === -1) return assets;

      const asset = assets[assetIndex];
      if (!asset.transactions) asset.transactions = [];

      const newTx = {
        ...transactionData,
        id: Date.now().toString(),
        // userTimestamp kommt aus dem Dialog (Format: DD.MM.YYYY HH:mm)
        recordedAt: new Date().toISOString() 
      };

      asset.transactions.push(newTx);

      // Prüfen, ob nach der Transaktion noch ein Bestand da ist
      const stats = this.getPositionStats(asset);
      let overallShares = 0;
      if (stats) {
        Object.values(stats).forEach(s => overallShares += s.totalShares);
      }

      if (asset.transactions.length > 0 && overallShares <= 0.00001) {
        return await this.archive(ticker);
      }

      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets;
    } catch (error) {
      if (global.log) log.error("Fehler bei Transaktion", error);
      throw error;
    }
  }

  static async save(asset) {
    const storage = StorageServiceFactory.getService();
    try {
      const assets = await this.getAll();
      const existingIndex = assets.findIndex(a => a.ticker === asset.ticker);
      if (existingIndex >= 0) {
        assets[existingIndex] = { ...assets[existingIndex], ...asset, transactions: assets[existingIndex].transactions || [] };
      } else {
        assets.push({ ...asset, transactions: [] });
      }
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets;
    } catch (error) { throw error; }
  }

  static async remove(ticker) {
    const storage = StorageServiceFactory.getService();
    let assets = await this.getAll();
    assets = assets.filter(a => a.ticker !== ticker);
    await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
    return assets;
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
}
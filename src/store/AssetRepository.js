// src/store/AssetRepository.js - Lazy Storage mit Seed-Logik (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { ACTIONS } from '../core/Constants';
import initialPortfolioMock from '../../mock/InitialPortfolio.json';

const STORAGE_KEY = '@assets_v1';
const STORAGE_KEY_ARCHIVE = '@assets_archived_v1';

export class AssetRepository {
  static async getAll() {
    const storage = StorageServiceFactory.getService();
    try {
      const data = await storage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      } else {
        // NEU: Seeding beim allerersten Start
        await storage.setItem(STORAGE_KEY, JSON.stringify(initialPortfolioMock));
        if (global.log) global.log.info("AssetRepository: Initiales Portfolio (Seed) geladen.");
        return initialPortfolioMock;
      }
    } catch (error) { 
      return []; 
    }
  }

  static getPositionStats(asset) {
    if (!asset || !asset.transactions || asset.transactions.length === 0) return null;
    const stats = {};
    asset.transactions.forEach(tx => {
      const curr = tx.currency;
      if (!stats[curr]) stats[curr] = { totalShares: 0, totalFiat: 0, avgPrice: 0 };
      const shares = parseFloat(tx.totalFiat) / parseFloat(tx.pricePerUnit);
      if (tx.action === ACTIONS.BUY) {
        stats[curr].totalShares += shares;
        stats[curr].totalFiat += parseFloat(tx.totalFiat);
      } else if (tx.action === ACTIONS.SELL) {
        const ratio = shares / stats[curr].totalShares;
        stats[curr].totalFiat -= (stats[curr].totalFiat * ratio);
        stats[curr].totalShares -= shares;
      }
      stats[curr].avgPrice = stats[curr].totalShares > 0 ? stats[curr].totalFiat / stats[curr].totalShares : 0;
    });
    return stats;
  }

  static async addTransaction(ticker, transactionData) {
    const storage = StorageServiceFactory.getService();
    let assets = await this.getAll();
    const assetIndex = assets.findIndex(a => a.ticker === ticker);
    if (assetIndex === -1) return assets;
    
    const asset = assets[assetIndex];
    if (!asset.transactions) asset.transactions = [];
    asset.transactions.push({ ...transactionData, id: Date.now().toString(), recordedAt: new Date().toISOString() });
    
    await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
    return assets;
  }

  static async save(asset) {
    const storage = StorageServiceFactory.getService();
    const assets = await this.getAll();
    const existingIndex = assets.findIndex(a => a.ticker === asset.ticker);
    if (existingIndex >= 0) {
      assets[existingIndex] = { ...assets[existingIndex], ...asset, transactions: assets[existingIndex].transactions || [] };
    } else {
      assets.push({ ...asset, transactions: [] });
    }
    await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
    return assets;
  }

  static async remove(ticker) {
    const storage = StorageServiceFactory.getService();
    let assets = await this.getAll();
    assets = assets.filter(a => a.ticker !== ticker);
    await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
    return assets;
  }

  static async getArchived() {
    const storage = StorageServiceFactory.getService();
    const data = await storage.getItem(STORAGE_KEY_ARCHIVE);
    return data ? JSON.parse(data) : [];
  }
}
// src/store/AssetRepository.js - Sandbox vs. Live Storage Integration (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { ACTIONS } from '../core/Constants';
import { Config } from '../core/Config';
import initialPortfolioMock from '../../mock/InitialPortfolio.json';

// NEU: Dynamische Storage Keys
const getStorageKey = () => Config.TEST ? '@assets_v1_test' : '@assets_v1_live';
const getArchiveKey = () => Config.TEST ? '@assets_archived_v1_test' : '@assets_archived_v1_live';

export class AssetRepository {
  static async getAll() {
    const storage = StorageServiceFactory.getService();
    const currentKey = getStorageKey();
    try {
      const data = await storage.getItem(currentKey);
      if (data) {
        return JSON.parse(data);
      } else if (Config.TEST) {
        await storage.setItem(currentKey, JSON.stringify(initialPortfolioMock));
        if (global.log) global.log.info(`AssetRepository: Seed geladen in [${currentKey}]`);
        return initialPortfolioMock;
      } else {
        return [];
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
    const currentKey = getStorageKey();
    let assets = await this.getAll();
    const assetIndex = assets.findIndex(a => a.ticker === ticker);
    if (assetIndex === -1) return assets;
    
    const asset = assets[assetIndex];
    if (!asset.transactions) asset.transactions = [];
    asset.transactions.push({ ...transactionData, id: Date.now().toString(), recordedAt: new Date().toISOString() });
    
    await storage.setItem(currentKey, JSON.stringify(assets));
    return assets;
  }

  static async save(asset) {
    const storage = StorageServiceFactory.getService();
    const currentKey = getStorageKey();
    const assets = await this.getAll();
    const existingIndex = assets.findIndex(a => a.ticker === asset.ticker);
    if (existingIndex >= 0) {
      assets[existingIndex] = { ...assets[existingIndex], ...asset, transactions: assets[existingIndex].transactions || [] };
    } else {
      assets.push({ ...asset, transactions: [] });
    }
    await storage.setItem(currentKey, JSON.stringify(assets));
    return assets;
  }

  static async remove(ticker) {
    const storage = StorageServiceFactory.getService();
    const currentKey = getStorageKey();
    let assets = await this.getAll();
    assets = assets.filter(a => a.ticker !== ticker);
    await storage.setItem(currentKey, JSON.stringify(assets));
    return assets;
  }

  static async getArchived() {
    const storage = StorageServiceFactory.getService();
    const currentArchiveKey = getArchiveKey();
    const data = await storage.getItem(currentArchiveKey);
    return data ? JSON.parse(data) : [];
  }
}
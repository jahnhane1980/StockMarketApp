// src/store/AssetRepository.js - Sandbox vs. Live Storage Integration (Full-Body)

import { StorageServiceFactory, STORAGE_KEYS } from './StorageService';
import { ACTIONS } from '../core/Constants';
import { Config } from '../core/Config';
import initialPortfolioMock from '../../mock/InitialPortfolio.json';

export class AssetRepository {
  static async getAll() {
    const storage = StorageServiceFactory.getService();
    const currentKey = STORAGE_KEYS.asset(); // NEU: Zentrale Key-Registry
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
    const currentKey = STORAGE_KEYS.asset(); // NEU
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
    const currentKey = STORAGE_KEYS.asset(); // NEU
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
    const currentKey = STORAGE_KEYS.asset(); // NEU
    let assets = await this.getAll();
    assets = assets.filter(a => a.ticker !== ticker);
    await storage.setItem(currentKey, JSON.stringify(assets));
    return assets;
  }

  static async getArchived() {
    // FIX: Try-Catch Block hinzugefügt, damit defekte Archive oder fehlende Daten die App nicht crashen
    try {
      const storage = StorageServiceFactory.getService();
      const currentArchiveKey = STORAGE_KEYS.assetArchive(); // NEU
      const data = await storage.getItem(currentArchiveKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      if (global.log) global.log.error("AssetRepository: Fehler beim Laden des Archivs", error);
      return [];
    }
  }
}
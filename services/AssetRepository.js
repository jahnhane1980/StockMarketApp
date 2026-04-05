// services/AssetRepository.js - Domain Repository mit Full-Logic & Logging

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
      if (global.log) log.error("AssetRepository: Fehler beim Laden der Assets", error);
      return [];
    }
  }

  /**
   * Berechnet Statistiken (Bestand, Durchschnittspreis) getrennt nach Währung.
   * Wichtig für die korrekte Anzeige der Cost-Basis (Durchschnittskaufpreis).
   */
  static getPositionStats(asset) {
    if (!asset || !asset.transactions || asset.transactions.length === 0) {
      return null;
    }

    const stats = {}; // Struktur: { 'EUR': { totalShares, totalFiat, avgPrice }, 'USD': { ... } }

    asset.transactions.forEach(tx => {
      const curr = tx.currency;
      if (!stats[curr]) {
        stats[curr] = { totalShares: 0, totalFiat: 0, avgPrice: 0 };
      }

      // Berechnung der Stücke (Fiat / Preis pro Stück)
      const shares = parseFloat(tx.totalFiat) / parseFloat(tx.pricePerUnit);

      if (tx.action === ACTIONS.BUY) {
        stats[curr].totalShares += shares;
        stats[curr].totalFiat += parseFloat(tx.totalFiat);
      } else if (tx.action === ACTIONS.SELL) {
        // Bei Verkauf reduzieren wir den Fiat-Wert proportional zum Bestand
        const ratio = shares / stats[curr].totalShares;
        stats[curr].totalFiat -= (stats[curr].totalFiat * ratio);
        stats[curr].totalShares -= shares;
      }

      // Durchschnittspreis aktualisieren (Gewichteter Durchschnitt)
      if (stats[curr].totalShares > 0) {
        stats[curr].avgPrice = stats[curr].totalFiat / stats[curr].totalShares;
      } else {
        stats[curr].avgPrice = 0;
      }
    });

    return stats;
  }

  /**
   * Fügt eine neue Transaktion hinzu und prüft auf Auto-Archivierung.
   */
  static async addTransaction(ticker, transactionData) {
    const storage = StorageServiceFactory.getService();
    try {
      let assets = await this.getAll();
      const assetIndex = assets.findIndex(a => a.ticker === ticker);
      
      if (assetIndex === -1) {
        if (global.log) log.warn(`AssetRepository: Ticker ${ticker} nicht gefunden für Transaktion.`);
        return assets;
      }

      const asset = assets[assetIndex];
      if (!asset.transactions) {
        asset.transactions = [];
      }

      // Transaktion mit System-Metadaten anreichern
      const newTx = {
        ...transactionData,
        id: Date.now().toString(),
        recordedAt: new Date().toISOString() // System-Zeitpunkt der Erfassung
      };

      asset.transactions.push(newTx);
      if (global.log) log.info(`AssetRepository: Transaktion (${newTx.action}) für ${ticker} hinzugefügt.`);

      // Bestand prüfen für Auto-Archive
      const stats = this.getPositionStats(asset);
      let overallShares = 0;
      if (stats) {
        Object.values(stats).forEach(s => {
          overallShares += s.totalShares;
        });
      }

      // Float-Ungenauigkeiten abfangen (Bestand quasi Null)
      if (asset.transactions.length > 0 && overallShares <= 0.00001) {
        if (global.log) log.info(`AssetRepository: Bestand von ${ticker} ist 0. Starte Archivierung.`);
        return await this.archive(ticker); 
      }

      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets;
    } catch (error) {
      if (global.log) log.error(`AssetRepository: Fehler bei addTransaction für ${ticker}`, error);
      throw error;
    }
  }

  static async getArchived() {
    const storage = StorageServiceFactory.getService();
    try {
      const data = await storage.getItem(STORAGE_KEY_ARCHIVE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      if (global.log) log.error("AssetRepository: Fehler beim Laden des Archivs", error);
      return [];
    }
  }

  static async save(asset) {
    const storage = StorageServiceFactory.getService();
    try {
      const assets = await this.getAll();
      const existingIndex = assets.findIndex(a => a.ticker === asset.ticker);
      
      if (existingIndex >= 0) {
        // Kopfdaten (Status, Typ) aktualisieren, aber Transaktionen erhalten
        assets[existingIndex] = { 
          ...assets[existingIndex], 
          ...asset,
          transactions: assets[existingIndex].transactions || [] 
        };
        if (global.log) log.info(`AssetRepository: Kopfdaten für ${asset.ticker} aktualisiert.`);
      } else {
        // Neues Asset mit initialem leeren Transaktions-Array
        assets.push({ ...asset, transactions: [] });
        if (global.log) log.info(`AssetRepository: Neues Asset ${asset.ticker} angelegt.`);
      }
      
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return assets;
    } catch (error) {
      if (global.log) log.error("AssetRepository: Fehler beim Speichern des Assets", error);
      throw error;
    }
  }

  static async remove(ticker) {
    const storage = StorageServiceFactory.getService();
    try {
      let assets = await this.getAll();
      assets = assets.filter(a => a.ticker !== ticker);
      await storage.setItem(STORAGE_KEY, JSON.stringify(assets));
      if (global.log) log.info(`AssetRepository: ${ticker} dauerhaft gelöscht.`);
      return assets;
    } catch (error) {
      if (global.log) log.error(`AssetRepository: Fehler beim Löschen von ${ticker}`, error);
      throw error;
    }
  }

  static async archive(ticker) {
    const storage = StorageServiceFactory.getService();
    try {
      let activeAssets = await this.getAll();
      const assetToArchive = activeAssets.find(a => a.ticker === ticker);
      
      if (!assetToArchive) {
        return activeAssets;
      }

      // 1. Aus aktiver Liste entfernen
      activeAssets = activeAssets.filter(a => a.ticker !== ticker);
      await storage.setItem(STORAGE_KEY, JSON.stringify(activeAssets));

      // 2. In Archiv-Liste einfügen (mit Archivierungs-Datum)
      const archivedAssets = await this.getArchived();
      assetToArchive.archivedAt = new Date().toISOString();
      archivedAssets.push(assetToArchive);
      await storage.setItem(STORAGE_KEY_ARCHIVE, JSON.stringify(archivedAssets));

      if (global.log) log.info(`AssetRepository: ${ticker} erfolgreich ins Archiv verschoben.`);
      return activeAssets;
    } catch (error) {
      if (global.log) log.error(`AssetRepository: Fehler beim Archivieren von ${ticker}`, error);
      throw error;
    }
  }
}
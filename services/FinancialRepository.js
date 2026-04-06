// services/FinancialRepository.js - Verwaltung von Cash und Zinsen

import { StorageServiceFactory } from './StorageService';

const STORAGE_KEY = '@financial_v1';
const storage = StorageServiceFactory.getService();

const DEFAULT_DATA = {
  currentCash: 0,
  cashInterest: 0,
  debtAmount: 0,
  debtInterest: 0,
};

export class FinancialRepository {
  static async getData() {
    try {
      const data = await storage.getItem(STORAGE_KEY);
      return data ? { ...DEFAULT_DATA, ...JSON.parse(data) } : DEFAULT_DATA;
    } catch (error) {
      if (global.log) log.error("FinancialRepository: Fehler beim Laden", error);
      return DEFAULT_DATA;
    }
  }

  static async saveData(newData) {
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(newData));
      if (global.log) log.info("FinancialRepository: Daten erfolgreich gespeichert.");
      return newData;
    } catch (error) {
      if (global.log) log.error("FinancialRepository: Fehler beim Speichern", error);
      throw error;
    }
  }
}
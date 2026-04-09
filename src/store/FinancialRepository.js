// src/store/FinancialRepository.js - Refactored Structure (Full-Body)

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
    } catch (error) { return DEFAULT_DATA; }
  }

  static async saveData(newData) {
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    } catch (error) { throw error; }
  }
}
// src/store/FinancialRepository.js - Sandbox vs. Live Storage Integration (Full-Body)

import { StorageServiceFactory } from './StorageService';
import { Config } from '../core/Config';

// NEU: Dynamischer Storage Key
const getStorageKey = () => Config.TEST ? '@financial_v1_test' : '@financial_v1_live';
const storage = StorageServiceFactory.getService();

const LIVE_DEFAULT = {
  currentCash: 0,
  cashInterest: 0,
  debtAmount: 0,
  debtInterest: 0,
};

const TEST_DEFAULT = {
  currentCash: 12500,
  cashInterest: 3.5,
  debtAmount: 0,
  debtInterest: 0,
};

export class FinancialRepository {
  static async getData() {
    const currentKey = getStorageKey();
    const defaults = Config.TEST ? TEST_DEFAULT : LIVE_DEFAULT;
    
    try {
      const data = await storage.getItem(currentKey);
      return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    } catch (error) { 
      return defaults; 
    }
  }

  static async saveData(newData) {
    const currentKey = getStorageKey();
    try {
      await storage.setItem(currentKey, JSON.stringify(newData));
      return newData;
    } catch (error) { 
      throw error; 
    }
  }
}
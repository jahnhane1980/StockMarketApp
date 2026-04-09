// src/store/StorageService.js - Base Storage Adapter & Factory (Full-Body Sync)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../core/Config'; // Korrigierter Pfad

class AsyncStorageAdapter {
  async getItem(key) {
    return await AsyncStorage.getItem(key);
  }
  async setItem(key, value) {
    await AsyncStorage.setItem(key, value);
  }
  async removeItem(key) {
    await AsyncStorage.removeItem(key);
  }
}

class MockStorageAdapter {
  constructor() {
    this.storage = new Map();
  }
  async getItem(key) {
    return this.storage.get(key) || null;
  }
  async setItem(key, value) {
    this.storage.set(key, value);
  }
  async removeItem(key) {
    this.storage.delete(key);
  }
}

export class StorageServiceFactory {
  static getService() {
    if (Config.TEST) {
      if (!this.mockInstance) {
        this.mockInstance = new MockStorageAdapter();
      }
      return this.mockInstance;
    }
    return new AsyncStorageAdapter();
  }
}
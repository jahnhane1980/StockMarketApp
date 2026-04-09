// src/api/DataService.js - Vermittler für Datenquellen (Full-Body)

import { Config } from '../core/Config';
import { MockDataService } from './MockDataService';
import { GoogleApiService } from './GoogleApiService';

export class DataServiceFactory {
  static getService() {
    // Entscheidung basierend auf dem Config-Flag
    if (Config.TEST) {
      return new MockDataService();
    }
    return new GoogleApiService(); 
  }
}
// services/DataService.js
import { Config } from '../Config';
import { MockDataService } from './MockDataService';
import { GoogleApiService } from './GoogleApiService'; // Später für Echtbetrieb

export class DataServiceFactory {
  static getService() {
    if (Config.TEST) {
      return new MockDataService();
    }
    // return new GoogleApiService(); // Fallback für Echtbetrieb
    return new GoogleApiService(); 
  }
}
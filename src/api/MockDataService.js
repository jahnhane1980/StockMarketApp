// src/api/MockDataService.js - Integration JSON Mocks (Full-Body)

import macroMock from '../../mock/GoogleApiResponse.json';
import radarMock from '../../mock/StockRadarResponse.json';

export class MockDataService {
  async getStockDetails(ticker) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ticker: ticker,
      final_score: "4.5",
      action: "HOLD",
      price: "177.56",
      logic_notes: ["Simulierter Wert", "RSI im neutralen Bereich"]
    };
  }

  async getMacroScore() {
    await new Promise(resolve => setTimeout(resolve, 800)); // Ladezeit simulieren
    return macroMock;
  }

  async getRadarData() {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Ladezeit simulieren
    return radarMock;
  }
}
// services/MockDataService.js

export class MockDataService {
  // Liefert Details für die aufklappbare Ansicht
  async getStockDetails(ticker) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simuliert Ladezeit
    //    { "id": "TICKER_ID", "final_score": 0.0, "action": "SNIPER_BUY_DARK / HOLD", "logic_notes": ["DETAILS"] }
    return {
      ticker: ticker,
      final_score: "4.5",
      action: "HOLD",
      price: "177.56",
      logic_notes: [
        "NOTE 1T",
        "NOTE 2",
        "Note 3"
      ]
    };
  }

  // Neu: Liefert den globalen Markt-Status (Macro Score)
  async getMacroScore() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Gibt einen Score zwischen 0 und 100 zurück
    // 0-30: Kritisch (Rot), 31-70: Warnung (Orange), 71-100: Gut (Grün)
    return {
      score: 45,
      status: "warning",
      lastUpdate: new Date().toISOString()
    };
  }
}
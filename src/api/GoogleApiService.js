// src/api/MockDataService.js - Simulationsdaten für Entwicklung (Full-Body)

export class MockDataService {
  async getStockDetails(ticker) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ticker: ticker,
      final_score: "4.5",
      action: "HOLD",
      price: "177.56",
      logic_notes: ["NOTE 1T", "NOTE 2", "Note 3"]
    };
  }

  /**
   * Liefert die komplette Makro-Struktur passend zur UI-Darstellung
   */
  async getMacroScore() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      "timestamp": new Date().toISOString(),
      "action_summary": {
        "total_cash_to_deploy": "80000.00",
        "global_ui_score": 7.5,
        "urgency": "HIGH (T1/T2 Strikes aktiv)"
      },
      "master_switch": {
        "status": "LONG",
        "mode": "DEBT_ARCHITECT_V32_ACTIVE"
      },
      "cycling_navigator": {
        "current_phase": "ACCUMULATION",
        "recommendation": "ROTATE_TO_GOLD_AND_VALUE",
        "logic": "VIX bei 23.87, moderater Makro-Stress. Gold-Stress-Veto inaktiv."
      },
      "metrics_validation": {
        "macro": {
          "vix_state": "23.87",
          "real_yield": "1.9%",
          "gold_stress": "INACTIVE"
        }
      }
    };
  }
}
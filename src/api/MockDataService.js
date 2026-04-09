// src/api/MockDataService.js - Simulationsdaten basierend auf GoogleApiResponse.json (Full-Body)

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

  /**
   * Liefert die vollständige Struktur aus der GoogleApiResponse.json
   */
  async getMacroScore() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      "timestamp": new Date().toISOString(),
      "action_summary": {
        "total_cash_to_deploy": "80000.00",
        "debt_repayment_required": "0.00",
        "net_liquidity_change": "-6500.00",
        "global_ui_score": 7.5,
        "urgency": "HIGH (T1/T2 Strikes aktiv)"
      },
      "debt_metrics": {
        "accrued_interest": "0.00",
        "principal_safety_status": "SECURE"
      },
      "master_switch": {
        "status": "LONG",
        "mode": "DEBT_ARCHITECT_V32_ACTIVE"
      },
      "cycling_navigator": {
        "current_phase": "ACCUMULATION",
        "recommendation": "ROTATE_TO_GOLD_AND_VALUE",
        "logic": "VIX bei 23.87, moderater Makro-Stress (Global UI 7.5). Gold-Stress-Veto inaktiv."
      },
      "metrics_validation": {
        "macro": {
          "vix_state": "23.87",
          "real_yield": "1.9%",
          "gold_stress": "INACTIVE"
        },
        "ticker_data": {
          "NVDA": { "rsi_2": 24.5, "dist_to_sma": "+5.2%" },
          "PLTR": { "rsi_2": 8.0, "dist_to_sma": "-12.0%" }
        }
      },
      "tickers": [
        {
          "id": "NVDA",
          "action": "STRIKE_T2",
          "ui_score": 3.5,
          "execution": { "buy_amount": "2000.00", "funding_source": "EQUITY" },
          "logic_notes": ["Typ B: Preis < BB_3SD."]
        }
      ]
    };
  }
}
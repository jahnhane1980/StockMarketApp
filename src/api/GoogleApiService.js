// src/api/GoogleApiService.js - Schnittstelle zur Gemini API (Full-Body Fix)

/**
 * Diese Klasse ist die Schnittstelle zur echten Gemini API von Google.
 * Sie wird von der DataServiceFactory instantiiert, wenn Config.TEST = false ist.
 */
export class GoogleApiService {
  /**
   * Liefert Details für die aufklappbare Ansicht eines Tickers.
   * Platzhalter für die spätere Gemini-Prompt-Logik.
   */
  async getStockDetails(ticker) {
    // TODO: Implementierung der Gemini API Aufrufe
    return {
      ticker: ticker,
      price: "0.00",
      logic_notes: ["Warten auf API Integration..."]
    };
  }

  /**
   * Liefert den globalen Markt-Status (Macro Score).
   * Platzhalter für die Marktanalyse-Logik.
   */
  async getMacroScore() {
    // TODO: Implementierung der globalen Marktanalyse via Gemini
    return 4.5; 
  }
}
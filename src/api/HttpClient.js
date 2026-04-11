// src/api/HttpClient.js - Zentraler Netzwerk-Client (Full-Body)

import LogService from './LogService';
import { HTTP_DEFAULT_TIMEOUT } from '../core/Constants';

// Interne Konstanten für bessere Lesbarkeit und Vermeidung von Magic Numbers
const HTTP_STATUS = {
  TOO_MANY_REQUESTS: 429,
  SERVICE_UNAVAILABLE: 503
};

export class HttpClient {
  static RETRY_DELAY_MS = 2000; // 2 Sekunden Basis-Delay für Retries

  /**
   * Zentrale Request-Methode mit integriertem Timeout und Retry-Logik.
   */
  static async request(url, options = {}) {
    // Extrahiere Custom-Options, setze Fallback auf Konstante, der Rest geht an fetch()
    const { timeout = HTTP_DEFAULT_TIMEOUT, retries = 0, ...fetchOptions } = options;
    
    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        });
        
        clearTimeout(id);
        
        // NEU: Fehlerbehandlung zentralisiert
        if (!response.ok) {
          // Retry-Logik für Rate Limits oder temporäre Server-Ausfälle
          if ([HTTP_STATUS.TOO_MANY_REQUESTS, HTTP_STATUS.SERVICE_UNAVAILABLE].includes(response.status) && attempt < retries) {
            if (global.log) global.log.warn(`HttpClient: ${response.status} für ${url}. Retry ${attempt + 1}/${retries}...`);
            // Exponentielles Backoff unter Nutzung der Konstante
            await new Promise(res => setTimeout(res, HttpClient.RETRY_DELAY_MS * (attempt + 1))); 
            continue;
          }
          
          // Wenn es kein Retry-Kandidat ist oder die Retries aufgebraucht sind, werfe definierten Fehler
          const httpError = new Error(`HTTP_ERROR_${response.status}`);
          httpError.status = response.status;
          throw httpError;
        }

        return response; 
      } catch (error) {
        clearTimeout(id);
        lastError = error;
        
        // Nur bei Timeout (AbortError) oder echten Verbindungsproblemen neu versuchen
        if (error.name === 'AbortError' || error.message.includes('Network')) {
           if (attempt < retries) {
              if (global.log) global.log.warn(`HttpClient: Timeout/Netzwerkfehler für ${url}. Retry ${attempt + 1}/${retries}...`);
              await new Promise(res => setTimeout(res, HttpClient.RETRY_DELAY_MS));
              continue;
           }
        } else {
           // Bei grundlegenden Fehlern (z.B. Syntax oder der oben geworfene httpError) nicht retrien
           break;
        }
      }
    }
    
    if (global.log) global.log.error(`HttpClient: Request failed nach ${retries} Retries: ${url}`, lastError);
    throw lastError;
  }

  /**
   * Helper für GET Requests
   */
  static async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  /**
   * Helper für POST Requests. Setzt automatisch JSON-Header.
   */
  static async post(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: JSON.stringify(body)
    });
  }
}
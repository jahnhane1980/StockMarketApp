// src/core/TransactionTransformer.js - Safe Date Formatting (Full-Body)

import { InputUtils } from './InputUtils';

// NEU: Robustes Array für React Native, um Abstürze durch fehlende Intl-API zu verhindern
const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

export const TransactionTransformer = {
  /**
   * Wandelt Rohdaten aus Repositories in gruppierte Sektionen für die UI um.
   */
  getGroupedHistory: (activeAssets, archivedAssets, filterTerm = '') => {
    let allTx = [];

    // 1. Abflachen der Transaktionen (mit Sicherheitsprüfung || [])
    [...(activeAssets || []), ...(archivedAssets || [])].forEach(asset => {
      if (asset && asset.transactions) {
        asset.transactions.forEach(tx => {
          allTx.push({ ...tx, ticker: asset.ticker });
        });
      }
    });

    // 2. Filtern
    if (filterTerm) {
      allTx = allTx.filter(tx => InputUtils.matchesSearchFilter(tx.ticker, filterTerm));
    }

    // 3. Sortieren (Neueste zuerst)
    allTx.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

    // 4. Gruppieren nach Monat/Jahr (SAFE FIX für React Native)
    const groups = {};
    allTx.forEach(tx => {
      const date = new Date(tx.recordedAt);
      const monthName = MONTH_NAMES[date.getMonth()]; // Sicherer Fallback
      const key = `${monthName} ${date.getFullYear()}`;
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });

    // 5. Umwandlung in SectionList-Format
    return Object.keys(groups).map(key => ({ 
      title: key, 
      data: groups[key] 
    }));
  }
};
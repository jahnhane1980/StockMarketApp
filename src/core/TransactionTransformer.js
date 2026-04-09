// src/core/TransactionTransformer.js - Daten-Pipeline für Transaktionen

import { InputUtils } from './InputUtils';

export const TransactionTransformer = {
  /**
   * Wandelt Rohdaten aus Repositories in gruppierte Sektionen für die UI um.
   */
  getGroupedHistory: (activeAssets, archivedAssets, filterTerm = '') => {
    let allTx = [];

    // 1. Abflachen der Transaktionen aus allen Asset-Quellen
    [...activeAssets, ...archivedAssets].forEach(asset => {
      if (asset.transactions) {
        asset.transactions.forEach(tx => {
          allTx.push({ ...tx, ticker: asset.ticker });
        });
      }
    });

    // 2. Filtern (nutzt unsere neue Utility)
    if (filterTerm) {
      allTx = allTx.filter(tx => InputUtils.matchesSearchFilter(tx.ticker, filterTerm));
    }

    // 3. Sortieren (Neueste zuerst)
    allTx.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

    // 4. Gruppieren nach Monat/Jahr
    const groups = {};
    allTx.forEach(tx => {
      const date = new Date(tx.recordedAt);
      const key = `${date.toLocaleString('de-DE', { month: 'long' })} ${date.getFullYear()}`;
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
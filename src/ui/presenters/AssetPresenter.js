// src/ui/presenters/AssetPresenter.js - Erweiterte visuelle Logik

import { ACTIONS } from '../../core/Constants';

export const AssetPresenter = {
  /**
   * Visuelle Logik für StockItems
   */
  getAssetViewModel: (asset, theme) => {
    const isCritical = asset.type === 'D';
    const isWarning = asset.type === 'C';
    
    let statusColor = theme.colors.primary;
    let iconName = null;

    if (isCritical) {
      statusColor = theme.colors.error;
      iconName = "close-circle-outline";
    } else if (isWarning) {
      statusColor = theme.colors.warning;
      iconName = "warning-outline";
    }

    return {
      ticker: asset.ticker,
      tickerColor: isCritical ? theme.colors.error : (isWarning ? theme.colors.warning : theme.colors.text),
      statusColor: statusColor,
      statusIcon: iconName,
      showStatusIcon: !!iconName,
    };
  },

  /**
   * Visuelle Logik für den Markt-Indikator (Toolbar)
   */
  getMarketViewModel: (score, theme) => {
    if (score === undefined || score === null) {
      return { color: theme.colors.textSubtle, label: 'Unbekannt' };
    }
    const isBullish = score >= 7.1;
    const isNeutral = score >= 3.6;

    return {
      color: isBullish ? theme.colors.success : (isNeutral ? theme.colors.warning : theme.colors.error),
      label: isBullish ? 'Bullish' : (isNeutral ? 'Neutral' : 'Bearish')
    };
  },

  /**
   * NEU: Visuelle Logik für die detaillierte Makro-Ansicht
   */
  getMacroDetailsViewModel: (data, theme) => {
    if (!data) return null;

    return {
      scoreColor: data.action_summary?.global_ui_score >= 7.1 ? theme.colors.success : theme.colors.warning,
      urgencyColor: theme.colors.warning, // Standardmäßig Orange für Dringlichkeit
      goldStressColor: data.metrics_validation?.macro?.gold_stress === 'INACTIVE' ? theme.colors.success : theme.colors.error,
      phaseLabel: `${data.cycling_navigator?.current_phase || '---'} ➔ ${data.cycling_navigator?.recommendation || '---'}`
    };
  },

  /**
   * NEU: Visuelle Logik für Transaktionen in der Historie
   */
  getTransactionViewModel: (action, theme) => {
    return {
      actionColor: action === ACTIONS.BUY ? theme.colors.primary : theme.colors.error
    };
  }
};
// src/ui/presenters/AssetPresenter.js - No Strings, Only Constants (Full-Body)

import { ACTIONS, MARKET_THRESHOLDS, MARKET_STATUS, METRIC_STATES } from '../../core/Constants';

export const AssetPresenter = {
  /**
   * Zentrale Score-Auswertung
   */
  getMarketStatus: (score) => {
    if (score === undefined || score === null) return MARKET_STATUS.UNKNOWN;
    if (score >= MARKET_THRESHOLDS.BULLISH) return MARKET_STATUS.BULLISH;
    if (score >= MARKET_THRESHOLDS.NEUTRAL) return MARKET_STATUS.NEUTRAL;
    return MARKET_STATUS.BEARISH;
  },

  /**
   * Visuelle Logik für den Markt-Indikator (Toolbar)
   */
  getMarketViewModel: (score, theme) => {
    const status = AssetPresenter.getMarketStatus(score);
    
    const config = {
      [MARKET_STATUS.BULLISH]: { color: theme.colors.success, label: 'Bullish' },
      [MARKET_STATUS.NEUTRAL]: { color: theme.colors.warning, label: 'Neutral' },
      [MARKET_STATUS.BEARISH]: { color: theme.colors.error, label: 'Bearish' },
      [MARKET_STATUS.UNKNOWN]: { color: theme.colors.textSubtle, label: 'Unbekannt' }
    };

    return config[status];
  },

  /**
   * Visuelle Logik für die detaillierte Makro-Ansicht
   */
  getMacroDetailsViewModel: (data, theme) => {
    if (!data) return null;
    const status = AssetPresenter.getMarketStatus(data.action_summary?.global_ui_score);

    return {
      scoreColor: status === MARKET_STATUS.BULLISH ? theme.colors.success : theme.colors.warning,
      urgencyColor: theme.colors.warning, 
      goldStressColor: data.metrics_validation?.macro?.gold_stress === METRIC_STATES.INACTIVE 
        ? theme.colors.success 
        : theme.colors.error,
      phaseLabel: `${data.cycling_navigator?.current_phase || '---'} ➔ ${data.cycling_navigator?.recommendation || '---'}`
    };
  },

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
   * Strategy-Pattern für Transaktionen (Kauf vs. Verkauf)
   */
  getTransactionStrategy: (action, theme) => {
    const isBuy = action === ACTIONS.BUY;
    return {
      themeColor: isBuy ? theme.colors.primary : theme.colors.error,
      buttonType: isBuy ? 'primary' : 'critical',
      buttonTitle: isBuy ? 'Kauf speichern' : 'Verkauf speichern',
      headerSuffix: isBuy ? 'Kauf' : 'Verkauf',
      showFunding: isBuy
    };
  },

  /**
   * Visuelle Logik für Finanz-Daten (Cash/Debt)
   */
  getFinancialViewModel: (finData, theme) => {
    return {
      debtColor: finData.debtAmount > 0 ? theme.colors.error : theme.colors.text,
      cashColor: theme.colors.text
    };
  }
};
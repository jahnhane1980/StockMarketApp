// src/ui/hooks/usePortfolioManager.js - Full-Body Integration - Refactoring Step 4 (Final)

// Import der spezialisierten Domänen-Hooks
import { useUiState } from './useUiState';
import { useCoreData } from './useCoreData';
import { useMarketIntelligence } from './useMarketIntelligence';
import { useSystemSetup } from './useSystemSetup';

export const usePortfolioManager = () => {
  const { 
    dialogs, activeTicker, editingAsset, toggleDialog, setEditingAsset 
  } = useUiState();

  const {
    assets, settings, finData, t212Data,
    hydrateCoreData, refreshAssets, 
    handleSaveAsset: coreSaveAsset, 
    handleSaveTransaction: coreSaveTransaction, 
    handleUpdateFinance: coreUpdateFinance, 
    handleUpdateSettings: coreUpdateSettings, 
    handleT212Refresh: coreT212Refresh
  } = useCoreData();

  const {
    isLoading, setIsLoading, macroData, radarData, loadInitialData
  } = useMarketIntelligence(hydrateCoreData);

  const { 
    fontsLoaded, handleSendLogs 
  } = useSystemSetup(loadInitialData);

  // --- Orchestrierungs-Methoden (Verbinden Data-Logic mit UI-Logic) ---

  const handleT212Refresh = async () => {
    try {
      setIsLoading(true);
      await coreT212Refresh();
      if (global.log) global.log.info("T212 Daten erfolgreich aktualisiert.");
    } catch (e) {
      if (global.log) global.log.error("T212 Refresh fehlgeschlagen", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceRefresh = () => toggleDialog('confirmRefresh', true);
  
  const executeForceRefresh = () => { 
    toggleDialog('confirmRefresh', false); 
    loadInitialData(true); 
  };
  
  const handleSaveAsset = async (asset) => {
    await coreSaveAsset(asset);
    toggleDialog('addAsset', false);
  };

  const handleSaveTransaction = async (ticker, data) => {
    await coreSaveTransaction(ticker, data);
    toggleDialog('transaction', false);
  };

  const handleUpdateFinance = async (newData) => {
    await coreUpdateFinance(newData);
    toggleDialog('finance', false);
  };

  const handleUpdateSettings = async (newSet) => {
    const modeChanged = await coreUpdateSettings(newSet);
    toggleDialog('settings', false);
    
    // Bei Modus-Wechsel (Test <-> Live) Daten neu laden
    if (modeChanged) loadInitialData(false); 
  };

  return {
    state: { 
      dialogs, activeTicker, editingAsset, fontsLoaded, 
      assets, settings, macroData, finData, radarData, 
      t212Data, isLoading 
    },
    actions: { 
      toggleDialog, setEditingAsset, handleSaveAsset, 
      handleSaveTransaction, handleUpdateFinance, 
      handleUpdateSettings, handleForceRefresh, 
      executeForceRefresh, refreshAssets,
      handleSendLogs, handleT212Refresh 
    }
  };
};
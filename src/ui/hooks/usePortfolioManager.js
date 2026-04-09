// src/ui/hooks/usePortfolioManager.js - Auto-Reload bei Moduswechsel (Full-Body)

import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AssetRepository } from '../../store/AssetRepository';
import { SettingsRepository } from '../../store/SettingsRepository';
import { MacroRepository } from '../../store/MacroRepository';
import { FinancialRepository } from '../../store/FinancialRepository';
import { RadarRepository } from '../../store/RadarRepository'; 
import { Config } from '../../core/Config';

export const usePortfolioManager = () => {
  const [dialogs, setDialogs] = useState({
    settings: false, addAsset: false, transaction: false,
    history: false, macro: false, finance: false, radar: false,
    confirmRefresh: false
  });

  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', theme: 'dark', testMode: true });
  const [macroData, setMacroData] = useState(null);
  const [finData, setFinData] = useState({ currentCash: 0, debtAmount: 0 });
  const [radarData, setRadarData] = useState(null); 

  const toggleDialog = (key, visible, data = null) => {
    setDialogs(prev => ({ ...prev, [key]: visible }));
    if (!visible) {
      if (key === 'addAsset') setEditingAsset(null);
      return;
    }
    if (key === 'transaction' || key === 'radar') setActiveTicker(data);
    if (key === 'addAsset' && data) setEditingAsset(data);
  };

  const loadInitialData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      
      if (forceRefresh) {
        // FIX: Saubere Clear-Aufrufe statt hart codierter Storage-Keys
        await MacroRepository.clearCache();
        await RadarRepository.clearCache();
      }

      const loadedSettings = await SettingsRepository.getSettings();
      Config.GOOGLE_API.KEY = loadedSettings.apiKey;
      Config.TEST = loadedSettings.testMode;

      const [loadedAssets, status, finance, radar] = await Promise.all([
        AssetRepository.getAll(),
        MacroRepository.getStatus(),
        FinancialRepository.getData(),
        RadarRepository.getData()
      ]);

      setAssets(loadedAssets);
      setSettings(loadedSettings);
      setMacroData(status);
      setFinData(finance);
      setRadarData(radar);
    } catch (e) {
      if (global.log) global.log.error("usePortfolioManager: Ladefehler", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      await Font.loadAsync(Ionicons.font);
      setFontsLoaded(true);
      await loadInitialData();
    }
    init();
  }, []);

  const handleForceRefresh = () => {
    toggleDialog('confirmRefresh', true);
  };

  const executeForceRefresh = () => {
    toggleDialog('confirmRefresh', false);
    loadInitialData(true);
  };

  const refreshAssets = async () => {
    const data = await AssetRepository.getAll();
    setAssets([...data]);
  };

  const handleSaveAsset = async (asset) => {
    await AssetRepository.save(asset);
    await refreshAssets();
    toggleDialog('addAsset', false);
  };

  const handleSaveTransaction = async (ticker, data) => {
    await AssetRepository.addTransaction(ticker, data);
    await refreshAssets();
    toggleDialog('transaction', false);
  };

  const handleUpdateFinance = async (newData) => {
    await FinancialRepository.saveData(newData);
    setFinData(newData);
    toggleDialog('finance', false);
  };

  const handleUpdateSettings = async (newSet) => {
    // NEU: Prüfen, ob der Schalter umgelegt wurde
    const modeChanged = settings.testMode !== newSet.testMode;
    
    await SettingsRepository.saveSettings(newSet);
    Config.GOOGLE_API.KEY = newSet.apiKey;
    Config.TEST = newSet.testMode;
    
    setSettings(newSet);
    toggleDialog('settings', false);

    // NEU: Wenn Modus gewechselt, sofortiges Neuladen aus der neuen Storage-Schublade
    if (modeChanged) {
      if (global.log) global.log.info("System-Modus gewechselt. Lade Arbeitsbereich neu...");
      loadInitialData(false); // false, damit wir den Cache der neuen Seite nicht sofort löschen
    }
  };

  return {
    state: { dialogs, activeTicker, editingAsset, fontsLoaded, assets, settings, macroData, finData, radarData, isLoading },
    actions: { 
      toggleDialog, setEditingAsset, handleSaveAsset, 
      handleSaveTransaction, handleUpdateFinance, 
      handleUpdateSettings, handleForceRefresh, executeForceRefresh, refreshAssets 
    }
  };
};
// src/ui/hooks/usePortfolioManager.js - Full-Body Integration (Macro, Radar, T212)

import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AssetRepository } from '../../store/AssetRepository';
import { SettingsRepository } from '../../store/SettingsRepository';
import { MacroRepository } from '../../store/MacroRepository';
import { FinancialRepository } from '../../store/FinancialRepository';
import { RadarRepository } from '../../store/RadarRepository'; 
import { Trading212Repository } from '../../store/Trading212Repository'; 
import { LogService } from '../../api/LogService';
import { Config } from '../../core/Config';

export const usePortfolioManager = () => {
  const [dialogs, setDialogs] = useState({
    settings: false, 
    addAsset: false, 
    transaction: false,
    history: false, 
    macro: false, 
    finance: false, 
    radar: false,
    confirmRefresh: false
  });

  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', t212Key: '', t212Secret: '', theme: 'dark', testMode: true });
  const [macroData, setMacroData] = useState(null);
  const [finData, setFinData] = useState({ currentCash: 0, debtAmount: 0 });
  const [radarData, setRadarData] = useState(null); 
  const [t212Data, setT212Data] = useState(null); 

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
        await MacroRepository.clearCache();
        await RadarRepository.clearCache();
        await Trading212Repository.clearCache();
      }
      
      const loadedSettings = await SettingsRepository.getSettings();
      
      // Globaler Config Sync (Wichtig für API-Calls)
      Config.GOOGLE_API.KEY = loadedSettings.apiKey;
      Config.TEST = loadedSettings.testMode;
      Config.TRADING212_API.KEY = loadedSettings.t212Key || "";
      Config.TRADING212_API.SECRET = loadedSettings.t212Secret || "";

      const [loadedAssets, status, finance, radar, t212] = await Promise.all([
        AssetRepository.getAll(),
        MacroRepository.getStatus(),
        FinancialRepository.getData(),
        RadarRepository.getData(),
        Trading212Repository.getPortfolioData(forceRefresh)
      ]);

      setAssets(loadedAssets);
      setSettings(loadedSettings);
      setMacroData(status);
      setFinData(finance);
      setRadarData(radar);
      setT212Data(t212);
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

  const handleSendLogs = async () => {
    await LogService.sendCurrentLog();
  };

  const handleT212Refresh = async () => {
    try {
      setIsLoading(true);
      const data = await Trading212Repository.getPortfolioData(true);
      setT212Data(data);
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
  
  const refreshAssets = async () => { 
    const data = await AssetRepository.getAll(); 
    setAssets([...data]); 
  };

  const handleSaveAsset = async (asset) => {
    await AssetRepository.save(asset);
    await MacroRepository.clearCache();
    await refreshAssets();
    toggleDialog('addAsset', false);
  };

  const handleSaveTransaction = async (ticker, data) => {
    await AssetRepository.addTransaction(ticker, data);
    await MacroRepository.clearCache();
    await refreshAssets();
    toggleDialog('transaction', false);
  };

  const handleUpdateFinance = async (newData) => {
    await FinancialRepository.saveData(newData);
    await MacroRepository.clearCache();
    setFinData(newData);
    toggleDialog('finance', false);
  };

  const handleUpdateSettings = async (newSet) => {
    const modeChanged = settings.testMode !== newSet.testMode;
    await SettingsRepository.saveSettings(newSet);
    
    // Sofortiger Sync der neuen Werte in die Config
    Config.GOOGLE_API.KEY = newSet.apiKey;
    Config.TEST = newSet.testMode;
    Config.TRADING212_API.KEY = newSet.t212Key;
    Config.TRADING212_API.SECRET = newSet.t212Secret;
    
    setSettings(newSet);
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
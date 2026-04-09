// src/ui/hooks/usePortfolioManager.js - Full Logic & TTL Support (Full-Body)

import { useState, useEffect, useCallback } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Config } from '../../core/Config';
import { AssetRepository } from '../../store/AssetRepository';
import { SettingsRepository } from '../../store/SettingsRepository';
import { MacroRepository } from '../../store/MacroRepository';
import { FinancialRepository } from '../../store/FinancialRepository';
import { RadarRepository } from '../../store/RadarRepository'; 

export const usePortfolioManager = () => {
  const [dialogs, setDialogs] = useState({
    settings: false, addAsset: false, transaction: false, history: false, macro: false, finance: false, radar: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', theme: 'dark' });
  const [macroData, setMacroData] = useState(null);
  const [finData, setFinData] = useState({ currentCash: 0, debtAmount: 0 });
  const [radarData, setRadarData] = useState(null); 

  const refreshMacro = useCallback(async () => {
    if (!Config.GOOGLE_API.KEY) return;
    setIsLoading(true);
    try {
      const status = await MacroRepository.getStatus();
      setMacroData(status);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleForceRefresh = async () => {
    await MacroRepository.clearCache();
    await refreshMacro();
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        await Font.loadAsync(Ionicons.font);
        setFontsLoaded(true);
        
        // 1. Zuerst Settings für API-Key laden
        const loadedSettings = await SettingsRepository.getSettings();
        setSettings(loadedSettings);
        Config.GOOGLE_API.KEY = loadedSettings.apiKey;

        // 2. Dann lokale Daten parallel laden
        const [loadedAssets, finance, radar] = await Promise.all([
          AssetRepository.getAll(),
          FinancialRepository.getData(),
          RadarRepository.getData()
        ]);

        setAssets(loadedAssets);
        setFinData(finance);
        setRadarData(radar);

        // 3. Makro-Analyse erst jetzt (mit Key) starten
        if (Config.GOOGLE_API.KEY) {
          await refreshMacro();
        }
      } catch (e) {
        if (global.log) global.log.error("usePortfolioManager: Initialisierungsfehler", e);
      }
    }
    loadInitialData();
  }, [refreshMacro]);

  const toggleDialog = (key, visible, data = null) => {
    setDialogs(prev => ({ ...prev, [key]: visible }));
    if (!visible) {
      if (key === 'addAsset') setEditingAsset(null);
      return;
    }
    if (key === 'transaction' || key === 'radar') setActiveTicker(data);
    if (key === 'addAsset' && data) setEditingAsset(data);
  };

  const refreshAssets = async () => {
    const data = await AssetRepository.getAll();
    setAssets([...data]);
  };

  const handleSaveAsset = async (asset) => {
    try {
      await AssetRepository.save(asset);
      await refreshAssets();
      toggleDialog('addAsset', false);
      await refreshMacro();
    } catch (e) { if (global.log) global.log.error("Fehler", e); }
  };

  const handleSaveTransaction = async (ticker, data) => {
    try {
      await AssetRepository.addTransaction(ticker, data);
      await refreshAssets();
      toggleDialog('transaction', false);
      await refreshMacro();
    } catch (e) { if (global.log) global.log.error("Fehler", e); }
  };

  const handleUpdateFinance = async (newData) => {
    try {
      await FinancialRepository.saveData(newData);
      setFinData(newData);
      toggleDialog('finance', false);
      await refreshMacro();
    } catch (e) { if (global.log) global.log.error("Fehler", e); }
  };

  const handleUpdateSettings = async (newSet) => {
    try {
      await SettingsRepository.saveSettings(newSet);
      setSettings(newSet);
      Config.GOOGLE_API.KEY = newSet.apiKey;
      toggleDialog('settings', false);
      if (newSet.apiKey) await refreshMacro();
    } catch (e) { if (global.log) global.log.error("Settings Fehler", e); }
  };

  return {
    state: { dialogs, activeTicker, editingAsset, fontsLoaded, assets, settings, macroData, finData, radarData, isLoading },
    actions: { 
      toggleDialog, setEditingAsset, handleSaveAsset, handleSaveTransaction, 
      handleUpdateFinance, handleUpdateSettings, refreshAssets, refreshMacro, handleForceRefresh 
    }
  };
};
// src/ui/hooks/usePortfolioManager.js - Jump-to-Ticker Support (Full-Body)

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AssetRepository } from '../../store/AssetRepository';
import { SettingsRepository } from '../../store/SettingsRepository';
import { MacroRepository } from '../../store/MacroRepository';
import { FinancialRepository } from '../../store/FinancialRepository';
import { RadarRepository } from '../../store/RadarRepository'; 
import { StorageServiceFactory } from '../../store/StorageService';

export const usePortfolioManager = () => {
  const [dialogs, setDialogs] = useState({
    settings: false,
    addAsset: false,
    transaction: false,
    history: false,
    macro: false,
    finance: false,
    radar: false,
  });

  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Neu: Ladezustand für API
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', theme: 'dark' });
  const [macroData, setMacroData] = useState(null);
  const [finData, setFinData] = useState({ currentCash: 0, debtAmount: 0 });
  const [radarData, setRadarData] = useState(null); 

  const toggleDialog = (key, visible, data = null) => {
    setDialogs(prev => ({ ...prev, [key]: visible }));
    if (!visible) {
      if (key === 'addAsset') setEditingAsset(null);
      return;
    }
    if (key === 'transaction' || key === 'radar') {
      setActiveTicker(data);
    }
    if (key === 'addAsset' && data) {
      setEditingAsset(data);
    }
  };

  const loadInitialData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      if (forceRefresh) {
        const storage = StorageServiceFactory.getService();
        await storage.removeItem('@macro_status_cache_v1');
      }

      const [loadedAssets, loadedSettings, status, finance, radar] = await Promise.all([
        AssetRepository.getAll(),
        SettingsRepository.getSettings(),
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
    Alert.alert(
      "Analyse erzwingen",
      "Möchtest du den Cache löschen und eine frische KI-Marktanalyse starten?",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Starten", onPress: () => loadInitialData(true) }
      ]
    );
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
    } catch (e) {
      if (global.log) global.log.error("usePortfolioManager: Fehler beim Speichern", e);
    }
  };

  const handleSaveTransaction = async (ticker, data) => {
    try {
      await AssetRepository.addTransaction(ticker, data);
      await refreshAssets();
      toggleDialog('transaction', false);
    } catch (e) {
      if (global.log) global.log.error("usePortfolioManager: Fehler bei Transaktion", e);
    }
  };

  const handleUpdateFinance = async (newData) => {
    try {
      await FinancialRepository.saveData(newData);
      setFinData(newData);
      toggleDialog('finance', false);
    } catch (e) {
      if (global.log) global.log.error("usePortfolioManager: Fehler bei Finanzen", e);
    }
  };

  const handleUpdateSettings = async (newSet) => {
    try {
      await SettingsRepository.saveSettings(newSet);
      setSettings(newSet);
      toggleDialog('settings', false);
    } catch (e) {
      if (global.log) global.log.error("usePortfolioManager: Fehler bei Settings", e);
    }
  };

  return {
    state: { dialogs, activeTicker, editingAsset, fontsLoaded, assets, settings, macroData, finData, radarData, isLoading },
    actions: { 
      toggleDialog, 
      setEditingAsset, 
      handleSaveAsset, 
      handleSaveTransaction, 
      handleUpdateFinance, 
      handleUpdateSettings,
      handleForceRefresh, // Fix für den Absturz
      refreshAssets 
    }
  };
};
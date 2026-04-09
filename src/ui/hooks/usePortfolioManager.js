// src/ui/hooks/usePortfolioManager.js - State Management & API Bridge (Full-Body)

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
    settings: false, addAsset: false, transaction: false,
    history: false, macro: false, finance: false, radar: false,
  });

  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    if (key === 'transaction' || key === 'radar') setActiveTicker(data);
    if (key === 'addAsset' && data) setEditingAsset(data);
  };

  const loadInitialData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      if (forceRefresh) {
        const storage = StorageServiceFactory.getService();
        await storage.removeItem('@macro_status_cache_v1');
        await storage.removeItem('@radar_cache_v1');
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
      "KI-Analyse erzwingen",
      "Möchtest du die Marktdaten live neu abfragen?",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Analysieren", onPress: () => loadInitialData(true) }
      ]
    );
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
    await SettingsRepository.saveSettings(newSet);
    setSettings(newSet);
    toggleDialog('settings', false);
  };

  return {
    state: { dialogs, activeTicker, editingAsset, fontsLoaded, assets, settings, macroData, finData, radarData, isLoading },
    actions: { 
      toggleDialog, setEditingAsset, handleSaveAsset, 
      handleSaveTransaction, handleUpdateFinance, 
      handleUpdateSettings, handleForceRefresh, refreshAssets 
    }
  };
};
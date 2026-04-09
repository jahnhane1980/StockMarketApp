// hooks/usePortfolioManager.js - Zentrales Management der Portfolio-Logik

import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AssetRepository } from '../services/AssetRepository';
import { SettingsRepository } from '../services/SettingsRepository';
import { MacroRepository } from '../services/MacroRepository';
import { FinancialRepository } from '../services/FinancialRepository';

export const usePortfolioManager = () => {
  // --- UI-States (Dialoge) ---
  const [dialogs, setDialogs] = useState({
    settings: false,
    addAsset: false,
    transaction: false,
    history: false,
    macro: false,
    finance: false,
  });

  // --- Daten-States ---
  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', theme: 'dark' });
  const [macroData, setMacroData] = useState(null);
  const [finData, setFinData] = useState({ currentCash: 0, debtAmount: 0 });

  // Hilfsfunktion zum Umschalten der Dialoge
  const toggleDialog = (key, visible, data = null) => {
    setDialogs(prev => ({ ...prev, [key]: visible }));
    if (key === 'addAsset' && !visible) setEditingAsset(null);
    if (key === 'transaction' && visible) setActiveTicker(data);
  };

  // --- Initiales Laden ---
  useEffect(() => {
    async function loadInitialData() {
      try {
        await Font.loadAsync(Ionicons.font);
        setFontsLoaded(true);
        
        const [loadedAssets, loadedSettings, status, finance] = await Promise.all([
          AssetRepository.getAll(),
          SettingsRepository.getSettings(),
          MacroRepository.getStatus(),
          FinancialRepository.getData()
        ]);

        setAssets(loadedAssets);
        setSettings(loadedSettings);
        setMacroData(status);
        setFinData(finance);
      } catch (e) {
        if (global.log) log.error("usePortfolioManager: Init Fehler", e);
      }
    }
    loadInitialData();
  }, []);

  const refreshAssets = async () => {
    const data = await AssetRepository.getAll();
    setAssets([...data]);
  };

  // --- Business Logic Handler ---
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
    state: { dialogs, activeTicker, editingAsset, fontsLoaded, assets, settings, macroData, finData },
    actions: { 
      toggleDialog, 
      setEditingAsset, 
      handleSaveAsset, 
      handleSaveTransaction, 
      handleUpdateFinance, 
      handleUpdateSettings,
      refreshAssets 
    }
  };
};
// src/ui/hooks/usePortfolioManager.js - Zentrales Management (Full-Body Sync & Logger Fix)

import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AssetRepository } from '../../store/AssetRepository';
import { SettingsRepository } from '../../store/SettingsRepository';
import { MacroRepository } from '../../store/MacroRepository';
import { FinancialRepository } from '../../store/FinancialRepository';

export const usePortfolioManager = () => {
  const [dialogs, setDialogs] = useState({
    settings: false,
    addAsset: false,
    transaction: false,
    history: false,
    macro: false,
    finance: false,
  });

  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', theme: 'dark' });
  const [macroData, setMacroData] = useState(null);
  const [finData, setFinData] = useState({ currentCash: 0, debtAmount: 0 });

  const toggleDialog = (key, visible, data = null) => {
    setDialogs(prev => ({ ...prev, [key]: visible }));
    if (key === 'addAsset' && !visible) setEditingAsset(null);
    if (key === 'transaction' && visible) setActiveTicker(data);
  };

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
        // Fix: Sicherer Zugriff auf den globalen Logger
        if (global.log) {
          global.log.error("usePortfolioManager: Initialisierungsfehler", e);
        }
      }
    }
    loadInitialData();
  }, []);

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
      if (global.log) global.log.error("usePortfolioManager: Fehler beim Speichern des Assets", e);
    }
  };

  const handleSaveTransaction = async (ticker, data) => {
    try {
      await AssetRepository.addTransaction(ticker, data);
      await refreshAssets();
      toggleDialog('transaction', false);
    } catch (e) {
      if (global.log) global.log.error("usePortfolioManager: Fehler beim Speichern der Transaktion", e);
    }
  };

  const handleUpdateFinance = async (newData) => {
    try {
      await FinancialRepository.saveData(newData);
      setFinData(newData);
      toggleDialog('finance', false);
    } catch (e) {
      if (global.log) global.log.error("usePortfolioManager: Fehler beim Update der Finanzen", e);
    }
  };

  const handleUpdateSettings = async (newSet) => {
    try {
      await SettingsRepository.saveSettings(newSet);
      setSettings(newSet);
      toggleDialog('settings', false);
    } catch (e) {
      if (global.log) global.log.error("usePortfolioManager: Fehler beim Update der Einstellungen", e);
    }
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
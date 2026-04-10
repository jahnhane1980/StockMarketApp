// src/ui/hooks/useCoreData.js - Core Data Management (Full-Body)

import { useState } from 'react';
import { AssetRepository } from '../../store/AssetRepository';
import { SettingsRepository } from '../../store/SettingsRepository';
import { FinancialRepository } from '../../store/FinancialRepository';
import { Trading212Repository } from '../../store/Trading212Repository';
import { MacroRepository } from '../../store/MacroRepository';
import { Config } from '../../core/Config';

export const useCoreData = () => {
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', t212Key: '', t212Secret: '', theme: 'dark', testMode: true });
  const [finData, setFinData] = useState({ currentCash: 0, debtAmount: 0 });
  const [t212Data, setT212Data] = useState(null);

  // Methode zum initialen Befüllen nach dem Ladevorgang
  const hydrateCoreData = (newAssets, newSettings, newFinData, newT212Data) => {
    setAssets(newAssets);
    setSettings(newSettings);
    setFinData(newFinData);
    setT212Data(newT212Data);
  };

  const refreshAssets = async () => { 
    const data = await AssetRepository.getAll(); 
    setAssets([...data]); 
  };

  const handleSaveAsset = async (asset) => {
    await AssetRepository.save(asset);
    await MacroRepository.clearCache();
    await refreshAssets();
  };

  const handleSaveTransaction = async (ticker, data) => {
    await AssetRepository.addTransaction(ticker, data);
    await MacroRepository.clearCache();
    await refreshAssets();
  };

  const handleUpdateFinance = async (newData) => {
    await FinancialRepository.saveData(newData);
    await MacroRepository.clearCache();
    setFinData(newData);
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
    
    // Wir geben zurück, ob sich der Modus geändert hat, damit die Fassade neu laden kann
    return modeChanged; 
  };

  const handleT212Refresh = async () => {
    const data = await Trading212Repository.getPortfolioData(true);
    setT212Data(data);
  };

  return {
    assets,
    settings,
    finData,
    t212Data,
    hydrateCoreData,
    refreshAssets,
    handleSaveAsset,
    handleSaveTransaction,
    handleUpdateFinance,
    handleUpdateSettings,
    handleT212Refresh
  };
};
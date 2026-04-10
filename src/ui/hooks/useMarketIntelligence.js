// src/ui/hooks/useMarketIntelligence.js - API & Market Data Logic (Full-Body)

import { useState } from 'react';
import { AssetRepository } from '../../store/AssetRepository';
import { SettingsRepository } from '../../store/SettingsRepository';
import { MacroRepository } from '../../store/MacroRepository';
import { FinancialRepository } from '../../store/FinancialRepository';
import { RadarRepository } from '../../store/RadarRepository'; 
import { Trading212Repository } from '../../store/Trading212Repository'; 
import { Config } from '../../core/Config';

export const useMarketIntelligence = (hydrateCoreData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [macroData, setMacroData] = useState(null);
  const [radarData, setRadarData] = useState(null);

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

      // Lokale Daten in den CoreData-Hook pumpen
      hydrateCoreData(loadedAssets, loadedSettings, finance, t212);
      
      setMacroData(status);
      setRadarData(radar);
    } catch (e) {
      if (global.log) global.log.error("useMarketIntelligence: Ladefehler", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    macroData,
    radarData,
    loadInitialData
  };
};
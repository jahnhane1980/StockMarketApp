// src/ui/hooks/useSystemSetup.js - System Initialisierung & Utils (Full-Body)

import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { LogService } from '../../api/LogService';

export const useSystemSetup = (onSetupComplete) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function initSystem() {
      try {
        // 1. Lade System-Abhängigkeiten (Fonts/Icons)
        await Font.loadAsync(Ionicons.font);
        setFontsLoaded(true);
        
        // 2. Starte das Data-Fetching (Callback aus MarketIntelligence)
        if (onSetupComplete) {
          await onSetupComplete();
        }
      } catch (error) {
        if (global.log) global.log.error("System Setup Error:", error);
      }
    }
    initSystem();
  }, []);

  const handleSendLogs = async () => {
    await LogService.sendCurrentLog();
  };

  return {
    fontsLoaded,
    handleSendLogs
  };
};
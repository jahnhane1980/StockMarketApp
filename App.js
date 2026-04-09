// App.js - 100% Theme-Token Integration (Full-Body)

import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  UIManager,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as Font from 'expo-font';
import { DarkTheme, LightTheme } from './Theme';
import { ThemeContext } from './ThemeContext';
import { ASSET_TYPES } from './Constants';
import SettingsDialog from './components/SettingsDialog';
import AddAssetDialog from './components/AddAssetDialog';
import TransactionDialog from './components/TransactionDialog';
import HistoryDialog from './components/HistoryDialog';
import StockItem from './components/StockItem';
import MacroDetailsDialog from './components/MacroDetailsDialog';
import FinancialDialog from './components/FinancialDialog';

import { AssetRepository } from './services/AssetRepository';
import { SettingsRepository } from './services/SettingsRepository';
import { MacroRepository } from './services/MacroRepository';
import { FinancialRepository } from './services/FinancialRepository';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [txDialogVisible, setTxDialogVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [macroVisible, setMacroVisible] = useState(false);
  const [finVisible, setFinVisible] = useState(false);
  
  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', theme: 'dark' });
  const [macroData, setMacroData] = useState(null);
  const [finData, setFinData] = useState({ currentCash: 0, debtAmount: 0 });

  const currentTheme = settings.theme === 'light' ? LightTheme : DarkTheme;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (macroData) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [macroData, pulseAnim]);

  useEffect(() => {
    async function loadApp() {
      try {
        await Font.loadAsync(Ionicons.font);
        setFontsLoaded(true);
        const loadedAssets = await AssetRepository.getAll();
        setAssets(loadedAssets);
        const loadedSettings = await SettingsRepository.getSettings();
        setSettings(loadedSettings);
        const status = await MacroRepository.getStatus();
        setMacroData(status);
        const finance = await FinancialRepository.getData();
        setFinData(finance);
      } catch (e) {
        if (global.log) log.error("App: Fehler beim Initialisieren", e);
      }
    }
    loadApp();
  }, []);

  const refreshList = async () => {
    const data = await AssetRepository.getAll();
    setAssets([...data]);
  };

  const getIndicatorColor = () => {
    if (!macroData?.action_summary) return currentTheme.colors.textSubtle;
    return MacroRepository.getColorForScore(macroData.action_summary.global_ui_score, currentTheme);
  };

  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: currentTheme.colors.bgMain },
    toolbar: { 
      height: currentTheme.layout.toolbarHeight, 
      backgroundColor: currentTheme.colors.bgMain, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingHorizontal: currentTheme.spacing.md, 
      borderBottomWidth: currentTheme.effects.borderWidthThin, 
      borderColor: currentTheme.colors.borderSubtle 
    },
    toolbarText: { 
      color: currentTheme.colors.textPrimary, 
      fontSize: currentTheme.typography.size.lg, 
      fontWeight: currentTheme.typography.weight.medium 
    },
    finSummaryRow: { 
      flexDirection: 'row', 
      backgroundColor: currentTheme.colors.bgSurface, 
      padding: currentTheme.spacing.md, 
      borderRadius: currentTheme.radii.standard, 
      marginBottom: currentTheme.spacing.sm, 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      borderWidth: currentTheme.effects.borderWidthThin, 
      borderColor: currentTheme.colors.borderSubtle 
    },
    finLabel: { 
      color: currentTheme.colors.textSubtle, 
      fontSize: currentTheme.typography.size.xxs, 
      textTransform: 'uppercase', 
      fontWeight: currentTheme.typography.weight.bold, 
      marginBottom: currentTheme.spacing.xs 
    },
    finValue: { 
      color: currentTheme.colors.textPrimary, 
      fontSize: currentTheme.typography.size.sm, 
      fontWeight: currentTheme.typography.weight.semibold 
    },
    macroIndicator: { 
      width: currentTheme.layout.macroIndicatorSize, 
      height: currentTheme.layout.macroIndicatorSize, 
      borderRadius: currentTheme.radii.indicator 
    },
    fab: { 
      position: 'absolute', 
      bottom: currentTheme.layout.fabBottom, 
      right: currentTheme.layout.fabRight, 
      width: currentTheme.layout.fabSize, 
      height: currentTheme.layout.fabSize, 
      borderRadius: currentTheme.layout.fabSize / 2, 
      backgroundColor: currentTheme.colors.brandPrimary, 
      justifyContent: 'center', 
      alignItems: 'center', 
      elevation: 5 
    },
    iconButton: { 
      width: currentTheme.layout.iconButtonSize, 
      height: currentTheme.layout.iconButtonSize, 
      justifyContent: 'center', 
      alignItems: 'center' 
    }
  });

  return (
    <ThemeContext.Provider value={currentTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={dynamicStyles.container}>
          <StatusBar barStyle={currentTheme.dark ? "light-content" : "dark-content"} backgroundColor={currentTheme.colors.bgMain} />

          <View style={dynamicStyles.toolbar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: currentTheme.layout.standardGap }}>
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', gap: currentTheme.layout.standardGap }} 
                onPress={() => setMacroVisible(true)}
              >
                <Animated.View style={[dynamicStyles.macroIndicator, { backgroundColor: getIndicatorColor(), transform: [{ scale: pulseAnim }] }]} />
                <Text style={dynamicStyles.toolbarText}>Macro</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: currentTheme.layout.standardGap }}>
              <TouchableOpacity style={dynamicStyles.iconButton} onPress={() => setHistoryVisible(true)}>
                {fontsLoaded && <Ionicons name="receipt-outline" size={currentTheme.icons.md} color={currentTheme.colors.textPrimary} />}
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.iconButton} onPress={() => setSettingsVisible(true)}>
                {fontsLoaded && <Ionicons name="settings-outline" size={currentTheme.icons.md} color={currentTheme.colors.textPrimary} />}
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: currentTheme.spacing.md, gap: currentTheme.spacing.md }}>
            <View style={dynamicStyles.finSummaryRow}>
              <View style={{ flex: 1 }}>
                <Text style={dynamicStyles.finLabel}>Verfügbares Cash</Text>
                <Text style={dynamicStyles.finValue}>{finData.currentCash.toLocaleString()} €</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={dynamicStyles.finLabel}>Fremdkapital</Text>
                <Text style={[dynamicStyles.finValue, finData.debtAmount > 0 && { color: currentTheme.colors.statusCritical }]}>
                  {finData.debtAmount.toLocaleString()} €
                </Text>
              </View>
              <TouchableOpacity style={{ padding: currentTheme.spacing.xs }} onPress={() => setFinVisible(true)}>
                {fontsLoaded && <Ionicons name="options-outline" size={currentTheme.icons.sm} color={currentTheme.colors.brandPrimary} />}
              </TouchableOpacity>
            </View>

            {assets.map((asset) => (
              <StockItem 
                key={asset.ticker} 
                ticker={asset.ticker} 
                price="..." 
                changePercent="..." 
                isWarning={asset.type === ASSET_TYPES.C}
                isCritical={asset.type === ASSET_TYPES.D}
                trend="up" 
                fontsLoaded={fontsLoaded} 
                status={asset.status}
                transactions={asset.transactions || []}
                onDelete={async (t) => { await AssetRepository.remove(t); await refreshList(); }} 
                onEdit={(t) => { setEditingAsset(assets.find(a => a.ticker === t)); setAddDialogVisible(true); }}
                onInvest={(t) => { setActiveTicker(t); setTxDialogVisible(true); }}
              />
            ))}
          </ScrollView>

          <TouchableOpacity style={dynamicStyles.fab} onPress={() => { setEditingAsset(null); setAddDialogVisible(true); }}>
            {fontsLoaded && <Ionicons name="add" size={currentTheme.icons.lg} color={currentTheme.colors.textOnPrimary} />}
          </TouchableOpacity>

          <SettingsDialog visible={settingsVisible} currentSettings={settings} onClose={() => setSettingsVisible(false)} onSave={async (n) => { await SettingsRepository.saveSettings(n); setSettings(n); setSettingsVisible(false); }} />
          <AddAssetDialog visible={addDialogVisible} onClose={() => { setAddDialogVisible(false); setEditingAsset(null); }} onSave={async (a) => { await AssetRepository.save(a); await refreshList(); setAddDialogVisible(false); }} initialAsset={editingAsset} />
          <TransactionDialog visible={txDialogVisible} ticker={activeTicker} onClose={() => setTxDialogVisible(false)} onSave={async (t, d) => { await AssetRepository.addTransaction(t, d); await refreshList(); setTxDialogVisible(false); }} />
          <HistoryDialog visible={historyVisible} onClose={() => setHistoryVisible(false)} />
          <MacroDetailsDialog visible={macroVisible} data={macroData} onClose={() => setMacroVisible(false)} />
          <FinancialDialog visible={finVisible} initialData={finData} onClose={() => setFinVisible(false)} onSave={async (newData) => { await FinancialRepository.saveData(newData); setFinData(newData); setFinVisible(false); }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
// App.js - Der Hauptbildschirm der Expo App (Full-Body Sync)

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as Font from 'expo-font';
import { Theme } from './Theme';
import { ASSET_TYPES } from './Constants';
import SettingsDialog from './components/SettingsDialog';
import AddAssetDialog from './components/AddAssetDialog';
import TransactionDialog from './components/TransactionDialog';
import HistoryDialog from './components/HistoryDialog';
import StockItem from './components/StockItem';

import { AssetRepository } from './services/AssetRepository';
import { SettingsRepository } from './services/SettingsRepository';

// LayoutAnimation für Android aktivieren
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [txDialogVisible, setTxDialogVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  
  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '' });

  useEffect(() => {
    async function loadApp() {
      try {
        if (global.log) log.info("App: Lade Initialdaten...");
        await Font.loadAsync(Ionicons.font);
        setFontsLoaded(true);
        
        const loadedAssets = await AssetRepository.getAll();
        setAssets(loadedAssets);
        
        const loadedSettings = await SettingsRepository.getSettings();
        setSettings(loadedSettings);
      } catch (e) {
        if (global.log) log.error("App: Fehler beim Initialisieren", e);
      }
    }
    loadApp();
  }, []);

  const refreshList = async () => {
    const data = await AssetRepository.getAll();
    setAssets([...data]);
    if (global.log) log.info("App: Asset-Liste aktualisiert.");
  };

  const handleSaveAsset = async (newAsset) => {
    try {
      await AssetRepository.save(newAsset);
      await refreshList();
      setAddDialogVisible(false);
      setEditingAsset(null);
    } catch (e) {
      if (global.log) log.error("App: Konnte Asset nicht speichern", e);
    }
  };

  const handleSaveTransaction = async (ticker, transactionData) => {
    try {
      await AssetRepository.addTransaction(ticker, transactionData);
      await refreshList();
      setTxDialogVisible(false);
    } catch (e) {
      if (global.log) log.error("App: Fehler bei Transaktions-Speicherung", e);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bgMain} />

        <View style={styles.toolbar}>
          <View style={styles.toolbarLeft}>
            <Text style={styles.toolbarText}>Macro</Text>
          </View>
          
          <View style={styles.toolbarRight}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => setHistoryVisible(true)}
            >
              {fontsLoaded && <Ionicons name="receipt-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => setSettingsVisible(true)}
            >
              {fontsLoaded && <Ionicons name="settings-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {assets.length === 0 ? (
            <Text style={styles.emptyText}>
              Keine Assets vorhanden. Füge welche über das '+' hinzu.
            </Text>
          ) : (
            assets.map((asset) => (
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
                onDelete={async (t) => { 
                  await AssetRepository.remove(t); 
                  await refreshList(); 
                }} 
                onEdit={(t) => {
                  const toEdit = assets.find(a => a.ticker === t);
                  setEditingAsset(toEdit);
                  setAddAssetDialogVisible(true);
                }}
                onInvest={(t) => {
                  setActiveTicker(t);
                  setTxDialogVisible(true);
                }}
              />
            ))
          )}
        </ScrollView>

        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => {
            setEditingAsset(null);
            setAddDialogVisible(true);
          }}
        >
          {fontsLoaded && <Ionicons name="add" size={Theme.icons.lg} color={Theme.colors.textOnPrimary} />}
        </TouchableOpacity>

        <SettingsDialog 
          visible={settingsVisible} 
          currentApiKey={settings.apiKey}
          onClose={() => setSettingsVisible(false)} 
          onSave={async (newSet) => {
            await SettingsRepository.saveSettings(newSet);
            setSettings(newSet);
            setSettingsVisible(false);
          }}
        />

        <AddAssetDialog 
          visible={addDialogVisible} 
          onClose={() => {
            setAddDialogVisible(false);
            setEditingAsset(null);
          }} 
          onSave={handleSaveAsset}
          initialAsset={editingAsset}
        />

        <TransactionDialog
          visible={txDialogVisible}
          ticker={activeTicker}
          onClose={() => setTxDialogVisible(false)}
          onSave={handleSaveTransaction}
        />

        <HistoryDialog
          visible={historyVisible}
          onClose={() => setHistoryVisible(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgMain },
  toolbar: {
    height: Theme.layout.toolbarHeight,
    backgroundColor: Theme.colors.bgMain, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  toolbarLeft: { flexDirection: 'row', alignItems: 'center' },
  toolbarRight: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm },
  toolbarText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.medium,
  },
  iconButton: {
    width: Theme.layout.iconButtonSize,
    height: Theme.layout.iconButtonSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: { flex: 1 },
  listContent: { padding: Theme.spacing.md, gap: Theme.spacing.sm },
  emptyText: {
    textAlign: 'center',
    color: Theme.colors.textSubtle,
    marginTop: Theme.spacing.xl,
    fontSize: Theme.typography.size.md,
  },
  fab: {
    position: 'absolute',
    bottom: Theme.layout.fabBottom,
    right: Theme.layout.fabRight,
    width: Theme.layout.fabSize,
    height: Theme.layout.fabSize,
    borderRadius: Theme.layout.fabSize / 2,
    backgroundColor: Theme.colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Theme.colors.shadowDefault,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Theme.effects.shadowOpacityFab,
    shadowRadius: 4,
  },
});
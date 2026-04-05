// App.js - Der Hauptbildschirm (Refactored)

import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, UIManager } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as Font from 'expo-font';
import { Theme } from './Theme';
import { ASSET_TYPES } from './Constants';
import SettingsDialog from './components/SettingsDialog';
import AddAssetDialog from './components/AddAssetDialog';
import TransactionDialog from './components/TransactionDialog';
import StockItem from './components/StockItem';
import { AssetRepository } from './services/AssetRepository';
import { SettingsRepository } from './services/SettingsRepository';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [txDialogVisible, setTxDialogVisible] = useState(false);
  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      await Font.loadAsync(Ionicons.font);
      setFontsLoaded(true);
      const data = await AssetRepository.getAll();
      setAssets(data);
    }
    load();
  }, []);

  const refreshList = async () => {
    const data = await AssetRepository.getAll();
    setAssets([...data]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bgMain} />
        <View style={styles.toolbar}>
          <Text style={styles.toolbarText}>Macro</Text>
          <TouchableOpacity onPress={() => setSettingsVisible(true)}>
            <Ionicons name="settings-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.listContent}>
          {assets.map((asset) => (
            <StockItem 
              key={asset.ticker} 
              {...asset} 
              price="..." 
              changePercent="..." 
              isWarning={asset.type === ASSET_TYPES.C}
              isCritical={asset.type === ASSET_TYPES.D}
              fontsLoaded={fontsLoaded}
              onDelete={async (t) => { await AssetRepository.remove(t); refreshList(); }}
              onEdit={(t) => { setEditingAsset(assets.find(a => a.ticker === t)); setAddDialogVisible(true); }}
              onInvest={(t) => { setActiveTicker(t); setTxDialogVisible(true); }}
            />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={() => { setEditingAsset(null); setAddDialogVisible(true); }}>
          <Ionicons name="add" size={Theme.icons.lg} color={Theme.colors.textOnPrimary} />
        </TouchableOpacity>

        <SettingsDialog visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
        <AddAssetDialog visible={addDialogVisible} initialAsset={editingAsset} onSave={async (a) => { await AssetRepository.save(a); refreshList(); setAddDialogVisible(false); }} onClose={() => setAddDialogVisible(false)} />
        <TransactionDialog visible={txDialogVisible} ticker={activeTicker} onSave={async (t, tx) => { await AssetRepository.addTransaction(t, tx); refreshList(); setTxDialogVisible(false); }} onClose={() => setTxDialogVisible(false)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgMain },
  toolbar: { 
    height: Theme.layout.toolbarHeight, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: Theme.spacing.md, 
    borderBottomWidth: Theme.effects.borderWidthThin, 
    borderColor: Theme.colors.borderSubtle 
  },
  toolbarText: { color: Theme.colors.textPrimary, fontSize: Theme.typography.size.lg, fontWeight: Theme.typography.weight.medium },
  listContent: { padding: Theme.spacing.md },
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
  }
});
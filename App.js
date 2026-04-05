// App.js - Der Hauptbildschirm der Expo App

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
import SettingsDialog from './components/SettingsDialog';
import AddAssetDialog from './components/AddAssetDialog';
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
  const [editingAsset, setEditingAsset] = useState(null); // NEU: Speichert das zu bearbeitende Asset
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '' });

  useEffect(() => {
    async function loadApp() {
      try {
        await Font.loadAsync(Ionicons.font);
        setFontsLoaded(true);
        
        const loadedAssets = await AssetRepository.getAll();
        setAssets(loadedAssets);
        
        const loadedSettings = await SettingsRepository.getSettings();
        setSettings(loadedSettings);
      } catch (e) {
        if (global.log) log.error("Fehler beim Initialisieren der App", e);
      }
    }
    loadApp();
  }, []);

  const handleSaveAsset = async (newAsset) => {
    try {
      await AssetRepository.save(newAsset);
      const freshAssets = await AssetRepository.getAll(); 
      setAssets([...freshAssets]); 
      setAddDialogVisible(false);
      setEditingAsset(null); // Edit-Modus aufräumen
    } catch (e) {
      if (global.log) log.error("Konnte Asset nicht speichern", e);
    }
  };

  const handleDeleteAsset = async (ticker) => {
    try {
      await AssetRepository.remove(ticker);
      const freshAssets = await AssetRepository.getAll();
      setAssets([...freshAssets]);
    } catch (e) {
      if (global.log) log.error("Fehler beim Löschen", e);
    }
  };

  // NEU: Öffnet den Dialog im Edit-Modus
  const handleEditAsset = (ticker) => {
    const assetToEdit = assets.find(a => a.ticker === ticker);
    if (assetToEdit) {
      setEditingAsset(assetToEdit);
      setAddDialogVisible(true);
    }
  };

  // NEU: Öffnet den Dialog für ein neues Asset (FAB Button)
  const handleAddNewAsset = () => {
    setEditingAsset(null);
    setAddDialogVisible(true);
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      const updatedSettings = await SettingsRepository.saveSettings(newSettings);
      setSettings(updatedSettings);
      setSettingsVisible(false);
    } catch (e) {
      if (global.log) log.error("Konnte Settings nicht speichern", e);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bgMain} />

        <View style={styles.toolbar}>
          <View style={styles.macroGroup}>
            <View style={styles.macroMarker} />
            <Text style={styles.toolbarText}>Macro</Text>
          </View>
          
          <TouchableOpacity style={styles.iconButton} onPress={() => setSettingsVisible(true)}>
            {fontsLoaded ? (
              <Ionicons name="settings-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />
            ) : (
              <Text style={{ color: Theme.colors.textPrimary }}>[S]</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {assets.length === 0 ? (
            <Text style={styles.emptyText}>
              Keine Assets vorhanden. Füge welche über das '+' hinzu.
            </Text>
          ) : (
            assets.map((asset, index) => {
              const isCrit = asset.type === 'D';
              const isWarn = asset.type === 'C';

              return (
                <StockItem 
                  key={asset.ticker || index} 
                  ticker={asset.ticker} 
                  price="..." 
                  changePercent="..." 
                  trend="up" 
                  isWarning={isWarn}
                  isCritical={isCrit}
                  fontsLoaded={fontsLoaded} 
                  status={asset.status}
                  onDelete={handleDeleteAsset} 
                  onEdit={handleEditAsset} // NEU
                />
              );
            })
          )}
        </ScrollView>

        <Text style={styles.lastUpdateText}>Last update: 5s ago</Text>

        <TouchableOpacity 
          style={styles.fab} 
          onPress={handleAddNewAsset} // Geändert
        >
          {fontsLoaded ? (
            <Ionicons name="add" size={30} color={Theme.colors.textOnPrimary} />
          ) : (
            <Text style={{ color: Theme.colors.textOnPrimary, fontSize: 24 }}>+</Text>
          )}
        </TouchableOpacity>

        <SettingsDialog 
          visible={settingsVisible} 
          currentApiKey={settings.apiKey}
          onClose={() => setSettingsVisible(false)} 
          onSave={handleSaveSettings}
        />
        <AddAssetDialog 
          visible={addDialogVisible} 
          onClose={() => {
            setAddDialogVisible(false);
            setEditingAsset(null); // Wichtig, sonst bleibt er im Edit-Modus hängen
          }} 
          onSave={handleSaveAsset}
          initialAsset={editingAsset} // NEU
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgMain, 
  },
  toolbar: {
    height: 60,
    backgroundColor: Theme.colors.bgMain, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  toolbarText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.typography.size.lg,
    fontWeight: Theme.typography.weight.medium,
  },
  macroGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  macroMarker: {
    width: 16,
    height: 16,
    borderRadius: Theme.radii.full,
    backgroundColor: Theme.colors.statusAlert, 
    shadowColor: Theme.colors.statusAlert,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: Theme.effects.shadowOpacityFull,
    shadowRadius: Theme.effects.shadowRadiusMarker,
  },
  iconButton: {
    padding: Theme.spacing.sm,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
    borderRadius: Theme.radii.input,
  },
  listContainer: { flex: 1 },
  listContent: { padding: Theme.spacing.md, gap: Theme.spacing.sm },
  emptyText: {
    textAlign: 'center',
    color: Theme.colors.textSubtle,
    marginTop: Theme.spacing.xl,
    fontSize: Theme.typography.size.md,
  },
  lastUpdateText: {
    textAlign: 'center',
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSubtle,
    marginVertical: Theme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
    right: Theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Theme.colors.shadowDefault,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
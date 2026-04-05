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

// LayoutAnimation für Android aktivieren
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false); // Neuer State für Add Dialog
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(Ionicons.font);
      } catch (e) {
        log.error("Fonts could not be loaded", e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bgMain} />

        <View style={styles.toolbar}>
          <View style={styles.macroGroup}>
            <View style={styles.macroMarker} />
            <Text style={styles.toolbarText}>Macro</Text>
          </View>
          
          <TouchableOpacity style={styles.iconButton} onPress={() => {
            log.info("Settings geöffnet");
            setSettingsVisible(true);
          }}>
            {fontsLoaded ? (
              <Ionicons name="settings-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />
            ) : (
              <Text style={{ color: Theme.colors.textPrimary }}>[S]</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          <StockItem ticker="AAPL" price="$185.00" changePercent="+15%" trend="up" fontsLoaded={fontsLoaded} />
          <StockItem ticker="TSLA" price="$162.50" changePercent="-3.2%" trend="down" isWarning={true} fontsLoaded={fontsLoaded} />
          <StockItem ticker="RIVN" price="$10.80" changePercent="-12.1%" trend="down" isCritical={true} fontsLoaded={fontsLoaded} />
          <StockItem ticker="MSFT" price="$415.20" changePercent="+0.6%" trend="up" fontsLoaded={fontsLoaded} />
          <StockItem ticker="GOOGL" price="$148.90" changePercent="+2.1%" trend="up" fontsLoaded={fontsLoaded} />
        </ScrollView>

        <Text style={styles.lastUpdateText}>Last update: 5s ago</Text>

        {/* Floating Action Button für Add Asset */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => setAddDialogVisible(true)}
        >
          {fontsLoaded ? (
            <Ionicons name="add" size={30} color={Theme.colors.textOnPrimary} />
          ) : (
            <Text style={{ color: Theme.colors.textOnPrimary, fontSize: 24 }}>+</Text>
          )}
        </TouchableOpacity>

        <SettingsDialog visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
        <AddAssetDialog visible={addDialogVisible} onClose={() => setAddDialogVisible(false)} />
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
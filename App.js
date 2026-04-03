// App.js - Der Hauptbildschirm der Expo App

import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
// Nutze Expo Icons für das Zahnrad
import { Ionicons } from '@expo/vector-icons'; 
// Importiere das Theme und den Dialog
import { Theme } from './Theme';
import SettingsDialog from './components/SettingsDialog';

export default function App() {
  // State, um den Sichtbarkeitsstatus des Dialogs zu verwalten
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Wiederverwendbare Aktien-Item Komponente (aus image_2.png)
  const StockItem = ({ ticker, name, price, changePercent, isWarning, isCritical }) => (
    <View style={styles.stockItemCard}>
      <View style={styles.stockRow}>
        {/* Ticker (z.B. AAPL) */}
        <Text style={styles.stockTicker}>{ticker}</Text>
        
        {/* Visueller Marker / Sparkline (hier vereinfacht als Text) */}
        <Text style={styles.sparkline}>~~~</Text>

        {/* Status (Prozent, Pfeil, Icon) */}
        <View style={styles.statusRow}>
          <Text style={styles.stockPrice}>{price}</Text>
          <Text style={[
            styles.changePercent, 
            isWarning && { color: Theme.colors.statusAlert },
            isCritical && { color: Theme.colors.statusCritical },
          ]}>
            {changePercent}
          </Text>
          {isWarning && <Ionicons name="warning-outline" size={Theme.icons.sm} color={Theme.colors.statusAlert} />}
          {isCritical && <Ionicons name="close-circle-outline" size={Theme.icons.sm} color={Theme.colors.statusCritical} />}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Setze Status Bar Stil auf dunkles Theme */}
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bgMain} />

      {/* --- Toolbar / Header --- */}
      <View style={styles.toolbar}>
        {/* Makro-Status (wie in image_2.png) */}
        <View style={styles.macroGroup}>
          <View style={styles.macroMarker} /> {/* Der blinkende Punkt */}
          <Text style={styles.toolbarText}>Macro</Text>
        </View>
        
        {/* Das Zahnrad-Icon, um den Dialog zu öffnen */}
        <TouchableOpacity style={styles.iconButton} onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* --- Aktienliste --- */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        <StockItem ticker="AAPL" price="$185.00" changePercent="+15% ↑" />
        {/* Warnung: Orange (TSLA) */}
        <StockItem ticker="TSLA" price="$162.50" changePercent="-3.2% ↓" isWarning={true} />
        {/* Kritisch: Rot (RIVN) */}
        <StockItem ticker="RIVN" price="$10.80" changePercent="-12.1% ↓" isCritical={true} />
        <StockItem ticker="MSFT" price="$415.20" changePercent="+0.6% ↑" />
        <StockItem ticker="GOOGL" price="$148.90" changePercent="+2.1% ↑" />
      </ScrollView>

      {/* Letztes Update Text */}
      <Text style={styles.lastUpdateText}>Last update: 5s ago</Text>

      {/* --- Der Einstellungs-Dialog (Modal) --- */}
      <SettingsDialog 
        visible={settingsVisible} 
        onClose={() => setSettingsVisible(false)} // Schließt den Dialog
      />
    </SafeAreaView>
  );
}

// --- Styling (NUR mit Theme-Werten) ---
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
  // Der orange blinkende Marker (wie in image_2.png)
  macroMarker: {
    width: 16,
    height: 16,
    borderRadius: Theme.radii.full,
    backgroundColor: Theme.colors.statusAlert, 
    // Ein kleiner Glow-Effekt (iOS)
    shadowColor: Theme.colors.statusAlert,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: Theme.effects.shadowOpacityFull,
    shadowRadius: Theme.effects.shadowRadiusMarker,
  },
  iconButton: {
    padding: Theme.spacing.sm,
    // Optional: Eine dezente Umrandung für das Icon
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
    borderRadius: Theme.radii.input,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm, 
  },
  stockItemCard: {
    backgroundColor: Theme.colors.bgSurface, 
    borderRadius: Theme.radii.standard,
    padding: Theme.spacing.md,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockTicker: {
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.semibold,
    color: Theme.colors.textPrimary,
    width: 60, 
  },
  sparkline: {
    color: Theme.colors.textSubtle,
    fontSize: Theme.typography.size.xl,
    letterSpacing: -2,
    flex: 1, 
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    justifyContent: 'flex-end',
  },
  stockPrice: {
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
  },
  changePercent: {
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.brandPrimary, 
    fontWeight: Theme.typography.weight.medium,
  },
  lastUpdateText: {
    textAlign: 'center',
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSubtle,
    marginVertical: Theme.spacing.sm,
  },
});

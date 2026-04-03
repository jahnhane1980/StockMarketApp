// App.js - Der Hauptbildschirm der Expo App

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import * as Font from 'expo-font';
import { Theme } from './Theme';
import SettingsDialog from './components/SettingsDialog';

// LayoutAnimation für Android aktivieren
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(Ionicons.font);
      } catch (e) {
        console.warn("Fonts could not be loaded", e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  const StockItem = ({ ticker, price, changePercent, isWarning, isCritical, trend }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(!expanded);
    };

    return (
      <TouchableOpacity 
        style={styles.stockItemCard} 
        onPress={toggleExpand} 
        activeOpacity={0.7}
      >
        <View style={styles.stockRow}>
          <Text style={[
            styles.stockTicker,
            isCritical && { color: Theme.colors.statusCritical },
            isWarning && { color: Theme.colors.statusAlert }
          ]}>
            {ticker}
          </Text>
          
          <View style={styles.statusRow}>
            <Text style={styles.stockPrice}>{price}</Text>
            <Text style={[
              styles.changePercent, 
              isWarning && { color: Theme.colors.statusAlert },
              isCritical && { color: Theme.colors.statusCritical },
            ]}>
              {changePercent} {trend === 'up' ? '↑' : '↓'}
            </Text>
            {fontsLoaded && isWarning && <Ionicons name="warning-outline" size={Theme.icons.sm} color={Theme.colors.statusAlert} />}
            {fontsLoaded && isCritical && <Ionicons name="close-circle-outline" size={Theme.icons.sm} color={Theme.colors.statusCritical} />}
            {fontsLoaded && (
              <Ionicons 
                name={expanded ? "chevron-up" : "chevron-down"} 
                size={Theme.icons.sm} 
                color={Theme.colors.textSubtle} 
              />
            )}
          </View>
        </View>

        {/* --- Detail Ansicht (aus image_082fe5.jpg) --- */}
        {expanded && (
          <View style={styles.detailContainer}>
            <View style={styles.detailGrid}>
              <View>
                <Text style={styles.detailLabel}>Raill</Text>
                <Text style={styles.detailValue}>38.87</Text>
                <Text style={[styles.detailSubValue, { color: Theme.colors.statusCritical }]}>▼ 0.73%</Text>
              </View>
              <View>
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={styles.detailValue}>50.30</Text>
                <Text style={[styles.detailSubValue, { color: Theme.colors.statusCritical }]}>▼ 1.90%</Text>
              </View>
              <View>
                <Text style={styles.detailLabel}>High</Text>
                <Text style={styles.detailValue}>43.1M</Text>
              </View>
            </View>

            {/* Error Logs */}
            <View style={styles.errorLog}>
              <Text style={styles.errorText}>ERROR: NETWORK CONNECTION TIMEOUT</Text>
              <Text style={styles.errorText}>ERROR: NETWORK CONNECTION TIMEOUT</Text>
              <Text style={styles.errorText}>ERROR: EERORS</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
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
        <StockItem ticker="AAPL" price="$185.00" changePercent="+15%" trend="up" />
        <StockItem ticker="TSLA" price="$162.50" changePercent="-3.2%" trend="down" isWarning={true} />
        <StockItem ticker="RIVN" price="$10.80" changePercent="-12.1%" trend="down" isCritical={true} />
        <StockItem ticker="MSFT" price="$415.20" changePercent="+0.6%" trend="up" />
        <StockItem ticker="GOOGL" price="$148.90" changePercent="+2.1%" trend="up" />
      </ScrollView>

      <Text style={styles.lastUpdateText}>Last update: 5s ago</Text>

      <SettingsDialog visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </SafeAreaView>
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
  stockItemCard: {
    backgroundColor: Theme.colors.bgSurface, 
    borderRadius: Theme.radii.standard,
    padding: Theme.spacing.md,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stockTicker: {
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.semibold,
    color: Theme.colors.textPrimary,
    width: 80, 
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    justifyContent: 'flex-end',
  },
  stockPrice: { fontSize: Theme.typography.size.sm, color: Theme.colors.textPrimary },
  changePercent: {
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.brandPrimary, 
    fontWeight: Theme.typography.weight.medium,
    minWidth: 60,
    textAlign: 'right',
  },
  detailContainer: {
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    borderTopWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  detailLabel: {
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSubtle,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
    fontWeight: Theme.typography.weight.medium,
  },
  detailSubValue: {
    fontSize: 10,
    marginTop: 2,
  },
  errorLog: {
    marginTop: Theme.spacing.sm,
  },
  errorText: {
    fontSize: 10,
    color: Theme.colors.statusCritical,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
  lastUpdateText: {
    textAlign: 'center',
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSubtle,
    marginVertical: Theme.spacing.sm,
  },
});

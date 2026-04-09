// App.js - Layout-Komponente (Full-Body)

import React, { useRef, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, UIManager, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { DarkTheme, LightTheme } from './Theme';
import { ThemeContext } from './ThemeContext';
import { ASSET_TYPES } from './Constants';
import { usePortfolioManager } from './hooks/usePortfolioManager'; // Neuer Name
import { MacroRepository } from './services/MacroRepository';
import { AssetRepository } from './services/AssetRepository';

// Dialoge
import SettingsDialog from './components/SettingsDialog';
import AddAssetDialog from './components/AddAssetDialog';
import TransactionDialog from './components/TransactionDialog';
import HistoryDialog from './components/HistoryDialog';
import StockItem from './components/StockItem';
import MacroDetailsDialog from './components/MacroDetailsDialog';
import FinancialDialog from './components/FinancialDialog';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const { state, actions } = usePortfolioManager(); // Neuer Name
  const { settings, macroData, finData, assets, dialogs, fontsLoaded } = state;

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
  }, [macroData]);

  const getIndicatorColor = () => {
    if (!macroData?.action_summary) return currentTheme.colors.textSubtle;
    return MacroRepository.getColorForScore(macroData.action_summary.global_ui_score, currentTheme);
  };

  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: currentTheme.colors.bgMain },
    toolbar: { 
      height: currentTheme.layout.toolbarHeight, 
      backgroundColor: currentTheme.colors.bgMain, 
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
      paddingHorizontal: currentTheme.spacing.md, borderBottomWidth: currentTheme.effects.borderWidthThin, borderColor: currentTheme.colors.borderSubtle 
    },
    finSummaryRow: { 
      flexDirection: 'row', backgroundColor: currentTheme.colors.bgSurface, padding: currentTheme.spacing.md, borderRadius: currentTheme.radii.standard, 
      marginBottom: currentTheme.spacing.sm, alignItems: 'center', justifyContent: 'space-between', borderWidth: currentTheme.effects.borderWidthThin, borderColor: currentTheme.colors.borderSubtle 
    },
    fab: { 
      position: 'absolute', bottom: currentTheme.layout.fabBottom, right: currentTheme.layout.fabRight, width: currentTheme.layout.fabSize, height: currentTheme.layout.fabSize, 
      borderRadius: currentTheme.layout.fabSize / 2, backgroundColor: currentTheme.colors.brandPrimary, justifyContent: 'center', alignItems: 'center', elevation: 5 
    }
  });

  return (
    <ThemeContext.Provider value={currentTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={dynamicStyles.container}>
          <StatusBar barStyle={currentTheme.dark ? "light-content" : "dark-content"} backgroundColor={currentTheme.colors.bgMain} />

          {/* Toolbar */}
          <View style={dynamicStyles.toolbar}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: currentTheme.layout.standardGap }} onPress={() => actions.toggleDialog('macro', true)}>
              <Animated.View style={[{ width: currentTheme.layout.macroIndicatorSize, height: currentTheme.layout.macroIndicatorSize, borderRadius: currentTheme.radii.indicator, backgroundColor: getIndicatorColor() }, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={{ color: currentTheme.colors.textPrimary, fontSize: currentTheme.typography.size.lg, fontWeight: currentTheme.typography.weight.medium }}>Macro</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: currentTheme.layout.standardGap }}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => actions.toggleDialog('history', true)}>
                {fontsLoaded && <Ionicons name="receipt-outline" size={currentTheme.icons.md} color={currentTheme.colors.textPrimary} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => actions.toggleDialog('settings', true)}>
                {fontsLoaded && <Ionicons name="settings-outline" size={currentTheme.icons.md} color={currentTheme.colors.textPrimary} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* List Content */}
          <ScrollView contentContainerStyle={{ padding: currentTheme.spacing.md }}>
            <View style={dynamicStyles.finSummaryRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: currentTheme.colors.textSubtle, fontSize: currentTheme.typography.size.xxs, textTransform: 'uppercase', fontWeight: currentTheme.typography.weight.bold }}>Cash</Text>
                <Text style={{ color: currentTheme.colors.textPrimary, fontSize: currentTheme.typography.size.sm, fontWeight: currentTheme.typography.weight.semibold }}>{finData.currentCash.toLocaleString()} €</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: currentTheme.colors.textSubtle, fontSize: currentTheme.typography.size.xxs, textTransform: 'uppercase', fontWeight: currentTheme.typography.weight.bold }}>Debt</Text>
                <Text style={[{ color: currentTheme.colors.textPrimary, fontSize: currentTheme.typography.size.sm, fontWeight: currentTheme.typography.weight.semibold }, finData.debtAmount > 0 && { color: currentTheme.colors.statusCritical }]}>{finData.debtAmount.toLocaleString()} €</Text>
              </View>
              <TouchableOpacity onPress={() => actions.toggleDialog('finance', true)}>
                {fontsLoaded && <Ionicons name="options-outline" size={currentTheme.icons.sm} color={currentTheme.colors.brandPrimary} />}
              </TouchableOpacity>
            </View>

            {assets.map(asset => (
              <StockItem key={asset.ticker} ticker={asset.ticker} price="..." changePercent="..." isWarning={asset.type === ASSET_TYPES.C} isCritical={asset.type === ASSET_TYPES.D} trend="up" fontsLoaded={fontsLoaded} status={asset.status} transactions={asset.transactions || []}
                onDelete={async t => { await AssetRepository.remove(t); actions.refreshAssets(); }}
                onEdit={t => { actions.setEditingAsset(assets.find(a => a.ticker === t)); actions.toggleDialog('addAsset', true); }}
                onInvest={t => actions.toggleDialog('transaction', true, t)}
              />
            ))}
          </ScrollView>

          <TouchableOpacity style={dynamicStyles.fab} onPress={() => actions.toggleDialog('addAsset', true)}>
            {fontsLoaded && <Ionicons name="add" size={currentTheme.icons.lg} color={currentTheme.colors.textOnPrimary} />}
          </TouchableOpacity>

          {/* Modals */}
          <SettingsDialog visible={dialogs.settings} currentSettings={settings} onClose={() => actions.toggleDialog('settings', false)} onSave={actions.handleUpdateSettings} />
          <AddAssetDialog visible={dialogs.addAsset} initialAsset={state.editingAsset} onClose={() => actions.toggleDialog('addAsset', false)} onSave={actions.handleSaveAsset} />
          <TransactionDialog visible={dialogs.transaction} ticker={state.activeTicker} onClose={() => actions.toggleDialog('transaction', false)} onSave={actions.handleSaveTransaction} />
          <HistoryDialog visible={dialogs.history} onClose={() => actions.toggleDialog('history', false)} />
          <MacroDetailsDialog visible={dialogs.macro} data={macroData} onClose={() => actions.toggleDialog('macro', false)} />
          <FinancialDialog visible={dialogs.finance} initialData={finData} onClose={() => actions.toggleDialog('finance', false)} onSave={actions.handleUpdateFinance} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }
});
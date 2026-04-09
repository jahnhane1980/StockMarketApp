// src/ui/MainView.js - Presenter Integration (Full-Body Fix)

import React, { useRef, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, UIManager, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { DarkTheme, LightTheme } from '../theme/Theme';
import { ThemeContext } from '../theme/ThemeContext';
import { usePortfolioManager } from './hooks/usePortfolioManager';
import { AssetRepository } from '../store/AssetRepository';
import { AssetPresenter } from './presenters/AssetPresenter'; 

// Dialoge & Komponenten
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

export default function MainView() {
  const { state, actions } = usePortfolioManager();
  const { settings, macroData, finData, assets, dialogs, fontsLoaded } = state;

  const currentTheme = settings.theme === 'light' ? LightTheme : DarkTheme;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Der Presenter übernimmt die visuelle Logik für den Markt
  const marketVm = AssetPresenter.getMarketViewModel(macroData?.action_summary?.global_ui_score, currentTheme);

  useEffect(() => {
    if (macroData) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [macroData]);

  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: currentTheme.colors.background },
    toolbar: { 
      height: currentTheme.layout.headerHeight, 
      backgroundColor: currentTheme.colors.background, 
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
      paddingHorizontal: currentTheme.spacing.md, borderBottomWidth: currentTheme.effects.border, borderColor: currentTheme.colors.border 
    },
    finRow: { 
      flexDirection: 'row', backgroundColor: currentTheme.colors.surface, padding: currentTheme.spacing.md, borderRadius: currentTheme.radii.md, 
      marginBottom: currentTheme.spacing.sm, alignItems: 'center', justifyContent: 'space-between', borderWidth: currentTheme.effects.border, borderColor: currentTheme.colors.border 
    },
    fab: { 
      position: 'absolute', bottom: currentTheme.spacing.xl, right: currentTheme.spacing.lg, width: 56, height: 56, 
      borderRadius: currentTheme.radii.full, backgroundColor: currentTheme.colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 5 
    }
  });

  return (
    <ThemeContext.Provider value={currentTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={dynamicStyles.container}>
          <StatusBar barStyle={currentTheme.dark ? "light-content" : "dark-content"} backgroundColor={currentTheme.colors.background} />

          {/* Header Bar */}
          <View style={dynamicStyles.toolbar}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: currentTheme.spacing.sm }} onPress={() => actions.toggleDialog('macro', true)}>
              <Animated.View style={[{ width: 12, height: 12, borderRadius: 6, backgroundColor: marketVm.color }, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={{ color: currentTheme.colors.text, fontSize: currentTheme.typography.size.subheading, fontWeight: currentTheme.typography.weight.medium }}>Market</Text>
            </TouchableOpacity>
            <div style={{ flexDirection: 'row', alignItems: 'center', gap: currentTheme.spacing.sm }}>
              <TouchableOpacity onPress={() => actions.toggleDialog('history', true)} style={{ padding: 8 }}>
                {fontsLoaded && <Ionicons name="receipt-outline" size={currentTheme.layout.icon.md} color={currentTheme.colors.text} />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => actions.toggleDialog('settings', true)} style={{ padding: 8 }}>
                {fontsLoaded && <Ionicons name="settings-outline" size={currentTheme.layout.icon.md} color={currentTheme.colors.text} />}
              </TouchableOpacity>
            </div>
          </View>

          {/* Main List */}
          <ScrollView contentContainerStyle={{ padding: currentTheme.spacing.md }}>
            <View style={dynamicStyles.finRow}>
              <View style={{ flex: 1 }}>
                {/* FIX: theme -> currentTheme */}
                <Text style={{ color: currentTheme.colors.textSubtle, fontSize: currentTheme.typography.size.caption, textTransform: 'uppercase', fontWeight: currentTheme.typography.weight.bold }}>Available Cash</Text>
                <Text style={{ color: currentTheme.colors.text, fontSize: currentTheme.typography.size.body, fontWeight: currentTheme.typography.weight.bold }}>{finData.currentCash.toLocaleString()} €</Text>
              </View>
              <View style={{ flex: 1 }}>
                {/* FIX: theme -> currentTheme */}
                <Text style={{ color: currentTheme.colors.textSubtle, fontSize: currentTheme.typography.size.caption, textTransform: 'uppercase', fontWeight: currentTheme.typography.weight.bold }}>Debt Capital</Text>
                <Text style={[{ color: currentTheme.colors.text, fontSize: currentTheme.typography.size.body, fontWeight: currentTheme.typography.weight.bold }, finData.debtAmount > 0 && { color: currentTheme.colors.error }]}>{finData.debtAmount.toLocaleString()} €</Text>
              </View>
              <TouchableOpacity onPress={() => actions.toggleDialog('finance', true)}>
                {fontsLoaded && <Ionicons name="options-outline" size={currentTheme.layout.icon.sm} color={currentTheme.colors.primary} />}
              </TouchableOpacity>
            </View>

            {assets.map(asset => (
              <StockItem 
                key={asset.ticker} 
                asset={asset}
                price="..." 
                changePercent="..." 
                trend="up" 
                fontsLoaded={fontsLoaded}
                onDelete={async t => { await AssetRepository.remove(t); actions.refreshAssets(); }}
                onEdit={t => { actions.setEditingAsset(assets.find(a => a.ticker === t)); actions.toggleDialog('addAsset', true); }}
                onInvest={t => actions.toggleDialog('transaction', true, t)}
              />
            ))}
          </ScrollView>

          <TouchableOpacity style={dynamicStyles.fab} onPress={() => actions.toggleDialog('addAsset', true)}>
            {fontsLoaded && <Ionicons name="add" size={currentTheme.layout.icon.lg} color={currentTheme.colors.onPrimary} />}
          </TouchableOpacity>

          {/* Dialogs */}
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
// src/ui/MainView.js - UI Refinement & Radar Restoration (Full-Body)

import React, { useRef, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, UIManager, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { DarkTheme, LightTheme } from '../theme/Theme';
import { ThemeContext } from '../theme/ThemeContext';
import { usePortfolioManager } from './hooks/usePortfolioManager';
import { AssetPresenter } from './presenters/AssetPresenter'; 
import { AssetRepository } from '../store/AssetRepository';

import SettingsDialog from './components/SettingsDialog';
import AddAssetDialog from './components/AddAssetDialog';
import TransactionDialog from './components/TransactionDialog';
import HistoryDialog from './components/HistoryDialog';
import StockItem from './components/StockItem';
import MacroDetailsDialog from './components/MacroDetailsDialog';
import FinancialDialog from './components/FinancialDialog';
import StockRadarDialog from './components/StockRadarDialog';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MainView() {
  const { state, actions } = usePortfolioManager();
  const { settings, macroData, finData, assets, dialogs, fontsLoaded, radarData, activeTicker, isLoading } = state;

  const currentTheme = settings.theme === 'light' ? LightTheme : DarkTheme;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Wenn ein Fehler vorliegt, Fallback auf UNKNOWN für den Market-Indicator
  const marketScore = macroData?.error ? null : macroData?.action_summary?.global_ui_score;
  const marketVm = AssetPresenter.getMarketViewModel(marketScore, currentTheme);
  
  const recommendations = radarData?.watchlist_results?.filter(r => r.score >= 8) || [];

  useEffect(() => {
    if (macroData && !macroData.error) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [macroData]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: currentTheme.colors.background },
    toolbar: { 
      height: currentTheme.layout.headerHeight, 
      backgroundColor: currentTheme.colors.background, 
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
      paddingHorizontal: currentTheme.spacing.md, borderBottomWidth: currentTheme.effects.border, borderColor: currentTheme.colors.border 
    },
    refreshBtn: { padding: 4, borderRadius: 20, borderWidth: 1.5, borderColor: currentTheme.colors.warning, marginLeft: 8 },
    sectionLabel: { color: currentTheme.colors.textSubtle, fontSize: 10, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    recommendationCard: {
      backgroundColor: currentTheme.colors.surface, padding: currentTheme.spacing.md, borderRadius: currentTheme.radii.md,
      marginBottom: currentTheme.spacing.md, borderLeftWidth: 4, borderLeftColor: currentTheme.colors.success
    },
    errorBox: {
      backgroundColor: currentTheme.colors.surface,
      borderColor: currentTheme.colors.error,
      borderWidth: 1,
      padding: currentTheme.spacing.md,
      borderRadius: currentTheme.radii.md,
      marginBottom: currentTheme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    fab: { 
      position: 'absolute', bottom: currentTheme.spacing.xl, right: currentTheme.spacing.lg, width: 56, height: 56, 
      borderRadius: 28, backgroundColor: currentTheme.colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 5 
    }
  });

  return (
    <ThemeContext.Provider value={currentTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={currentTheme.dark ? "light-content" : "dark-content"} backgroundColor={currentTheme.colors.background} />

          <View style={styles.toolbar}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: currentTheme.spacing.sm }} onPress={() => actions.toggleDialog('macro', true)}>
              <Animated.View style={[{ width: 12, height: 12, borderRadius: 6, backgroundColor: marketVm.color }, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={{ color: currentTheme.colors.text, fontSize: currentTheme.typography.size.subheading, fontWeight: '500' }}>Market</Text>
              {isLoading && <ActivityIndicator size="small" color={currentTheme.colors.primary} style={{ marginLeft: 8 }} />}
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TouchableOpacity onPress={actions.handleForceRefresh} style={styles.refreshBtn}>
                <Ionicons name="refresh-outline" size={16} color={currentTheme.colors.warning} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => actions.toggleDialog('radar', true)} style={{ padding: 8 }}>
                {fontsLoaded && <Ionicons name="radio-outline" size={currentTheme.layout.icon.md} color={currentTheme.colors.text} />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => actions.toggleDialog('history', true)} style={{ padding: 8 }}>
                {fontsLoaded && <Ionicons name="receipt-outline" size={currentTheme.layout.icon.md} color={currentTheme.colors.text} />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => actions.toggleDialog('settings', true)} style={{ padding: 8 }}>
                {fontsLoaded && <Ionicons name="settings-outline" size={currentTheme.layout.icon.md} color={currentTheme.colors.text} />}
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={{ padding: currentTheme.spacing.md }}>
            
            {/* KI Fehler Feedback Box */}
            {macroData?.error && (
              <View style={styles.errorBox}>
                {fontsLoaded && <Ionicons name="warning" size={24} color={currentTheme.colors.error} />}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: currentTheme.colors.error, fontWeight: 'bold', marginBottom: 4 }}>System-Hinweis</Text>
                  <Text style={{ color: currentTheme.colors.text, fontSize: currentTheme.typography.size.body }}>{macroData.error}</Text>
                </View>
              </View>
            )}

            {recommendations.length > 0 && (
              <View style={{ marginBottom: currentTheme.spacing.sm }}>
                <Text style={styles.sectionLabel}>Top Radar Picks</Text>
                {recommendations.map((rec, i) => (
                  <TouchableOpacity key={i} style={styles.recommendationCard} onPress={() => actions.toggleDialog('radar', true, rec.ticker)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: currentTheme.colors.text, fontWeight: 'bold' }}>{rec.ticker} – {rec.core_reason_short}</Text>
                      <Text style={{ color: currentTheme.colors.success, fontWeight: 'bold' }}>Score: {rec.score}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.sectionLabel}>Your Portfolio</Text>
            {assets.map(asset => (
              <StockItem 
                key={asset.ticker} 
                asset={asset}
                price="..." changePercent="..." trend="up" fontsLoaded={fontsLoaded}
                onDelete={async t => { await AssetRepository.remove(t); actions.refreshAssets(); }}
                onEdit={t => { actions.setEditingAsset(assets.find(a => a.ticker === t)); actions.toggleDialog('addAsset', true); }}
                onInvest={t => actions.toggleDialog('transaction', true, t)}
              />
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.fab} onPress={() => actions.toggleDialog('addAsset', true)}>
            {fontsLoaded && <Ionicons name="add" size={currentTheme.layout.icon.lg} color={currentTheme.colors.onPrimary} />}
          </TouchableOpacity>

          <SettingsDialog visible={dialogs.settings} currentSettings={settings} onClose={() => actions.toggleDialog('settings', false)} onSave={actions.handleUpdateSettings} />
          <AddAssetDialog visible={dialogs.addAsset} initialAsset={state.editingAsset} onClose={() => actions.toggleDialog('addAsset', false)} onSave={actions.handleSaveAsset} />
          <TransactionDialog visible={dialogs.transaction} ticker={state.activeTicker} onClose={() => actions.toggleDialog('transaction', false)} onSave={actions.handleSaveTransaction} />
          <HistoryDialog visible={dialogs.history} onClose={() => actions.toggleDialog('history', false)} />
          {/* Macro Dialog nur öffnen, wenn kein Error vorliegt, sonst crasht der Parser dort eventuell */}
          {!macroData?.error && <MacroDetailsDialog visible={dialogs.macro} data={macroData} onClose={() => actions.toggleDialog('macro', false)} />}
          <FinancialDialog visible={dialogs.finance} initialData={finData} onClose={() => actions.toggleDialog('finance', false)} onSave={actions.handleUpdateFinance} />
          <StockRadarDialog visible={dialogs.radar} radarData={radarData} initialTicker={activeTicker} onClose={() => actions.toggleDialog('radar', false)} onAddAsset={(data) => actions.toggleDialog('addAsset', true, data)} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
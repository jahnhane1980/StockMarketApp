// src/ui/MainView.js - UI Refinement & Dynamic Asset Stats (Full-Body) - Refactoring Step 3 (Final)

import React from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity, Platform, UIManager } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { DarkTheme, LightTheme } from '../theme/Theme';
import { ThemeContext } from '../theme/ThemeContext';
import { usePortfolioManager } from './hooks/usePortfolioManager';
import { AssetRepository } from '../store/AssetRepository';

import SettingsDialog from './components/SettingsDialog';
import AddAssetDialog from './components/AddAssetDialog';
import TransactionDialog from './components/TransactionDialog';
import HistoryDialog from './components/HistoryDialog';
import MacroDetailsDialog from './components/MacroDetailsDialog';
import FinancialDialog from './components/FinancialDialog';
import StockRadarDialog from './components/StockRadarDialog';
import ConfirmRefreshDialog from './components/ConfirmRefreshDialog';
import FinancialDashboard from './components/FinancialDashboard';
import StatisticDialog from './components/StatisticDialog'; // NEU: Import hinzugefügt

// Ausgelagerte Komponenten
import MainToolbar from './components/MainToolbar';
import SystemErrorBox from './components/SystemErrorBox';
import RadarRecommendations from './components/RadarRecommendations';
import PortfolioList from './components/PortfolioList';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MainView() {
  const { state, actions } = usePortfolioManager();
  const { settings, macroData, finData, assets, dialogs, fontsLoaded, radarData, activeTicker, isLoading } = state;

  const currentTheme = settings.theme === 'light' ? LightTheme : DarkTheme;

  const hasT212Credentials = Boolean(settings?.t212Key && settings?.t212Secret);
  
  const totalPortfolioValue = assets.reduce((sum, asset) => {
    const stats = AssetRepository.getPositionStats(asset)?.EUR;
    return sum + (stats?.totalFiat || 0);
  }, 0) + (finData?.currentCash || 0);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: currentTheme.colors.background },
    fab: { 
      position: 'absolute', bottom: currentTheme.spacing.xl, right: currentTheme.spacing.lg, width: 56, height: 56, 
      borderRadius: 28, backgroundColor: currentTheme.colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 5 
    }
  });

  // Alles oberhalb der Liste bündeln wir für den FlatList-Header
  const topSections = (
    <View>
      <SystemErrorBox error={macroData?.error} fontsLoaded={fontsLoaded} />

      <FinancialDashboard 
        portfolioValue={totalPortfolioValue}
        currentCash={finData?.currentCash || 0}
        debtAmount={finData?.debtAmount || 0}
        onPress={() => actions.toggleDialog('finance', true)}
        fontsLoaded={fontsLoaded}
      />

      <RadarRecommendations 
        radarData={radarData} 
        onOpenRadar={(ticker) => actions.toggleDialog('radar', true, ticker)} 
      />
    </View>
  );

  return (
    <ThemeContext.Provider value={currentTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={currentTheme.dark ? "light-content" : "dark-content"} backgroundColor={currentTheme.colors.background} />

          <MainToolbar 
            actions={actions}
            settings={settings}
            macroData={macroData}
            isLoading={isLoading}
            hasT212Credentials={hasT212Credentials}
            fontsLoaded={fontsLoaded}
          />

          <PortfolioList 
            assets={assets}
            fontsLoaded={fontsLoaded}
            ListHeaderComponent={topSections}
            onDeleteAsset={async t => { await AssetRepository.remove(t); actions.refreshAssets(); }}
            onEditAsset={t => { actions.setEditingAsset(assets.find(a => a.ticker === t)); actions.toggleDialog('addAsset', true); }}
            onInvestAsset={t => actions.toggleDialog('transaction', true, t)}
          />

          <TouchableOpacity style={styles.fab} onPress={() => actions.toggleDialog('addAsset', true)}>
            {fontsLoaded && <Ionicons name="add" size={currentTheme.layout.icon.lg} color={currentTheme.colors.onPrimary} />}
          </TouchableOpacity>

          {/* Dialogs */}
          <SettingsDialog visible={dialogs.settings} currentSettings={settings} onClose={() => actions.toggleDialog('settings', false)} onSave={actions.handleUpdateSettings} />
          <AddAssetDialog visible={dialogs.addAsset} initialAsset={state.editingAsset} onClose={() => actions.toggleDialog('addAsset', false)} onSave={actions.handleSaveAsset} />
          <TransactionDialog visible={dialogs.transaction} ticker={state.activeTicker} onClose={() => actions.toggleDialog('transaction', false)} onSave={actions.handleSaveTransaction} />
          <HistoryDialog visible={dialogs.history} onClose={() => actions.toggleDialog('history', false)} />
          {!macroData?.error && <MacroDetailsDialog visible={dialogs.macro} data={macroData} onClose={() => actions.toggleDialog('macro', false)} />}
          <FinancialDialog visible={dialogs.finance} initialData={finData} onClose={() => actions.toggleDialog('finance', false)} onSave={actions.handleUpdateFinance} />
          <StockRadarDialog visible={dialogs.radar} radarData={radarData} initialTicker={activeTicker} onClose={() => actions.toggleDialog('radar', false)} onAddAsset={(data) => actions.toggleDialog('addAsset', true, data)} />
          <ConfirmRefreshDialog visible={dialogs.confirmRefresh} onClose={() => actions.toggleDialog('confirmRefresh', false)} onConfirm={actions.executeForceRefresh} />
          
          {/* NEU: Statistic Dialog */}
          <StatisticDialog visible={dialogs.statistic} assets={assets} onClose={() => actions.toggleDialog('statistic', false)} />
          
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
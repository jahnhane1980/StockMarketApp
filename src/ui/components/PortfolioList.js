// src/ui/components/PortfolioList.js - Performance Update (FlatList) (Full-Body)

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AssetRepository } from '../../store/AssetRepository';
import StockItem from './StockItem';

const PortfolioList = ({ 
  assets, 
  fontsLoaded, 
  onDeleteAsset, 
  onEditAsset, 
  onInvestAsset, 
  ListHeaderComponent 
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    sectionLabel: {
      color: theme.colors.textSubtle,
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 8,
      textTransform: 'uppercase',
      marginTop: theme.spacing.md
    },
    listContainer: {
      padding: theme.spacing.md,
      paddingBottom: 80 // Platz für den FAB freihalten
    }
  });

  const renderItem = ({ item: asset }) => {
    const stats = AssetRepository.getPositionStats(asset)?.EUR;
    const hasPosition = stats && stats.totalShares > 0;

    const displayVal = hasPosition ? `${stats.totalFiat.toFixed(2)} €` : "0.00 €";
    const displaySub = hasPosition
      ? `${stats.totalShares.toFixed(2)} Units | Ø ${stats.avgPrice.toFixed(2)} €`
      : (asset.status === 'WATCH' ? 'Watchlist' : 'Keine Position');

    return (
      <StockItem
        asset={asset}
        price={displayVal}
        changePercent={displaySub}
        trend={hasPosition ? "up" : "neutral"}
        fontsLoaded={fontsLoaded}
        onDelete={onDeleteAsset}
        onEdit={onEditAsset}
        onInvest={onInvestAsset}
      />
    );
  };

  const header = (
    <View>
      {ListHeaderComponent}
      <Text style={styles.sectionLabel}>Your Portfolio</Text>
      {(!assets || assets.length === 0) && (
        <Text style={{ color: theme.colors.textSubtle, marginBottom: theme.spacing.md }}>
          Noch keine Assets vorhanden.
        </Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={assets}
      renderItem={renderItem}
      keyExtractor={(item) => item.ticker}
      ListHeaderComponent={header}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      initialNumToRender={10} // Performance-Tuning
      windowSize={5}          // Performance-Tuning
    />
  );
};

export default PortfolioList;
// components/StockItem.js - Mit Durchschnittspreis-Anzeige

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../Theme';
import { ASSET_STATUS } from '../Constants';
import { AssetRepository } from '../services/AssetRepository';

const StockItem = ({ ticker, price, changePercent, isWarning, isCritical, trend, fontsLoaded, status, onDelete, onEdit, onInvest, transactions }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  // Statistiken berechnen
  const stats = AssetRepository.getPositionStats({ transactions });

  return (
    <TouchableOpacity style={styles.stockItemCard} onPress={toggleExpand} activeOpacity={0.7}>
      <View style={styles.stockRow}>
        <Text style={[styles.stockTicker, isCritical && { color: Theme.colors.statusCritical }, isWarning && { color: Theme.colors.statusAlert }]}>
          {ticker}
        </Text>
        <View style={styles.statusRow}>
          <Text style={styles.stockPrice}>{price}</Text>
          <Text style={[styles.changePercent, (isWarning || isCritical) && { color: isCritical ? Theme.colors.statusCritical : Theme.colors.statusAlert }]}>
            {changePercent} {trend === 'up' ? '↑' : '↓'}
          </Text>
          {fontsLoaded && (isWarning || isCritical) && (
            <Ionicons name={isCritical ? "close-circle-outline" : "warning-outline"} size={Theme.icons.sm} color={isCritical ? Theme.colors.statusCritical : Theme.colors.statusAlert} />
          )}
          {fontsLoaded && <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={Theme.icons.sm} color={Theme.colors.textSubtle} />}
        </View>
      </View>

      {expanded && (
        <View style={styles.detailContainer}>
          <View style={styles.detailGrid}>
            <View>
              <Text style={styles.detailLabel}>Live Price</Text>
              <Text style={styles.detailValue}>{price}</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Avg. Purchase</Text>
              {stats ? Object.keys(stats).map(curr => (
                <Text key={curr} style={styles.detailValue}>
                  {stats[curr].avgPrice.toFixed(2)} {curr === 'EUR' ? '€' : '$'}
                </Text>
              )) : <Text style={styles.detailValue}>---</Text>}
            </View>
          </View>
          
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onEdit && onEdit(ticker)}>
              {fontsLoaded && <Ionicons name="pencil-outline" size={Theme.icons.md} color={Theme.colors.brandPrimary} />}
              <Text style={[styles.actionText, { color: Theme.colors.brandPrimary }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onInvest && onInvest(ticker)}>
              {fontsLoaded && <Ionicons name="swap-vertical-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />}
              <Text style={styles.actionText}>{status === ASSET_STATUS.WATCH ? 'Invest' : 'Trade'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onDelete && onDelete(ticker)}>
              {fontsLoaded && <Ionicons name="trash-outline" size={Theme.icons.md} color={Theme.colors.statusCritical} />}
              <Text style={[styles.actionText, { color: Theme.colors.statusCritical }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stockItemCard: { backgroundColor: Theme.colors.bgSurface, borderRadius: Theme.radii.standard, padding: Theme.spacing.md, borderWidth: Theme.effects.borderWidthThin, borderColor: Theme.colors.borderSubtle, marginBottom: Theme.spacing.sm },
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stockTicker: { fontSize: Theme.typography.size.md, fontWeight: Theme.typography.weight.semibold, color: Theme.colors.textPrimary, width: Theme.layout.tickerWidth },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm },
  stockPrice: { fontSize: Theme.typography.size.sm, color: Theme.colors.textPrimary },
  changePercent: { fontSize: Theme.typography.size.sm, color: Theme.colors.brandPrimary, minWidth: Theme.layout.priceMinWidth, textAlign: 'right' },
  detailContainer: { marginTop: Theme.spacing.md, paddingTop: Theme.spacing.md, borderTopWidth: Theme.effects.borderWidthThin, borderColor: Theme.colors.borderSubtle },
  detailGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Theme.spacing.md },
  detailLabel: { fontSize: Theme.typography.size.xs, color: Theme.colors.textSubtle },
  detailValue: { fontSize: Theme.typography.size.sm, color: Theme.colors.textPrimary, fontWeight: '500' },
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Theme.spacing.sm, borderTopWidth: Theme.effects.borderWidthThin, borderColor: Theme.colors.borderSubtle, paddingTop: Theme.spacing.sm },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.xs },
  actionText: { fontSize: Theme.typography.size.sm, color: Theme.colors.textPrimary }
});

export default React.memo(StockItem);
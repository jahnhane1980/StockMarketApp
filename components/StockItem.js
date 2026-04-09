// components/StockItem.js - Reaktives Theme (Full-Body)

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { ASSET_STATUS } from '../Constants';
import { AssetRepository } from '../services/AssetRepository';

const StockItem = ({ ticker, price, changePercent, isWarning, isCritical, trend, fontsLoaded, status, onDelete, onEdit, onInvest, transactions }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const stats = AssetRepository.getPositionStats({ transactions });

  const dynamicStyles = {
    card: { backgroundColor: theme.colors.bgSurface, borderRadius: theme.radii.standard, borderColor: theme.colors.borderSubtle },
    ticker: { color: theme.colors.textPrimary, fontSize: theme.typography.size.md },
    price: { color: theme.colors.textPrimary, fontSize: theme.typography.size.sm },
    label: { color: theme.colors.textSubtle, fontSize: theme.typography.size.xs },
    value: { color: theme.colors.textPrimary },
    border: { borderColor: theme.colors.borderSubtle }
  };

  return (
    <TouchableOpacity style={[styles.stockItemCard, dynamicStyles.card]} onPress={toggleExpand} activeOpacity={0.7}>
      <View style={styles.stockRow}>
        <Text style={[styles.stockTicker, dynamicStyles.ticker, isCritical && { color: theme.colors.statusCritical }, isWarning && { color: theme.colors.statusAlert }]}>{ticker}</Text>
        <View style={styles.statusRow}>
          <Text style={dynamicStyles.price}>{price}</Text>
          <Text style={[styles.changePercent, { color: isCritical ? theme.colors.statusCritical : (isWarning ? theme.colors.statusAlert : theme.colors.brandPrimary) }]}>
            {changePercent} {trend === 'up' ? '↑' : '↓'}
          </Text>
          {fontsLoaded && isWarning && <Ionicons name="warning-outline" size={16} color={theme.colors.statusAlert} />}
          {fontsLoaded && isCritical && <Ionicons name="close-circle-outline" size={16} color={theme.colors.statusCritical} />}
          {fontsLoaded && <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={theme.colors.textSubtle} />}
        </View>
      </View>

      {expanded && (
        <View style={[styles.detailContainer, dynamicStyles.border]}>
          <View style={styles.detailGrid}>
            <View>
              <Text style={dynamicStyles.label}>Live Price</Text>
              <Text style={dynamicStyles.value}>{price}</Text>
            </View>
            <View>
              <Text style={dynamicStyles.label}>Avg. Purchase</Text>
              {stats ? Object.keys(stats).map(curr => (
                <Text key={curr} style={dynamicStyles.value}>{stats[curr].avgPrice.toFixed(2)} {curr === 'EUR' ? '€' : '$'}</Text>
              )) : <Text style={dynamicStyles.value}>---</Text>}
            </View>
          </View>
          <View style={[styles.actionBar, dynamicStyles.border]}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onEdit && onEdit(ticker)}>
              <Ionicons name="pencil-outline" size={20} color={theme.colors.brandPrimary} />
              <Text style={{ color: theme.colors.brandPrimary }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onInvest && onInvest(ticker)}>
              <Ionicons name="swap-vertical-outline" size={20} color={theme.colors.textPrimary} />
              <Text style={{ color: theme.colors.textPrimary }}>{status === ASSET_STATUS.WATCH ? 'Invest' : 'Trade'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onDelete && onDelete(ticker)}>
              <Ionicons name="trash-outline" size={20} color={theme.colors.statusCritical} />
              <Text style={{ color: theme.colors.statusCritical }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stockItemCard: { padding: 16, borderWidth: 1, marginBottom: 8 },
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stockTicker: { fontWeight: '600', width: 80 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  changePercent: { fontWeight: '500', minWidth: 60, textAlign: 'right' },
  detailContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  detailGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 8, marginTop: 8 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 }
});

export default React.memo(StockItem);
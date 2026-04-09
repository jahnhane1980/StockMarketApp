// src/ui/components/StockItem.js - Status Icons (Full-Body)

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { ASSET_STATUS } from '../../core/Constants';
import { AssetRepository } from '../../store/AssetRepository';
import { AssetPresenter } from '../presenters/AssetPresenter';

const StockItem = ({ asset, price, changePercent, trend, fontsLoaded, onDelete, onEdit, onInvest }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const vm = AssetPresenter.getAssetViewModel(asset, theme);
  const stats = AssetRepository.getPositionStats(asset);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const isOwned = asset.status === ASSET_STATUS.OWNED;

  const dynamicStyles = {
    card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, borderColor: theme.colors.border, borderWidth: theme.effects.border },
    ticker: { color: vm.tickerColor, fontSize: theme.typography.size.subheading, fontWeight: theme.typography.weight.bold },
    price: { color: theme.colors.text, fontSize: theme.typography.size.body },
    actionBar: { borderTopWidth: theme.effects.border, borderColor: theme.colors.border }
  };

  return (
    <TouchableOpacity style={[styles.stockItemCard, dynamicStyles.card]} onPress={toggleExpand} activeOpacity={0.7}>
      <View style={styles.stockRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {fontsLoaded && (
            <Ionicons 
              name={isOwned ? "briefcase-outline" : "eye-outline"} 
              size={14} 
              color={isOwned ? theme.colors.success : theme.colors.textSubtle} 
            />
          )}
          <Text style={dynamicStyles.ticker}>{vm.ticker}</Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={dynamicStyles.price}>{price}</Text>
          <Text style={[styles.changePercent, { color: vm.statusColor }]}>
            {changePercent} {trend === 'up' ? '↑' : '↓'}
          </Text>
          {fontsLoaded && vm.showStatusIcon && (
            <Ionicons name={vm.statusIcon} size={theme.layout.icon.sm} color={vm.statusColor} />
          )}
          {fontsLoaded && <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={theme.layout.icon.sm} color={theme.colors.textSubtle} />}
        </View>
      </View>

      {expanded && (
        <View style={[styles.detailContainer, dynamicStyles.actionBar]}>
          <View style={styles.detailGrid}>
            <View>
              <Text style={{ color: theme.colors.textSubtle, fontSize: 10 }}>Live Price</Text>
              <Text style={{ color: theme.colors.text }}>{price}</Text>
            </View>
            <View>
              <Text style={{ color: theme.colors.textSubtle, fontSize: 10 }}>Avg. Purchase</Text>
              {stats ? Object.keys(stats).map(curr => (
                <Text key={curr} style={{ color: theme.colors.text }}>{stats[curr].avgPrice.toFixed(2)} {curr}</Text>
              )) : <Text style={{ color: theme.colors.text }}>---</Text>}
            </View>
          </View>
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onEdit && onEdit(asset.ticker)}>
              <Ionicons name="pencil-outline" size={16} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.primary }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onInvest && onInvest(asset.ticker)}>
              <Ionicons name="swap-vertical-outline" size={16} color={theme.colors.text} />
              <Text style={{ color: theme.colors.text }}>{isOwned ? 'Trade' : 'Invest'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onDelete && onDelete(asset.ticker)}>
              <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
              <Text style={{ color: theme.colors.error }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stockItemCard: { padding: 16, marginBottom: 8 },
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  changePercent: { fontWeight: '500', minWidth: 60, textAlign: 'right' },
  detailContainer: { marginTop: 16, paddingTop: 16 },
  detailGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, marginTop: 8 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 }
});

export default React.memo(StockItem);
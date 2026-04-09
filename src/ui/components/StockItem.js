// src/ui/components/StockItem.js - Semantic Theme Update (Full-Body)

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { ASSET_STATUS } from '../../core/Constants';
import { AssetRepository } from '../../store/AssetRepository';

const StockItem = ({ ticker, price, changePercent, isWarning, isCritical, trend, fontsLoaded, status, onDelete, onEdit, onInvest, transactions }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const stats = AssetRepository.getPositionStats({ transactions });

  const dynamicStyles = {
    card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, borderColor: theme.colors.border, borderWidth: theme.effects.border },
    ticker: { color: theme.colors.text, fontSize: theme.typography.size.subheading, fontWeight: theme.typography.weight.bold },
    price: { color: theme.colors.text, fontSize: theme.typography.size.body },
    label: { color: theme.colors.textSubtle, fontSize: theme.typography.size.caption },
    value: { color: theme.colors.text, fontWeight: theme.typography.weight.medium },
    actionBar: { borderTopWidth: theme.effects.border, borderColor: theme.colors.border }
  };

  return (
    <TouchableOpacity style={[styles.stockItemCard, dynamicStyles.card]} onPress={toggleExpand} activeOpacity={0.7}>
      <View style={styles.stockRow}>
        <Text style={[dynamicStyles.ticker, isCritical && { color: theme.colors.error }, isWarning && { color: theme.colors.warning }]}>{ticker}</Text>
        <View style={styles.statusRow}>
          <Text style={dynamicStyles.price}>{price}</Text>
          <Text style={[styles.changePercent, { color: isCritical ? theme.colors.error : (isWarning ? theme.colors.warning : theme.colors.primary) }]}>
            {changePercent} {trend === 'up' ? '↑' : '↓'}
          </Text>
          {fontsLoaded && isWarning && <Ionicons name="warning-outline" size={theme.layout.icon.sm} color={theme.colors.warning} />}
          {fontsLoaded && isCritical && <Ionicons name="close-circle-outline" size={theme.layout.icon.sm} color={theme.colors.error} />}
          {fontsLoaded && <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={theme.layout.icon.sm} color={theme.colors.textSubtle} />}
        </View>
      </View>

      {expanded && (
        <View style={[styles.detailContainer, dynamicStyles.actionBar]}>
          <View style={styles.detailGrid}>
            <View>
              <Text style={dynamicStyles.label}>Live Price</Text>
              <Text style={dynamicStyles.value}>{price}</Text>
            </View>
            <View>
              <Text style={dynamicStyles.label}>Avg. Purchase</Text>
              {stats ? Object.keys(stats).map(curr => (
                <Text key={curr} style={dynamicStyles.value}>{stats[curr].avgPrice.toFixed(2)} {curr}</Text>
              )) : <Text style={dynamicStyles.value}>---</Text>}
            </View>
          </View>
          <View style={[styles.actionBar, dynamicStyles.actionBar]}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onEdit && onEdit(ticker)}>
              <Ionicons name="pencil-outline" size={theme.layout.icon.sm} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.primary, fontWeight: theme.typography.weight.medium }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onInvest && onInvest(ticker)}>
              <Ionicons name="swap-vertical-outline" size={theme.layout.icon.sm} color={theme.colors.text} />
              <Text style={{ color: theme.colors.text, fontWeight: theme.typography.weight.medium }}>{status === ASSET_STATUS.WATCH ? 'Invest' : 'Trade'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onDelete && onDelete(ticker)}>
              <Ionicons name="trash-outline" size={theme.layout.icon.sm} color={theme.colors.error} />
              <Text style={{ color: theme.colors.error, fontWeight: theme.typography.weight.medium }}>Delete</Text>
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
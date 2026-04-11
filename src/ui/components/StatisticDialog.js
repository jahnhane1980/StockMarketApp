// src/ui/components/StatisticDialog.js - Profit Statistic View (Full-Body)

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { AssetRepository } from '../../store/AssetRepository';

const StatisticDialog = ({ visible, onClose, assets = [] }) => {
  const theme = useTheme();

  const { listData, totalRealized, totalRealizedPercentage, totalUnrealized, totalUnrealizedPercentage } = useMemo(() => {
    let realizedFiat = 0;
    let unrealizedFiat = 0;
    let totalCostOfSold = 0;
    let totalInvestedForOpen = 0;
    const list = [];
    let hasLivePrices = false;

    assets.forEach(asset => {
      const stats = AssetRepository.getProfitStats(asset, null); 
      
      if (stats && stats.EUR) {
        realizedFiat += (stats.EUR.realizedProfit || 0);
        totalCostOfSold += (stats.EUR.totalCostOfSoldShares || 0);
        
        if (stats.EUR.unrealizedProfit !== null) {
          unrealizedFiat += stats.EUR.unrealizedProfit;
          totalInvestedForOpen += (stats.EUR.totalInvestedForCurrentShares || 0);
          hasLivePrices = true;
        }

        list.push({
          ticker: asset.ticker,
          name: asset.name || asset.ticker,
          realized: stats.EUR.realizedProfit || 0,
          realizedPct: stats.EUR.realizedPercentage || 0,
          unrealized: stats.EUR.unrealizedProfit,
          unrealizedPct: stats.EUR.unrealizedPercentage,
          shares: stats.EUR.totalShares || 0
        });
      }
    });

    list.sort((a, b) => b.realized - a.realized);

    const calcTotalRealizedPct = totalCostOfSold > 0 ? (realizedFiat / totalCostOfSold) * 100 : 0;
    const calcTotalUnrealizedPct = totalInvestedForOpen > 0 ? (unrealizedFiat / totalInvestedForOpen) * 100 : 0;

    return { 
      listData: list, 
      totalRealized: realizedFiat,
      totalRealizedPercentage: calcTotalRealizedPct,
      totalUnrealized: hasLivePrices ? unrealizedFiat : null,
      totalUnrealizedPercentage: hasLivePrices ? calcTotalUnrealizedPct : null
    };
  }, [assets]);

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return 'N/A';
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(2)} €`;
  };

  const formatPercent = (val) => {
    if (val === null || val === undefined) return 'N/A';
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  };

  const getColor = (val) => {
    if (val > 0) return theme.colors.success;
    if (val < 0) return theme.colors.error;
    return theme.colors.text;
  };

  const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    container: { backgroundColor: theme.colors.background, borderTopLeftRadius: theme.radii.lg, borderTopRightRadius: theme.radii.lg, padding: theme.spacing.lg, maxHeight: '90%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl },
    title: { fontSize: theme.typography.size.heading, color: theme.colors.text, fontWeight: 'bold' },
    summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xl, gap: theme.spacing.md },
    summaryCard: { flex: 1, backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
    summaryLabel: { fontSize: theme.typography.size.caption, color: theme.colors.textSubtle, marginBottom: theme.spacing.sm },
    summaryValuePct: { fontSize: theme.typography.size.heading, fontWeight: 'bold' }, // Prozent groß
    summaryValueFiat: { fontSize: theme.typography.size.caption, color: theme.colors.textSubtle, marginTop: 4 }, // Fiat klein drunter
    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    listTicker: { fontSize: theme.typography.size.body, color: theme.colors.text, fontWeight: 'bold' },
    listSub: { fontSize: theme.typography.size.caption, color: theme.colors.textSubtle },
    listValues: { alignItems: 'flex-end' },
    listValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
    listValuePct: { fontSize: theme.typography.size.body, fontWeight: 'bold' },
    listValueFiat: { fontSize: theme.typography.size.caption, color: theme.colors.textSubtle }
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Profit Statistic</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Realized Profit</Text>
              <Text style={[styles.summaryValuePct, { color: getColor(totalRealizedPercentage) }]}>
                {formatPercent(totalRealizedPercentage)}
              </Text>
              <Text style={styles.summaryValueFiat}>
                {formatCurrency(totalRealized)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Unrealized Profit</Text>
              <Text style={[styles.summaryValuePct, { color: getColor(totalUnrealizedPercentage) }]}>
                {totalUnrealizedPercentage !== null ? formatPercent(totalUnrealizedPercentage) : 'N/A'}
              </Text>
              <Text style={styles.summaryValueFiat}>
                {totalUnrealized !== null ? formatCurrency(totalUnrealized) : '-'}
              </Text>
            </View>
          </View>

          <FlatList 
            data={listData}
            keyExtractor={item => item.ticker}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.listTicker}>{item.ticker}</Text>
                  <Text style={styles.listSub}>{item.shares > 0 ? `${item.shares.toFixed(2)} Shares open` : 'Position closed'}</Text>
                </View>
                <View style={styles.listValues}>
                  <View style={styles.listValueRow}>
                    <Text style={[styles.listValuePct, { color: getColor(item.realizedPct) }]}>
                      {formatPercent(item.realizedPct)}
                    </Text>
                    <Text style={styles.listValueFiat}>{formatCurrency(item.realized)} (R)</Text>
                  </View>
                  {item.unrealized !== null && (
                    <View style={styles.listValueRow}>
                      <Text style={[styles.listValuePct, { color: getColor(item.unrealizedPct), fontSize: theme.typography.size.caption }]}>
                        {formatPercent(item.unrealizedPct)}
                      </Text>
                      <Text style={styles.listValueFiat}>{formatCurrency(item.unrealized)} (U)</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

export default StatisticDialog;
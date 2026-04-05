// components/StockItem.js - Kapselt die Darstellung eines einzelnen Aktien-Eintrags

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../Theme';

const StockItem = ({ ticker, price, changePercent, isWarning, isCritical, trend, fontsLoaded }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity 
      style={styles.stockItemCard} 
      onPress={toggleExpand} 
      activeOpacity={0.7}
    >
      <View style={styles.stockRow}>
        <Text style={[
          styles.stockTicker,
          isCritical && { color: Theme.colors.statusCritical },
          isWarning && { color: Theme.colors.statusAlert }
        ]}>
          {ticker}
        </Text>
        
        <View style={styles.statusRow}>
          <Text style={styles.stockPrice}>{price}</Text>
          <Text style={[
            styles.changePercent, 
            isWarning && { color: Theme.colors.statusAlert },
            isCritical && { color: Theme.colors.statusCritical },
          ]}>
            {changePercent} {trend === 'up' ? '↑' : '↓'}
          </Text>
          {fontsLoaded && isWarning && <Ionicons name="warning-outline" size={Theme.icons.sm} color={Theme.colors.statusAlert} />}
          {fontsLoaded && isCritical && <Ionicons name="close-circle-outline" size={Theme.icons.sm} color={Theme.colors.statusCritical} />}
          {fontsLoaded && (
            <Ionicons 
              name={expanded ? "chevron-up" : "chevron-down"} 
              size={Theme.icons.sm} 
              color={Theme.colors.textSubtle} 
            />
          )}
        </View>
      </View>

      {/* --- Detail Ansicht --- */}
      {expanded && (
        <View style={styles.detailContainer}>
          <View style={styles.detailGrid}>
            <View>
              <Text style={styles.detailLabel}>Raill</Text>
              <Text style={styles.detailValue}>38.87</Text>
              <Text style={[styles.detailSubValue, { color: Theme.colors.statusCritical }]}>▼ 0.73%</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>50.30</Text>
              <Text style={[styles.detailSubValue, { color: Theme.colors.statusCritical }]}>▼ 1.90%</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>High</Text>
              <Text style={styles.detailValue}>43.1M</Text>
            </View>
          </View>

          {/* Error Logs */}
          <View style={styles.errorLog}>
            <Text style={styles.errorText}>ERROR: NETWORK CONNECTION TIMEOUT</Text>
            <Text style={styles.errorText}>ERROR: NETWORK CONNECTION TIMEOUT</Text>
            <Text style={styles.errorText}>ERROR: EERORS</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stockItemCard: {
    backgroundColor: Theme.colors.bgSurface, 
    borderRadius: Theme.radii.standard,
    padding: Theme.spacing.md,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stockTicker: {
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.semibold,
    color: Theme.colors.textPrimary,
    width: 80, 
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    justifyContent: 'flex-end',
  },
  stockPrice: { fontSize: Theme.typography.size.sm, color: Theme.colors.textPrimary },
  changePercent: {
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.brandPrimary, 
    fontWeight: Theme.typography.weight.medium,
    minWidth: 60,
    textAlign: 'right',
  },
  detailContainer: {
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    borderTopWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  detailLabel: {
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSubtle,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: Theme.typography.size.sm,
    color: Theme.colors.textPrimary,
    fontWeight: Theme.typography.weight.medium,
  },
  detailSubValue: {
    fontSize: 10,
    marginTop: 2,
  },
  errorLog: {
    marginTop: Theme.spacing.sm,
  },
  errorText: {
    fontSize: 10,
    color: Theme.colors.statusCritical,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
});

// React.memo verhindert Neuladen der Komponente, wenn sich ihre Props nicht ändern
export default React.memo(StockItem);
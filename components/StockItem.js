// components/StockItem.js - Kapselt die Darstellung eines einzelnen Aktien-Eintrags

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../Theme';

const StockItem = ({ ticker, price, changePercent, isWarning, isCritical, trend, fontsLoaded, status, onDelete, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleLongPress = () => {
    Alert.alert(
      `${ticker} Optionen`,
      "Was möchtest du tun?",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Löschen", style: "destructive", onPress: () => onDelete && onDelete(ticker) }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.stockItemCard} 
      onPress={toggleExpand} 
      onLongPress={handleLongPress}
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
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            {/* Edit Button */}
            <TouchableOpacity style={styles.actionButton} onPress={() => onEdit && onEdit(ticker)}>
              {fontsLoaded && <Ionicons name="pencil-outline" size={Theme.icons.md} color={Theme.colors.brandPrimary} />}
              <Text style={[styles.actionText, { color: Theme.colors.brandPrimary }]}>Edit</Text>
            </TouchableOpacity>

            {/* Context-Button (Wir rufen hier der Einfachheit halber auch onEdit auf, da es den gleichen Dialog öffnet) */}
            {status === 'WATCH' ? (
              <TouchableOpacity style={styles.actionButton} onPress={() => onEdit && onEdit(ticker)}>
                {fontsLoaded && <Ionicons name="cash-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />}
                <Text style={styles.actionText}>Invest</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.actionButton} onPress={() => onEdit && onEdit(ticker)}>
                {fontsLoaded && <Ionicons name="swap-vertical-outline" size={Theme.icons.md} color={Theme.colors.textPrimary} />}
                <Text style={styles.actionText}>Trade</Text>
              </TouchableOpacity>
            )}

            {/* Delete Button */}
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
    marginBottom: Theme.spacing.md,
  },
  errorText: {
    fontSize: 10,
    color: Theme.colors.statusCritical,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
    paddingTop: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  actionText: {
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textPrimary,
    fontWeight: Theme.typography.weight.medium,
  }
});

export default React.memo(StockItem);
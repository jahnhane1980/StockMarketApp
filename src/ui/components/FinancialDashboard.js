// src/ui/components/FinancialDashboard.js - Neu erstellt (Full-Body)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const FinancialDashboard = ({ portfolioValue, currentCash, debtAmount, onPress, fontsLoaded }) => {
  const theme = useTheme();

  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      borderColor: theme.colors.border,
      borderWidth: theme.effects.border,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      color: theme.colors.textSubtle,
      fontSize: theme.typography.size.caption,
      fontWeight: theme.typography.weight.bold,
      textTransform: 'uppercase',
    },
    totalValue: {
      color: theme.colors.text,
      fontSize: theme.typography.size.display,
      fontWeight: theme.typography.weight.bold,
    },
    metricsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: theme.effects.border,
      borderColor: theme.colors.border,
      paddingTop: theme.spacing.sm,
    },
    metricBox: {
      flex: 1,
    },
    metricLabel: {
      color: theme.colors.textSubtle,
      fontSize: theme.typography.size.caption,
      marginBottom: 2,
    },
    metricValue: {
      color: theme.colors.text,
      fontSize: theme.typography.size.body,
      fontWeight: theme.typography.weight.bold,
    },
    debtValue: {
      color: debtAmount > 0 ? theme.colors.error : theme.colors.text,
      fontSize: theme.typography.size.body,
      fontWeight: theme.typography.weight.bold,
    }
  });

  return (
    <TouchableOpacity style={dynamicStyles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={dynamicStyles.headerRow}>
        <View>
          <Text style={dynamicStyles.title}>Portfolio Wert</Text>
          <Text style={dynamicStyles.totalValue}>{portfolioValue.toFixed(2)} €</Text>
        </View>
        {fontsLoaded && (
          <Ionicons name="wallet-outline" size={32} color={theme.colors.primary} />
        )}
      </View>

      <View style={dynamicStyles.metricsRow}>
        <View style={dynamicStyles.metricBox}>
          <Text style={dynamicStyles.metricLabel}>Cash (EK)</Text>
          <Text style={dynamicStyles.metricValue}>{currentCash.toFixed(2)} €</Text>
        </View>
        <View style={[dynamicStyles.metricBox, { alignItems: 'flex-end' }]}>
          <Text style={dynamicStyles.metricLabel}>Fremdkapital (FK)</Text>
          <Text style={dynamicStyles.debtValue}>{debtAmount.toFixed(2)} €</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FinancialDashboard;
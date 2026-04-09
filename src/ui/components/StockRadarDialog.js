// src/ui/components/StockRadarDialog.js - Jump-to-Ticker Logic (Full-Body)

import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AssetPresenter } from '../presenters/AssetPresenter';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import { Ionicons } from '@expo/vector-icons';

const StockRadarDialog = ({ visible, onClose, radarData, onAddAsset, initialTicker }) => {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const itemPositions = useRef({});

  useEffect(() => {
    if (visible && initialTicker) {
      const timer = setTimeout(() => {
        const yPos = itemPositions.current[initialTicker];
        if (yPos !== undefined) {
          scrollRef.current?.scrollTo({ y: yPos, animated: true });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [visible, initialTicker]);

  const dynamicStyles = StyleSheet.create({
    configHeader: { marginBottom: theme.spacing.md, alignItems: 'center' },
    card: { 
      padding: theme.spacing.md, marginBottom: theme.layout.standardGap,
      backgroundColor: theme.colors.surface, borderColor: theme.colors.border, 
      borderWidth: theme.effects.border, borderRadius: theme.radii.md 
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.sm },
    ticker: { fontSize: theme.typography.size.subheading, fontWeight: theme.typography.weight.bold, color: theme.colors.text },
    matchLabel: { color: theme.colors.primary, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold },
    badge: (bgColor) => ({ 
      width: theme.layout.icon.lg, height: theme.layout.icon.lg, borderRadius: theme.radii.full, 
      justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor
    }),
    addButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.xs, borderRadius: theme.radii.sm },
    reasonShort: { fontWeight: theme.typography.weight.bold, fontSize: theme.typography.size.body, marginBottom: theme.spacing.xs, color: theme.colors.text },
    reasonLong: { fontSize: theme.typography.size.body, lineHeight: theme.typography.size.body + 4, marginBottom: theme.spacing.md, color: theme.colors.textSubtle },
    zoneContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: theme.spacing.sm, borderTopWidth: theme.effects.border, borderColor: theme.colors.border },
    zoneLabel: { fontSize: theme.typography.size.caption, color: theme.colors.textSubtle, textTransform: 'uppercase', marginBottom: 2 },
    zoneValue: { fontSize: theme.typography.size.body, fontWeight: theme.typography.weight.medium }
  });

  const RadarItem = ({ item }) => {
    const statusVm = AssetPresenter.getMarketViewModel(item.score, theme);
    
    return (
      <View 
        style={dynamicStyles.card}
        onLayout={(e) => {
          itemPositions.current[item.ticker] = e.nativeEvent.layout.y;
        }}
      >
        <View style={dynamicStyles.header}>
          <View style={{ flex: 1 }}>
            <Text style={dynamicStyles.ticker}>{item.ticker}</Text>
            <Text style={dynamicStyles.matchLabel}>LIKE {item.match}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <View style={dynamicStyles.badge(statusVm.color)}>
              <Text style={{ color: theme.colors.onPrimary, fontWeight: theme.typography.weight.bold }}>{item.score}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => onAddAsset({ ticker: item.ticker, status: 'WATCH', type: 'A' })}
              style={dynamicStyles.addButton}
            >
              <Ionicons name="add" size={theme.layout.icon.sm} color={theme.colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={dynamicStyles.reasonShort}>{item.core_reason_short}</Text>
        <Text style={dynamicStyles.reasonLong}>{item.core_reason_long}</Text>

        <View style={dynamicStyles.zoneContainer}>
          <View>
            <Text style={dynamicStyles.zoneLabel}>Interessant</Text>
            {/* FIX: Sicherheitsprüfung für .toFixed() */}
            <Text style={[dynamicStyles.zoneValue, { color: theme.colors.text }]}>
              {item.zones?.interessant ? item.zones.interessant.toFixed(2) : '---'} $
            </Text>
          </View>
          <View>
            <Text style={dynamicStyles.zoneLabel}>Verführerisch</Text>
            {/* FIX: Sicherheitsprüfung für .toFixed() */}
            <Text style={[dynamicStyles.zoneValue, { color: theme.colors.success }]}>
              {item.zones?.verfuehrerisch ? item.zones.verfuehrerisch.toFixed(2) : '---'} $
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={dynamicStyles.zoneLabel}>Aktuell</Text>
            {/* FIX: Sicherheitsprüfung für .toFixed() */}
            <Text style={[dynamicStyles.zoneValue, { color: theme.colors.text, fontWeight: theme.typography.weight.bold }]}>
              {item.price_usd ? item.price_usd.toFixed(2) : '---'} $
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ThemedDialog 
      visible={visible} 
      onClose={onClose} 
      title="Stock Radar" 
      footer={<ThemedButton title="Schließen" onPress={onClose} />}
    >
      <View style={{ maxHeight: 450 }}> 
        <ScrollView 
          ref={scrollRef}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        >
          {radarData?.monitoring_config && (
            <View style={dynamicStyles.configHeader}>
              <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption }}>
                Mode: {radarData.monitoring_config.discovery_mode} | Scan: {radarData.monitoring_config.last_full_scan}
              </Text>
            </View>
          )}
          
          {!radarData ? (
            <Text style={{ color: theme.colors.text, textAlign: 'center', marginTop: theme.spacing.lg }}>Lade Radar-Daten...</Text>
          ) : (
            radarData.watchlist_results.map((item) => (
              <RadarItem key={item.ticker} item={item} />
            ))
          )}
        </ScrollView>
      </View>
    </ThemedDialog>
  );
};

export default StockRadarDialog;
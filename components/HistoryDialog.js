// components/HistoryDialog.js - 100% Theme-basiert (Full-Body)

import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  SectionList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { AssetRepository } from '../services/AssetRepository';
import { ACTIONS } from '../Constants';

const HistoryDialog = ({ visible, onClose }) => {
  const theme = useTheme();
  const [sections, setSections] = useState([]);
  const [filter, setFilter] = useState('');

  const loadHistory = useCallback(async () => {
    try {
      const active = await AssetRepository.getAll();
      const archived = await AssetRepository.getArchived();
      let allTx = [];

      [...active, ...archived].forEach(asset => {
        if (asset.transactions) {
          asset.transactions.forEach(tx => {
            allTx.push({ ...tx, ticker: asset.ticker });
          });
        }
      });

      if (filter) {
        allTx = allTx.filter(tx => 
          tx.ticker.toLowerCase().includes(filter.toLowerCase())
        );
      }

      allTx.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

      const groups = {};
      allTx.forEach(tx => {
        const date = new Date(tx.recordedAt);
        const key = `${date.toLocaleString('de-DE', { month: 'long' })} ${date.getFullYear()}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(tx);
      });

      const sectionData = Object.keys(groups).map(key => ({
        title: key,
        data: groups[key]
      }));

      setSections(sectionData);
    } catch (e) {
      if (global.log) log.error("HistoryDialog: Fehler beim Laden", e);
    }
  }, [filter]);

  useEffect(() => {
    if (visible) loadHistory();
  }, [visible, loadHistory]);

  const dynamicStyles = {
    container: { backgroundColor: theme.colors.bgMain },
    header: { borderColor: theme.colors.borderSubtle, padding: theme.spacing.md, borderBottomWidth: theme.effects.borderWidthThin },
    title: { color: theme.colors.textPrimary, fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.bold },
    search: { 
      backgroundColor: theme.colors.bgSurface, 
      color: theme.colors.textPrimary, 
      padding: theme.spacing.md,
      margin: theme.spacing.md,
      fontSize: theme.typography.size.md,
      borderRadius: theme.radii.standard
    },
    sectionHeader: { 
      backgroundColor: theme.colors.bgSurface, 
      color: theme.colors.textSubtle, 
      padding: theme.spacing.xs, 
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.size.xxs,
      fontWeight: theme.typography.weight.bold
    },
    row: { 
      borderColor: theme.colors.borderSubtle, 
      padding: theme.spacing.md, 
      borderBottomWidth: theme.effects.borderWidthThin 
    },
    tickerText: { color: theme.colors.textPrimary, fontSize: theme.typography.size.md, fontWeight: theme.typography.weight.bold },
    subText: { color: theme.colors.textSubtle, fontSize: theme.typography.size.xs }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={dynamicStyles.title}>Transaktions-Historie</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: theme.colors.brandPrimary, fontWeight: theme.typography.weight.medium }}>Schließen</Text>
          </TouchableOpacity>
        </View>

        <TextInput 
          style={dynamicStyles.search} 
          placeholder="Ticker filtern..." 
          placeholderTextColor={theme.colors.textSubtle}
          value={filter}
          onChangeText={setFilter}
          autoCapitalize="characters"
        />

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: dynamicStyles.sectionHeader.backgroundColor, padding: dynamicStyles.sectionHeader.padding, paddingHorizontal: dynamicStyles.sectionHeader.paddingHorizontal }}>
              <Text style={{ color: dynamicStyles.sectionHeader.color, fontSize: dynamicStyles.sectionHeader.fontSize, fontWeight: dynamicStyles.sectionHeader.fontWeight, textTransform: 'uppercase' }}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={dynamicStyles.row}>
              <View>
                <Text style={dynamicStyles.tickerText}>{item.ticker}</Text>
                <Text style={dynamicStyles.subText}>{item.userTimestamp || '---'}</Text>
              </View>
              <View style={styles.txValues}>
                <Text style={{ 
                  fontSize: theme.typography.size.xs, 
                  fontWeight: theme.typography.weight.bold, 
                  marginBottom: 2,
                  color: item.action === ACTIONS.BUY ? theme.colors.brandPrimary : theme.colors.statusCritical 
                }}>
                  {item.action}
                </Text>
                <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm }}>
                  {item.totalFiat.toFixed(2)} {item.currency}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, dynamicStyles.subText, { marginTop: theme.spacing.xl }]}>Keine Transaktionen gefunden.</Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txValues: { alignItems: 'flex-end' },
  emptyText: { textAlign: 'center' }
});

export default HistoryDialog;
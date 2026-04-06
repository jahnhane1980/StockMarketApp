// components/HistoryDialog.js - Transaktionshistorie mit Gruppierung und Filter

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
import { Theme } from '../Theme';
import { AssetRepository } from '../services/AssetRepository';
import { ACTIONS } from '../Constants';

const HistoryDialog = ({ visible, onClose }) => {
  const [sections, setSections] = useState([]);
  const [filter, setFilter] = useState('');

  // Fix: loadHistory in useCallback eingekapselt
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
      if (global.log) log.error("HistoryDialog: Fehler beim Laden der Historie", e);
    }
  }, [filter]); // Abhängigkeit auf filter

  useEffect(() => {
    if (visible) {
      loadHistory();
    }
  }, [visible, loadHistory]); // Fix: loadHistory hier als Abhängigkeit möglich

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transaktions-Historie</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Schließen</Text>
          </TouchableOpacity>
        </View>

        <TextInput 
          style={styles.searchBar} 
          placeholder="Ticker filtern..." 
          placeholderTextColor={Theme.colors.textSubtle}
          value={filter}
          onChangeText={setFilter}
          autoCapitalize="characters"
        />

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderBg}>
              <Text style={styles.sectionHeader}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.txRow}>
              <View>
                <Text style={styles.txTicker}>{item.ticker}</Text>
                <Text style={styles.txDate}>{item.userTimestamp || '---'}</Text>
              </View>
              <View style={styles.txValues}>
                <Text style={[
                  styles.txAction, 
                  { color: item.action === ACTIONS.BUY ? Theme.colors.brandPrimary : Theme.colors.statusCritical }
                ]}>
                  {item.action}
                </Text>
                <Text style={styles.txAmount}>
                  {item.totalFiat.toFixed(2)} {item.currency}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Keine Transaktionen gefunden.</Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgMain },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle
  },
  title: { 
    color: Theme.colors.textPrimary, 
    fontSize: Theme.typography.size.lg, 
    fontWeight: Theme.typography.weight.bold 
  },
  closeText: { color: Theme.colors.brandPrimary, fontWeight: Theme.typography.weight.medium },
  searchBar: { 
    backgroundColor: Theme.colors.bgSurface, 
    color: Theme.colors.textPrimary, 
    padding: Theme.spacing.sm, 
    borderRadius: Theme.radii.standard, 
    margin: Theme.spacing.md,
    fontSize: Theme.typography.size.md
  },
  sectionHeaderBg: { backgroundColor: Theme.colors.bgSurface, padding: Theme.spacing.xs, paddingHorizontal: Theme.spacing.md },
  sectionHeader: { 
    color: Theme.colors.textSubtle, 
    fontSize: Theme.typography.size.xs, 
    textTransform: 'uppercase',
    fontWeight: Theme.typography.weight.bold
  },
  txRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: Theme.spacing.md, 
    borderBottomWidth: Theme.effects.borderWidthThin, 
    borderColor: Theme.colors.borderSubtle 
  },
  txTicker: { 
    color: Theme.colors.textPrimary, 
    fontSize: Theme.typography.size.md, 
    fontWeight: Theme.typography.weight.bold 
  },
  txDate: { color: Theme.colors.textSubtle, fontSize: Theme.typography.size.xs, marginTop: 2 },
  txValues: { alignItems: 'flex-end' },
  txAction: { fontSize: Theme.typography.size.xs, fontWeight: Theme.typography.weight.bold, marginBottom: 2 },
  txAmount: { color: Theme.colors.textPrimary, fontSize: Theme.typography.size.sm },
  emptyText: { color: Theme.colors.textSubtle, textAlign: 'center', marginTop: Theme.spacing.xl }
});

export default HistoryDialog;
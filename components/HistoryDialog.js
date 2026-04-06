// components/HistoryDialog.js - Reaktives Theme (Full-Body)

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
    header: { borderColor: theme.colors.borderSubtle },
    title: { color: theme.colors.textPrimary },
    search: { backgroundColor: theme.colors.bgSurface, color: theme.colors.textPrimary },
    sectionHeader: { backgroundColor: theme.colors.bgSurface, color: theme.colors.textSubtle },
    row: { borderColor: theme.colors.borderSubtle, color: theme.colors.textPrimary },
    subText: { color: theme.colors.textSubtle }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={[styles.title, dynamicStyles.title]}>Transaktions-Historie</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: theme.colors.brandPrimary, fontWeight: '500' }}>Schließen</Text>
          </TouchableOpacity>
        </View>

        <TextInput 
          style={[styles.searchBar, dynamicStyles.search]} 
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
            <View style={[styles.sectionHeaderBg, { backgroundColor: theme.colors.bgSurface }]}>
              <Text style={[styles.sectionHeader, { color: theme.colors.textSubtle }]}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={[styles.txRow, { borderColor: theme.colors.borderSubtle }]}>
              <View>
                <Text style={[styles.txTicker, { color: theme.colors.textPrimary }]}>{item.ticker}</Text>
                <Text style={[styles.txDate, dynamicStyles.subText]}>{item.userTimestamp || '---'}</Text>
              </View>
              <View style={styles.txValues}>
                <Text style={[
                  styles.txAction, 
                  { color: item.action === ACTIONS.BUY ? theme.colors.brandPrimary : theme.colors.statusCritical }
                ]}>
                  {item.action}
                </Text>
                <Text style={[styles.txAmount, { color: theme.colors.textPrimary }]}>
                  {item.totalFiat.toFixed(2)} {item.currency}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, dynamicStyles.subText]}>Keine Transaktionen gefunden.</Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  searchBar: { padding: 12, borderRadius: 6, margin: 16, fontSize: 16 },
  sectionHeaderBg: { padding: 4, paddingHorizontal: 16 },
  sectionHeader: { fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  txTicker: { fontSize: 16, fontWeight: 'bold' },
  txDate: { fontSize: 12, marginTop: 2 },
  txValues: { alignItems: 'flex-end' },
  txAction: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  txAmount: { fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 32 }
});

export default HistoryDialog;
// components/HistoryDialog.js - UI Atom Refactor

import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Text, SectionList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../ThemeContext';
import { AssetRepository } from '../services/AssetRepository';
import { ACTIONS } from '../Constants';
import ThemedInput from './common/ThemedInput'; // Shared Input

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
        allTx = allTx.filter(tx => tx.ticker.toLowerCase().includes(filter.toLowerCase()));
      }
      allTx.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
      const groups = {};
      allTx.forEach(tx => {
        const date = new Date(tx.recordedAt);
        const key = `${date.toLocaleString('de-DE', { month: 'long' })} ${date.getFullYear()}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(tx);
      });
      setSections(Object.keys(groups).map(key => ({ title: key, data: groups[key] })));
    } catch (e) { if (global.log) log.error("History: Load error", e); }
  }, [filter]);

  useEffect(() => { if (visible) loadHistory(); }, [visible, loadHistory]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bgMain }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, borderBottomWidth: theme.effects.borderWidthThin, borderColor: theme.colors.borderSubtle }}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.bold }}>Transaktions-Historie</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: theme.colors.brandPrimary, fontWeight: theme.typography.weight.medium }}>Schließen</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md }}>
          <ThemedInput 
            placeholder="Ticker filtern..." 
            value={filter} 
            onChangeText={setFilter} 
          />
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: theme.colors.bgSurface, padding: theme.spacing.xs, paddingHorizontal: theme.spacing.md }}>
              <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.xxs, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase' }}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: theme.spacing.md, borderBottomWidth: theme.effects.borderWidthThin, borderColor: theme.colors.borderSubtle }}>
              <View>
                <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.md, fontWeight: theme.typography.weight.bold }}>{item.ticker}</Text>
                <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.xs }}>{item.userTimestamp || '---'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.bold, marginBottom: 2, color: item.action === ACTIONS.BUY ? theme.colors.brandPrimary : theme.colors.statusCritical }}>{item.action}</Text>
                <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm }}>{item.totalFiat.toFixed(2)} {item.currency}</Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default HistoryDialog;
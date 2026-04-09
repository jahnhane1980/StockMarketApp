// src/ui/components/HistoryDialog.js - Semantisches Refactoring (Full-Body)

import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Text, SectionList, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AssetRepository } from '../../store/AssetRepository';
import { ACTIONS } from '../../core/Constants';
import ThemedInput from '../common/ThemedInput';

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

  const dynamicStyles = {
    header: { 
      padding: theme.spacing.md, 
      borderBottomWidth: theme.effects.border, 
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background 
    },
    sectionHeader: { 
      backgroundColor: theme.colors.surface, 
      paddingVertical: theme.spacing.xs, 
      paddingHorizontal: theme.spacing.md 
    },
    row: { 
      padding: theme.spacing.md, 
      borderBottomWidth: theme.effects.border, 
      borderColor: theme.colors.border 
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.subheading, fontWeight: theme.typography.weight.bold }}>Historie</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: theme.colors.primary, fontWeight: theme.typography.weight.medium }}>Schließen</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: theme.spacing.md }}>
          <ThemedInput placeholder="Ticker filtern..." value={filter} onChangeText={setFilter} />
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({ section: { title } }) => (
            <View style={dynamicStyles.sectionHeader}>
              <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase' }}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={[styles.row, dynamicStyles.row]}>
              <View>
                <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.body, fontWeight: theme.typography.weight.bold }}>{item.ticker}</Text>
                <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption }}>{item.userTimestamp || '---'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ 
                  fontSize: theme.typography.size.caption, 
                  fontWeight: theme.typography.weight.bold, 
                  color: item.action === ACTIONS.BUY ? theme.colors.primary : theme.colors.error 
                }}>{item.action}</Text>
                <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.body }}>{item.totalFiat.toFixed(2)} {item.currency}</Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});

export default HistoryDialog;
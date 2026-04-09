// src/ui/components/HistoryDialog.js - Refactored with Transformer (Full-Body)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AssetRepository } from '../../store/AssetRepository';
import { ACTIONS } from '../../core/Constants';
import { TransactionTransformer } from '../../core/TransactionTransformer';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';

const HistoryDialog = ({ visible, onClose }) => {
  const theme = useTheme();
  const [sections, setSections] = useState([]);
  const [filter, setFilter] = useState('');

  const loadHistoryData = useCallback(async () => {
    try {
      const [active, archived] = await Promise.all([
        AssetRepository.getAll(),
        AssetRepository.getArchived()
      ]);
      
      // Die Logik liegt jetzt komplett im Transformer
      const groupedData = TransactionTransformer.getGroupedHistory(active, archived, filter);
      setSections(groupedData);
    } catch (e) {
      if (global.log) global.log.error("HistoryDialog: Fehler beim Transformieren", e);
    }
  }, [filter]);

  useEffect(() => {
    if (visible) loadHistoryData();
  }, [visible, loadHistoryData]);

  const renderItem = ({ item }) => (
    <View style={[styles.row, { borderBottomColor: theme.colors.border, borderBottomWidth: theme.effects.border }]}>
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
  );

  return (
    <ThemedDialog 
      visible={visible} 
      onClose={onClose} 
      title="Transaktions-Historie"
      footer={<ThemedButton title="Schließen" onPress={onClose} />}
    >
      <View style={{ maxHeight: 500 }}>
        <ThemedInput 
          placeholder="Ticker filtern..." 
          value={filter} 
          onChangeText={setFilter} 
        />
        
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: theme.colors.surface, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 }}>
              <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold }}>{title}</Text>
            </View>
          )}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ThemedDialog>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }
});

export default HistoryDialog;
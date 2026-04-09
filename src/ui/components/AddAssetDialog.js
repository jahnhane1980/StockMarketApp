// src/ui/components/AddAssetDialog.js - Refactored with extended labels (Full-Body)

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { ASSET_STATUS, ASSET_TYPES } from '../../core/Constants';
import { InputUtils } from '../../core/InputUtils';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';

const AddAssetDialog = ({ visible, onClose, onSave, initialAsset }) => {
  const theme = useTheme();
  const [ticker, setTicker] = useState('');
  const [status, setStatus] = useState(ASSET_STATUS.WATCH);
  const [type, setType] = useState('A');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      setTicker(initialAsset?.ticker || '');
      setStatus(initialAsset?.status || ASSET_STATUS.WATCH);
      setType(initialAsset?.type || 'A');
      setError(null);
    }
  }, [visible, initialAsset]);

  const handleSave = () => {
    const validationError = InputUtils.validateRequired(ticker, "Ticker / Symbol");
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave({ 
      ticker: InputUtils.formatTickerSymbol(ticker), 
      status, 
      type 
    });
  };

  const SelectionChip = ({ label, value, current, onChange }) => {
    const isSelected = current === value;
    return (
      <TouchableOpacity
        style={[
          styles.chip,
          { 
            borderColor: theme.colors.border, 
            borderWidth: theme.effects.border, 
            borderRadius: theme.radii.md, 
            paddingVertical: theme.spacing.sm,
            backgroundColor: isSelected ? theme.colors.primary : 'transparent'
          }, 
          isSelected && { borderColor: theme.colors.primary }
        ]}
        onPress={() => onChange(value)}
      >
        <Text style={{ 
          fontSize: theme.typography.size.caption,
          color: isSelected ? theme.colors.onPrimary : theme.colors.textSubtle, 
          fontWeight: isSelected ? theme.typography.weight.bold : theme.typography.weight.regular,
          textAlign: 'center'
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton title="Asset speichern" onPress={handleSave} />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog 
      visible={visible} 
      onClose={onClose} 
      title={initialAsset ? 'Asset bearbeiten' : 'Neues Asset'} 
      footer={footer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedInput 
          label="Ticker / Symbol" 
          value={ticker} 
          onChangeText={(v) => { setTicker(v); setError(null); }} 
          editable={!initialAsset} 
          errorMessage={error}
          placeholder="z.B. AAPL"
          style={!!initialAsset && { opacity: theme.effects.opacityDisabled }}
        />
        
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={styles.sectionLabel(theme)}>Status</Text>
          <View style={styles.row}>
            <SelectionChip label="Watch" value={ASSET_STATUS.WATCH} current={status} onChange={setStatus} />
            <SelectionChip label="Portfolio" value={ASSET_STATUS.OWNED} current={status} onChange={setStatus} />
          </View>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={styles.sectionLabel(theme)}>Kategorie</Text>
          <View style={styles.column}>
            <View style={styles.row}>
              <SelectionChip label={ASSET_TYPES.A.label} value="A" current={type} onChange={setType} />
              <SelectionChip label={ASSET_TYPES.B.label} value="B" current={type} onChange={setType} />
            </View>
            <View style={styles.row}>
              <SelectionChip label={ASSET_TYPES.C.label} value="C" current={type} onChange={setType} />
              <SelectionChip label={ASSET_TYPES.D.label} value="D" current={type} onChange={setType} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedDialog>
  );
};

const styles = StyleSheet.create({
  sectionLabel: (theme) => ({
    color: theme.colors.textSubtle, 
    fontSize: theme.typography.size.caption, 
    marginBottom: theme.spacing.xs,
    fontWeight: '500'
  }),
  row: { flexDirection: 'row', gap: 8 },
  column: { flexDirection: 'column', gap: 8 },
  chip: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }
});

export default AddAssetDialog;
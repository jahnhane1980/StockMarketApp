// src/ui/components/AddAssetDialog.js - Semantic Refactor (Full-Body)

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { ASSET_STATUS, ASSET_TYPES } from '../../core/Constants';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';

const AddAssetDialog = ({ visible, onClose, onSave, initialAsset }) => {
  const theme = useTheme();
  const [ticker, setTicker] = useState('');
  const [status, setStatus] = useState(ASSET_STATUS.WATCH);
  const [type, setType] = useState(ASSET_TYPES.A);

  useEffect(() => {
    if (visible) {
      setTicker(initialAsset?.ticker || '');
      setStatus(initialAsset?.status || ASSET_STATUS.WATCH);
      setType(initialAsset?.type || ASSET_TYPES.A);
    }
  }, [visible, initialAsset]);

  const SelectionChip = ({ label, value, current, onChange }) => {
    const isSelected = current === value;
    return (
      <TouchableOpacity
        style={[
          { 
            borderColor: theme.colors.border, 
            borderWidth: theme.effects.border, 
            borderRadius: theme.radii.md, 
            paddingVertical: theme.spacing.sm,
            flex: 1,
            alignItems: 'center'
          }, 
          isSelected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
        ]}
        onPress={() => onChange(value)}
      >
        <Text style={{ 
          fontSize: theme.typography.size.body,
          color: isSelected ? theme.colors.onPrimary : theme.colors.textSubtle, 
          fontWeight: isSelected ? theme.typography.weight.bold : theme.typography.weight.regular 
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton 
        title="Asset speichern" 
        onPress={() => ticker.trim() && onSave({ ticker: ticker.toUpperCase(), status, type })} 
      />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog 
      visible={visible} 
      onClose={onClose} 
      title={initialAsset ? 'Bearbeiten' : 'Neu hinzufügen'} 
      footer={footer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedInput 
          label="Ticker / Symbol" 
          value={ticker} 
          onChangeText={setTicker} 
          editable={!initialAsset} 
          style={!!initialAsset && { opacity: theme.effects.opacityDisabled }}
        />
        
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, marginBottom: theme.spacing.xs }}>Status</Text>
          <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
            <SelectionChip label="Watch" value={ASSET_STATUS.WATCH} current={status} onChange={setStatus} />
            <SelectionChip label="Portfolio" value={ASSET_STATUS.OWNED} current={status} onChange={setStatus} />
          </View>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, marginBottom: theme.spacing.xs }}>Kategorie</Text>
          <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
            <SelectionChip label="A" value={ASSET_TYPES.A} current={type} onChange={setType} />
            <SelectionChip label="B" value={ASSET_TYPES.B} current={type} onChange={setType} />
            <SelectionChip label="C" value={ASSET_TYPES.C} current={type} onChange={setType} />
            <SelectionChip label="D" value={ASSET_TYPES.D} current={type} onChange={setType} />
          </View>
        </View>
      </ScrollView>
    </ThemedDialog>
  );
};

export default AddAssetDialog;
// components/AddAssetDialog.js - Refactored with Shared Components

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';
import { ASSET_STATUS, ASSET_TYPES } from '../Constants';
import ThemedDialog from './common/ThemedDialog';
import ThemedButton from './common/ThemedButton';
import ThemedInput from './common/ThemedInput';

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
            borderColor: theme.colors.borderSubtle, 
            borderWidth: theme.effects.borderWidthThin, 
            borderRadius: theme.radii.standard, 
            paddingVertical: theme.spacing.sm,
            flex: 1,
            alignItems: 'center'
          }, 
          isSelected && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }
        ]}
        onPress={() => onChange(value)}
      >
        <Text style={{ 
          fontSize: theme.typography.size.sm,
          color: isSelected ? theme.colors.textOnPrimary : theme.colors.textSubtle, 
          fontWeight: isSelected ? theme.typography.weight.bold : theme.typography.weight.normal 
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSave = () => {
    if (!ticker.trim()) return;
    onSave({ ticker: ticker.toUpperCase(), status, type });
  };

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton title="Asset speichern" onPress={handleSave} type="primary" />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title={initialAsset ? 'Basisdaten bearbeiten' : 'Neues Asset hinzufügen'} footer={footer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedInput 
          label="Ticker / Symbol" 
          value={ticker} 
          onChangeText={setTicker} 
          editable={!initialAsset} 
          style={!!initialAsset && { opacity: theme.effects.opacityDisabled }}
        />
        
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.sm, marginBottom: theme.spacing.xs }}>Status</Text>
          <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
            <SelectionChip label="Beobachten" value={ASSET_STATUS.WATCH} current={status} onChange={setStatus} />
            <SelectionChip label="Portfolio" value={ASSET_STATUS.OWNED} current={status} onChange={setStatus} />
          </View>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.sm, marginBottom: theme.spacing.xs }}>Asset Typ</Text>
          <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
            <SelectionChip label="A (Growth)" value={ASSET_TYPES.A} current={type} onChange={setType} />
            <SelectionChip label="B (Mega)" value={ASSET_TYPES.B} current={type} onChange={setType} />
          </View>
        </View>
      </ScrollView>
    </ThemedDialog>
  );
};

export default AddAssetDialog;
// src/ui/components/AddAssetDialog.js - Refactored with ThemedChipGroup

import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { ASSET_STATUS, ASSET_TYPES } from '../../core/Constants';
import { InputUtils } from '../../core/InputUtils';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';
import ThemedChipGroup from '../common/ThemedChipGroup';

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
        
        <ThemedChipGroup 
          label="Status"
          selected={status}
          onSelect={setStatus}
          options={[
            { label: 'Watch', value: ASSET_STATUS.WATCH },
            { label: 'Portfolio', value: ASSET_STATUS.OWNED }
          ]}
        />

        <ThemedChipGroup 
          label="Kategorie"
          selected={type}
          onSelect={setType}
          options={[
            { label: ASSET_TYPES.A.label, value: 'A' },
            { label: ASSET_TYPES.B.label, value: 'B' },
            { label: ASSET_TYPES.C.label, value: 'C' },
            { label: ASSET_TYPES.D.label, value: 'D' }
          ]}
        />
      </ScrollView>
    </ThemedDialog>
  );
};

export default AddAssetDialog;
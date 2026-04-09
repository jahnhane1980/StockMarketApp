// src/ui/components/SettingsDialog.js - Refactored with ThemedChipGroup (Full-Body)

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { InputUtils } from '../../core/InputUtils'; 
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';
import ThemedChipGroup from '../common/ThemedChipGroup';

const SettingsDialog = ({ visible, onClose, onSave, currentSettings }) => {
  const theme = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('dark');

  useEffect(() => {
    if (visible && currentSettings) {
      setApiKey(currentSettings.apiKey || '');
      setSelectedTheme(currentSettings.theme || 'dark');
    }
  }, [visible, currentSettings]);

  const handleSave = () => {
    onSave({ 
      apiKey: InputUtils.sanitizeKey(apiKey), 
      theme: selectedTheme 
    });
  };

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton title="Einstellungen sichern" onPress={handleSave} />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title="Konfiguration" footer={footer}>
      <ThemedInput 
        label="Google API Key" 
        value={apiKey} 
        onChangeText={setApiKey} 
        placeholder="AIzaSy..." 
      />
      
      <ThemedChipGroup 
        label="Erscheinungsbild"
        selected={selectedTheme}
        onSelect={setSelectedTheme}
        options={[
          { label: 'Dunkel', value: 'dark' },
          { label: 'Hell', value: 'light' }
        ]}
      />
    </ThemedDialog>
  );
};

export default SettingsDialog;
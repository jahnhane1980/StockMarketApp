// src/ui/components/SettingsDialog.js - Refactored with Test-Mode Toggle (Full-Body)

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
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
  const [testMode, setTestMode] = useState(true);

  useEffect(() => {
    if (visible && currentSettings) {
      setApiKey(currentSettings.apiKey || '');
      setSelectedTheme(currentSettings.theme || 'dark');
      setTestMode(currentSettings.testMode !== undefined ? currentSettings.testMode : true);
    }
  }, [visible, currentSettings]);

  const handleSave = () => {
    onSave({ 
      apiKey: InputUtils.sanitizeKey(apiKey), 
      theme: selectedTheme,
      testMode: testMode
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

      <ThemedChipGroup 
        label="Daten-Modus"
        selected={testMode}
        onSelect={setTestMode}
        activeColor={testMode ? theme.colors.warning : theme.colors.success}
        options={[
          { label: 'Live (Gemini API)', value: false },
          { label: 'Mock (Dummy Daten)', value: true }
        ]}
      />
      <Text style={{ color: theme.colors.textSubtle, fontSize: 10, marginTop: -8, marginBottom: 16 }}>
        {testMode ? "Es werden lokale JSON-Dateien verwendet." : "Achtung: Erzeugt echte API-Kosten/Limits."}
      </Text>
    </ThemedDialog>
  );
};

export default SettingsDialog;
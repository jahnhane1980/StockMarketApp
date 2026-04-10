// src/ui/components/SettingsDialog.js - Update: T212 Secret Input (Full-Body)

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { InputUtils } from '../../core/InputUtils'; 
import { usePortfolioManager } from '../hooks/usePortfolioManager'; 
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';
import ThemedChipGroup from '../common/ThemedChipGroup';
import { Ionicons } from '@expo/vector-icons';

const SettingsDialog = ({ visible, onClose, onSave, currentSettings }) => {
  const theme = useTheme();
  const { actions } = usePortfolioManager(); 
  
  const [apiKey, setApiKey] = useState('');
  const [t212Key, setT212Key] = useState(''); 
  const [t212Secret, setT212Secret] = useState(''); // NEU
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [testMode, setTestMode] = useState(true);

  useEffect(() => {
    if (visible && currentSettings) {
      setApiKey(currentSettings.apiKey || '');
      setT212Key(currentSettings.t212Key || '');
      setT212Secret(currentSettings.t212Secret || ''); // NEU
      setSelectedTheme(currentSettings.theme || 'dark');
      setTestMode(currentSettings.testMode !== undefined ? currentSettings.testMode : true);
    }
  }, [visible, currentSettings]);

  const handleSave = () => {
    onSave({ 
      apiKey: InputUtils.sanitizeKey(apiKey), 
      t212Key: InputUtils.sanitizeKey(t212Key),
      t212Secret: InputUtils.sanitizeKey(t212Secret), // NEU
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedInput 
          label="Google Gemini API Key" 
          value={apiKey} 
          onChangeText={setApiKey} 
          placeholder="AIzaSy..." 
        />

        <ThemedInput 
          label="Trading 212 API Key" 
          value={t212Key} 
          onChangeText={setT212Key} 
          placeholder="Key eingeben..." 
        />

        <ThemedInput 
          label="Trading 212 Secret" 
          value={t212Secret} 
          onChangeText={setT212Secret} 
          placeholder="Secret eingeben..." 
          secureTextEntry={true} // Optional für Sicherheit
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
            { label: 'Live (API)', value: false },
            { label: 'Mock (Dummy Daten)', value: true }
          ]}
        />
        
        <View style={{ marginTop: theme.spacing.sm, paddingBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: 10, marginBottom: 16 }}>
            {testMode ? "Es werden lokale JSON-Dateien verwendet." : "Achtung: Erzeugt echte API-Kosten/Limits."}
          </Text>

          <TouchableOpacity 
            onPress={actions.handleSendLogs}
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: 8, 
              padding: 12, 
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.sm,
              borderWidth: 1,
              borderColor: theme.colors.border
            }}
          >
            <Ionicons name="bug-outline" size={18} color={theme.colors.warning} />
            <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.body }}>Support-Log jetzt senden</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedDialog>
  );
};

export default SettingsDialog;
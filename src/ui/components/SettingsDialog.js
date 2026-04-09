// src/ui/components/SettingsDialog.js - Semantic Refactor (Full-Body)

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';

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

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton title="Einstellungen sichern" onPress={() => onSave({ apiKey, theme: selectedTheme })} />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  const ThemeChip = ({ label, value }) => (
    <TouchableOpacity 
      style={[
        { flex: 1, padding: theme.spacing.sm, borderRadius: theme.radii.md, borderWidth: theme.effects.border, borderColor: theme.colors.border, alignItems: 'center' },
        selectedTheme === value && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
      ]} 
      onPress={() => setSelectedTheme(value)}
    >
      <Text style={{ 
        color: selectedTheme === value ? theme.colors.onPrimary : theme.colors.textSubtle, 
        fontSize: theme.typography.size.body, 
        fontWeight: selectedTheme === value ? theme.typography.weight.bold : theme.typography.weight.regular 
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title="Konfiguration" footer={footer}>
      <ThemedInput label="Google API Key" value={apiKey} onChangeText={setApiKey} placeholder="AIzaSy..." />
      
      <View style={{ marginBottom: theme.spacing.md }}>
        <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, marginBottom: theme.spacing.xs, fontWeight: theme.typography.weight.medium }}>Erscheinungsbild</Text>
        <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
          <ThemeChip label="Dunkel" value="dark" />
          <ThemeChip label="Hell" value="light" />
        </View>
      </View>
    </ThemedDialog>
  );
};

export default SettingsDialog;
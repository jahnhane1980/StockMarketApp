// components/SettingsDialog.js - Refactored with Shared Components

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeContext';
import ThemedDialog from './common/ThemedDialog';
import ThemedButton from './common/ThemedButton';
import ThemedInput from './common/ThemedInput';

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

  const ThemeChip = ({ label, value }) => (
    <TouchableOpacity 
      style={[
        { 
          borderColor: theme.colors.borderSubtle,
          borderWidth: theme.effects.borderWidthThin,
          borderRadius: theme.radii.standard,
          padding: theme.spacing.sm,
          flex: 1,
          alignItems: 'center'
        },
        selectedTheme === value && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }
      ]} 
      onPress={() => setSelectedTheme(value)}
    >
      <Text style={[
        { color: theme.colors.textSubtle, fontSize: theme.typography.size.sm },
        selectedTheme === value && { color: theme.colors.textOnPrimary, fontWeight: theme.typography.weight.bold }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton title="Save" onPress={() => onSave({ apiKey, theme: selectedTheme })} type="primary" />
      <ThemedButton title="Cancel" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title="Settings" footer={footer}>
      <ThemedInput label="Google API Key" value={apiKey} onChangeText={setApiKey} placeholder="AIzaSy..." />
      
      <View style={{ marginBottom: theme.spacing.md }}>
        <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.xs, marginBottom: theme.spacing.xs }}>App Theme</Text>
        <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
          <ThemeChip label="Dark Mode" value="dark" />
          <ThemeChip label="Light Mode" value="light" />
        </View>
      </View>
    </ThemedDialog>
  );
};

export default SettingsDialog;
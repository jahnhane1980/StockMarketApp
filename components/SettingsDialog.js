// components/SettingsDialog.js - Reaktives Theme-Management (Full-Body)

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useTheme } from '../ThemeContext'; // Kontext nutzen

const SettingsDialog = ({ visible, onClose, onSave, currentSettings }) => {
  const theme = useTheme(); // Das aktuell gewählte Theme-Objekt
  const [focusedField, setFocusedField] = useState(null);
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
        styles.chip, 
        { borderColor: theme.colors.borderSubtle },
        selectedTheme === value && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }
      ]} 
      onPress={() => setSelectedTheme(value)}
    >
      <Text style={[
        styles.chipText, 
        { color: theme.colors.textSubtle },
        selectedTheme === value && { color: theme.colors.textOnPrimary, fontWeight: 'bold' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Dynamische Styles basierend auf dem aktuellen Theme
  const dynamicStyles = {
    dialogContainer: {
      backgroundColor: theme.colors.bgMain,
      borderRadius: theme.radii.dialog,
      padding: theme.spacing.lg,
      borderWidth: theme.effects.borderWidthThin,
      borderColor: theme.colors.borderSubtle,
    },
    title: { color: theme.colors.textPrimary, fontSize: theme.typography.size.xl, fontWeight: theme.typography.weight.bold },
    label: { color: theme.colors.textSubtle, fontSize: theme.typography.size.xs },
    input: { color: theme.colors.textPrimary, borderColor: theme.colors.borderSubtle },
    inputFocused: { borderColor: theme.colors.brandPrimary },
    btnPrimary: { backgroundColor: theme.colors.brandPrimary },
    btnSecondary: { backgroundColor: theme.colors.bgSurface }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.dialogContainer, dynamicStyles.dialogContainer]}>
            <Text style={[styles.dialogTitle, dynamicStyles.title]}>Settings</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, dynamicStyles.label]}>Google API Key</Text>
              <TextInput
                style={[
                  styles.textInput, 
                  dynamicStyles.input,
                  focusedField === 'api' && dynamicStyles.inputFocused
                ]}
                placeholder="AIzaSy..."
                placeholderTextColor={theme.colors.textSubtle}
                value={apiKey}
                onChangeText={setApiKey}
                onFocus={() => setFocusedField('api')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, dynamicStyles.label]}>App Theme</Text>
              <View style={styles.chipRow}>
                <ThemeChip label="Dark Mode" value="dark" />
                <ThemeChip label="Light Mode" value="light" />
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.buttonPrimary, dynamicStyles.btnPrimary]} 
                onPress={() => onSave({ apiKey, theme: selectedTheme })}
              >
                <Text style={styles.buttonPrimaryText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.buttonSecondary, dynamicStyles.btnSecondary]} 
                onPress={onClose}
              >
                <Text style={[styles.buttonSecondaryText, { color: theme.colors.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dialogContainer: { width: '90%', maxWidth: 400 },
  dialogTitle: { marginBottom: 24, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  inputLabel: { marginBottom: 4 },
  textInput: { borderWidth: 1, borderRadius: 4, padding: 8 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, padding: 8, borderRadius: 6, borderWidth: 1, alignItems: 'center' },
  chipText: { fontSize: 14 },
  buttonContainer: { marginTop: 24, gap: 12 },
  buttonPrimary: { paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  buttonPrimaryText: { color: '#FFFFFF', fontWeight: 'bold' },
  buttonSecondary: { paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  buttonSecondaryText: { fontSize: 14 }
});

export default SettingsDialog;
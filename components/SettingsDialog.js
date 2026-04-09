// components/SettingsDialog.js - 100% Theme-basiert (Full-Body)

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
import { useTheme } from '../ThemeContext';

const SettingsDialog = ({ visible, onClose, onSave, currentSettings }) => {
  const theme = useTheme();
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

  const dynamicStyles = {
    overlay: { backgroundColor: theme.colors.bgOverlay },
    container: {
      backgroundColor: theme.colors.bgMain,
      borderRadius: theme.radii.dialog,
      padding: theme.spacing.lg,
      borderWidth: theme.effects.borderWidthThin,
      borderColor: theme.colors.borderSubtle,
      width: theme.layout.modalWidth,
    },
    title: { 
      color: theme.colors.textPrimary, 
      fontSize: theme.typography.size.xl, 
      fontWeight: theme.typography.weight.bold,
      marginBottom: theme.spacing.lg 
    },
    label: { 
      color: theme.colors.textSubtle, 
      fontSize: theme.typography.size.xs,
      marginBottom: theme.spacing.xs 
    },
    input: { 
      color: theme.colors.textPrimary, 
      borderColor: theme.colors.borderSubtle,
      borderWidth: theme.effects.borderWidthThin,
      borderRadius: theme.radii.input,
      padding: theme.spacing.sm
    },
    inputFocused: { borderColor: theme.colors.brandPrimary },
    btnPrimary: { backgroundColor: theme.colors.brandPrimary, paddingVertical: theme.spacing.sm, borderRadius: theme.radii.standard, alignItems: 'center' },
    btnSecondary: { backgroundColor: theme.colors.bgSurface, paddingVertical: theme.spacing.sm, borderRadius: theme.radii.standard, alignItems: 'center' }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={[styles.modalOverlay, dynamicStyles.overlay]} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.dialogContainer, dynamicStyles.container]}>
            <Text style={[{ textAlign: 'center' }, dynamicStyles.title]}>Settings</Text>
            
            <View style={{ marginBottom: theme.spacing.md }}>
              <Text style={dynamicStyles.label}>Google API Key</Text>
              <TextInput
                style={[
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

            <View style={{ marginBottom: theme.spacing.md }}>
              <Text style={dynamicStyles.label}>App Theme</Text>
              <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
                <ThemeChip label="Dark Mode" value="dark" />
                <ThemeChip label="Light Mode" value="light" />
              </View>
            </View>
            
            <View style={{ marginTop: theme.spacing.lg, gap: theme.spacing.sm }}>
              <TouchableOpacity 
                style={dynamicStyles.btnPrimary} 
                onPress={() => onSave({ apiKey, theme: selectedTheme })}
              >
                <Text style={{ color: theme.colors.textOnPrimary, fontWeight: theme.typography.weight.bold }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={dynamicStyles.btnSecondary} 
                onPress={onClose}
              >
                <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dialogContainer: { maxWidth: 400 }
});

export default SettingsDialog;
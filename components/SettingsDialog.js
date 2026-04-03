// SettingsDialog.js - Der Einstellungs-Dialog als Modal-Komponente

import React, { useState } from 'react';
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
import { Theme } from '../Theme';

const SettingsDialog = ({ visible, onClose }) => {
  const [focusedField, setFocusedField] = useState(null);

  const ThemeTextInput = ({ label, placeholder, ...props }) => {
    const isFocused = focusedField === label;
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={[styles.textInput, isFocused && styles.textInputFocused]}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.textSubtle}
          onFocus={() => setFocusedField(label)}
          onBlur={() => setFocusedField(null)}
          {...props}
        />
      </View>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Settings</Text>
            <ThemeTextInput label="Macro Name" placeholder="Macro" autoFocus={true} />
            <ThemeTextInput label="API Endpoint" placeholder="https://www.api.endpoint..." />
            <ThemeTextInput label="Timeout (ms)" placeholder="1000" keyboardType="numeric" />
            <ThemeTextInput label="Data Refresh (s)" placeholder="2" keyboardType="numeric" />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonPrimary} onPress={onClose}>
                <Text style={styles.buttonPrimaryText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.bgOverlay, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: Theme.colors.bgMain, 
    borderRadius: Theme.radii.dialog,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle, 
    padding: Theme.spacing.lg,
    shadowColor: Theme.colors.shadowDefault,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Theme.effects.shadowOpacityDialog,
    shadowRadius: Theme.effects.shadowRadiusDialog,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: Theme.typography.size.xl,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  inputContainer: { marginBottom: Theme.spacing.md },
  inputLabel: {
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSubtle,
    marginBottom: Theme.spacing.xs,
  },
  textInput: {
    color: Theme.colors.textPrimary,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle, 
    borderRadius: Theme.radii.input,
    padding: Theme.spacing.sm,
    fontSize: Theme.typography.size.sm,
  },
  textInputFocused: { borderColor: Theme.colors.inputFocus },
  buttonContainer: { marginTop: Theme.spacing.lg, gap: Theme.spacing.md },
  buttonPrimary: {
    backgroundColor: Theme.colors.brandPrimary,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radii.standard,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: Theme.colors.textOnPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
  },
  buttonSecondary: {
    backgroundColor: Theme.colors.bgSurface, 
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radii.standard,
    alignItems: 'center',
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  buttonSecondaryText: { color: Theme.colors.textPrimary, fontSize: Theme.typography.size.sm },
});

export default SettingsDialog;

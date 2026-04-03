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
// Importiere das Theme
import { Theme } from '../Theme';

const SettingsDialog = ({ visible, onClose }) => {
  // Lokaler State für das fokussierte Feld (für Option 1: graue Outline)
  const [focusedField, setFocusedField] = useState(null);

  // Wiederverwendbare Eingabefeld-Komponente mit Theme-Styling
  const ThemeTextInput = ({ label, placeholder, value, ...props }) => {
    const isFocused = focusedField === label;

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={[
            styles.textInput,
            // Wende die graue Fokus-Outline nur an, wenn fokussiert (Option 1)
            isFocused && styles.textInputFocused,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.textSubtle}
          value={value}
          onFocus={() => setFocusedField(label)}
          onBlur={() => setFocusedField(null)}
          {...props}
        />
      </View>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      {/* Klick außerhalb des Dialogs schließt ihn */}
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        
        {/* Verhindert, dass Klicks innerhalb des Dialogs ihn schließen */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Settings</Text>

            {/* Eingabefelder (Fokus auf "Macro Name" wie in image_6.png) */}
            <ThemeTextInput 
              label="Macro Name" 
              placeholder="Macro" 
              autoFocus={true} // Setzt den Fokus initial wie im Bild
            />
            <ThemeTextInput label="API Endpoint" placeholder="https://www.api.endpoint..." />
            <ThemeTextInput label="Timeout (ms)" placeholder="1000" keyboardType="numeric" />
            <ThemeTextInput label="Data Refresh (s)" placeholder="2" keyboardType="numeric" />

            {/* Action Buttons (aus Theme.js) */}
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

// --- Styling (NUR mit Theme-Werten) ---
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
    // Leichter Schatten für Tiefe (Optional, da Border vorhanden)
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
  inputContainer: {
    marginBottom: Theme.spacing.md,
  },
  inputLabel: {
    fontSize: Theme.typography.size.xs,
    color: Theme.colors.textSubtle,
    marginBottom: Theme.spacing.xs,
  },
  textInput: {
    backgroundColor: 'transparent', 
    color: Theme.colors.textPrimary,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle, 
    borderRadius: Theme.radii.input,
    padding: Theme.spacing.sm,
    fontSize: Theme.typography.size.sm,
  },
  // Fokus-Outline (grau, Option 1)
  textInputFocused: {
    borderColor: Theme.colors.inputFocus, 
  },
  buttonContainer: {
    marginTop: Theme.spacing.lg,
    gap: Theme.spacing.md, 
  },
  // Primärer Speicher-Button (blau)
  buttonPrimary: {
    backgroundColor: Theme.colors.brandPrimary,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radii.standard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    color: Theme.colors.textOnPrimary,
    fontSize: Theme.typography.size.md,
    fontWeight: Theme.typography.weight.bold,
  },
  // Sekundärer Cancel-Button (grau)
  buttonSecondary: {
    backgroundColor: Theme.colors.bgSurface, 
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radii.standard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
  },
  buttonSecondaryText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.typography.size.sm,
  },
});

export default SettingsDialog;

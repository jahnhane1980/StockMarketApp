// components/AddAssetDialog.js - Dialog für Asset-Metadaten

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
  ScrollView,
} from 'react-native';
import { Theme } from '../Theme'; //

const AddAssetDialog = ({ visible, onClose, onSave, initialAsset }) => {
  const [ticker, setTicker] = useState('');
  const [status, setStatus] = useState('WATCH'); 
  const [type, setType] = useState('A'); 

  useEffect(() => {
    if (visible) {
      if (initialAsset) {
        setTicker(initialAsset.ticker || '');
        setStatus(initialAsset.status || 'WATCH');
        setType(initialAsset.type || 'A');
      } else {
        setTicker('');
        setStatus('WATCH');
        setType('A');
      }
    }
  }, [visible, initialAsset]);

  const SelectionChip = ({ label, value, current, onChange }) => {
    const isSelected = current === value;
    return (
      <TouchableOpacity
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={() => onChange(value)}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSave = () => {
    if (!ticker.trim()) return; 

    const assetData = { 
      ticker: ticker.toUpperCase(), 
      status, 
      type 
    };
    
    if (onSave) {
      onSave(assetData);
    }
  };

  const isEditing = !!initialAsset;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>{isEditing ? 'Basisdaten bearbeiten' : 'Neues Asset'}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ticker / Symbol</Text>
                <TextInput
                  style={[styles.textInput, isEditing && styles.textInputDisabled]}
                  placeholder="z.B. BTC oder AAPL"
                  placeholderTextColor={Theme.colors.textSubtle} //
                  value={ticker}
                  onChangeText={setTicker}
                  autoCapitalize="characters"
                  editable={!isEditing} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Status</Text>
                <View style={styles.chipRow}>
                  <SelectionChip label="Beobachten" value="WATCH" current={status} onChange={setStatus} />
                  <SelectionChip label="Im Portfolio" value="OWNED" current={status} onChange={setStatus} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Asset Typ</Text>
                <View style={styles.chipRow}>
                  <SelectionChip label="A (Growth)" value="A" current={type} onChange={setType} />
                  <SelectionChip label="B (Mega)" value="B" current={type} onChange={setType} />
                </View>
                <View style={[styles.chipRow, { marginTop: Theme.spacing.sm }]}>
                  <SelectionChip label="C (Commodity)" value="C" current={type} onChange={setType} />
                  <SelectionChip label="D (Hebel auf C)" value="D" current={type} onChange={setType} />
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonPrimary} onPress={handleSave}>
                <Text style={styles.buttonPrimaryText}>Speichern</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
                <Text style={styles.buttonSecondaryText}>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: Theme.colors.bgOverlay, justifyContent: 'flex-end' }, //
  dialogContainer: { backgroundColor: Theme.colors.bgMain, borderTopLeftRadius: Theme.radii.dialog, borderTopRightRadius: Theme.radii.dialog, padding: Theme.spacing.lg, maxHeight: '80%' }, //
  dialogTitle: { fontSize: Theme.typography.size.xl, fontWeight: Theme.typography.weight.bold, color: Theme.colors.textPrimary, marginBottom: Theme.spacing.lg, textAlign: 'center' }, //
  inputGroup: { marginBottom: Theme.spacing.md },
  inputLabel: { fontSize: Theme.typography.size.xs, color: Theme.colors.textSubtle, marginBottom: Theme.spacing.xs }, //
  textInput: { color: Theme.colors.textPrimary, borderWidth: Theme.effects.borderWidthThin, borderColor: Theme.colors.borderSubtle, borderRadius: Theme.radii.input, padding: Theme.spacing.sm }, //
  textInputDisabled: { backgroundColor: Theme.colors.bgSurface, color: Theme.colors.textSubtle }, //
  chipRow: { flexDirection: 'row', gap: Theme.spacing.sm },
  chip: { flex: 1, paddingVertical: Theme.spacing.sm, borderWidth: Theme.effects.borderWidthThin, borderColor: Theme.colors.borderSubtle, borderRadius: Theme.radii.standard, alignItems: 'center' }, //
  chipSelected: { backgroundColor: Theme.colors.brandPrimary, borderColor: Theme.colors.brandPrimary }, //
  chipText: { color: Theme.colors.textSubtle, fontSize: Theme.typography.size.xs }, //
  chipTextSelected: { color: Theme.colors.textOnPrimary }, //
  buttonContainer: { marginTop: Theme.spacing.md, gap: Theme.spacing.md },
  buttonPrimary: { backgroundColor: Theme.colors.brandPrimary, paddingVertical: Theme.spacing.sm, borderRadius: Theme.radii.standard, alignItems: 'center' }, //
  buttonPrimaryText: { color: Theme.colors.textOnPrimary, fontWeight: Theme.typography.weight.bold }, //
  buttonSecondary: { backgroundColor: Theme.colors.bgSurface, paddingVertical: Theme.spacing.sm, borderRadius: Theme.radii.standard, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.borderSubtle }, //
  buttonSecondaryText: { color: Theme.colors.textPrimary } //
});

export default AddAssetDialog;
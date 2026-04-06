// components/AddAssetDialog.js - Reaktives Theme (Full-Body)

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';
import { ASSET_STATUS, ASSET_TYPES } from '../Constants';

const AddAssetDialog = ({ visible, onClose, onSave, initialAsset }) => {
  const theme = useTheme();
  const [ticker, setTicker] = useState('');
  const [status, setStatus] = useState(ASSET_STATUS.WATCH); 
  const [type, setType] = useState(ASSET_TYPES.A); 

  useEffect(() => {
    if (visible) {
      setTicker(initialAsset?.ticker || '');
      setStatus(initialAsset?.status || ASSET_STATUS.WATCH);
      setType(initialAsset?.type || ASSET_TYPES.A);
    }
  }, [visible, initialAsset]);

  const SelectionChip = ({ label, value, current, onChange }) => {
    const isSelected = current === value;
    return (
      <TouchableOpacity
        style={[styles.chip, { borderColor: theme.colors.borderSubtle }, isSelected && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }]}
        onPress={() => onChange(value)}
      >
        <Text style={[styles.chipText, { color: theme.colors.textSubtle }, isSelected && { color: theme.colors.textOnPrimary, fontWeight: 'bold' }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const handleSave = () => {
    if (!ticker.trim()) return;
    onSave({ ticker: ticker.toUpperCase(), status, type });
  };

  const dynamicStyles = {
    container: { backgroundColor: theme.colors.bgMain, borderColor: theme.colors.borderSubtle },
    title: { color: theme.colors.textPrimary },
    label: { color: theme.colors.textSubtle },
    input: { color: theme.colors.textPrimary, borderColor: theme.colors.borderSubtle, backgroundColor: theme.dark ? 'transparent' : theme.colors.bgSurface }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.dialogContainer, dynamicStyles.container]}>
            <Text style={[styles.dialogTitle, dynamicStyles.title]}>{initialAsset ? 'Basisdaten bearbeiten' : 'Neues Asset hinzufügen'}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.label]}>Ticker / Symbol</Text>
                <TextInput style={[styles.textInput, dynamicStyles.input, !!initialAsset && { opacity: 0.5 }]} value={ticker} onChangeText={setTicker} autoCapitalize="characters" editable={!initialAsset} placeholderTextColor={theme.colors.textSubtle} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.label]}>Status</Text>
                <View style={styles.chipRow}>
                  <SelectionChip label="Beobachten" value={ASSET_STATUS.WATCH} current={status} onChange={setStatus} />
                  <SelectionChip label="Portfolio" value={ASSET_STATUS.OWNED} current={status} onChange={setStatus} />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.label]}>Asset Typ</Text>
                <View style={styles.chipRow}>
                  <SelectionChip label="A (Growth)" value={ASSET_TYPES.A} current={type} onChange={setType} />
                  <SelectionChip label="B (Mega)" value={ASSET_TYPES.B} current={type} onChange={setType} />
                </View>
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: theme.colors.brandPrimary }]} onPress={handleSave}>
                <Text style={styles.buttonPrimaryText}>Asset speichern</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonSecondary, { backgroundColor: theme.colors.bgSurface }]} onPress={onClose}>
                <Text style={{ color: theme.colors.textPrimary }}>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  dialogContainer: { borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 24, borderTopWidth: 1 },
  dialogTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, marginBottom: 4 },
  textInput: { borderWidth: 1, borderRadius: 4, padding: 8, fontSize: 16 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { flex: 1, paddingVertical: 8, borderWidth: 1, borderRadius: 6, alignItems: 'center' },
  chipText: { fontSize: 14 },
  buttonContainer: { marginTop: 16, gap: 12 },
  buttonPrimary: { paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  buttonPrimaryText: { color: '#FFFFFF', fontWeight: 'bold' },
  buttonSecondary: { paddingVertical: 12, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' }
});

export default AddAssetDialog;
// components/AddAssetDialog.js - Dialog zum Hinzufügen / Bearbeiten eines Assets

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
import { Theme } from '../Theme';

const AddAssetDialog = ({ visible, onClose, onSave, initialAsset }) => {
  const [ticker, setTicker] = useState('');
  const [status, setStatus] = useState('WATCH'); 
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD'); 
  const [type, setType] = useState('A'); 
  const [funding, setFunding] = useState('EQUITY'); 

  // Wenn der Dialog geöffnet wird, prüfen wir, ob wir editieren oder neu anlegen
  useEffect(() => {
    if (visible) {
      if (initialAsset) {
        setTicker(initialAsset.ticker || '');
        setStatus(initialAsset.status || 'WATCH');
        setAmount(initialAsset.amount || '');
        setCurrency(initialAsset.currency || 'USD');
        setType(initialAsset.type || 'A');
        setFunding(initialAsset.funding || 'EQUITY');
      } else {
        setTicker('');
        setStatus('WATCH');
        setAmount('');
        setCurrency('USD');
        setType('A');
        setFunding('EQUITY');
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

    const assetData = { ticker: ticker.toUpperCase(), status, amount, currency, type, funding };
    
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
            <Text style={styles.dialogTitle}>{isEditing ? 'Edit Asset' : 'Add Asset'}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ticker / Symbol</Text>
                <TextInput
                  style={[styles.textInput, isEditing && styles.textInputDisabled]}
                  placeholder="z.B. AAPL oder BTC"
                  placeholderTextColor={Theme.colors.textSubtle}
                  value={ticker}
                  onChangeText={setTicker}
                  autoCapitalize="characters"
                  editable={!isEditing} // Beim Bearbeiten darf der Ticker nicht geändert werden
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Status</Text>
                <View style={styles.chipRow}>
                  <SelectionChip label="Beobachten" value="WATCH" current={status} onChange={setStatus} />
                  <SelectionChip label="Im Portfolio" value="OWNED" current={status} onChange={setStatus} />
                </View>
              </View>

              {status === 'OWNED' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Investierter Betrag</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="0.00"
                      placeholderTextColor={Theme.colors.textSubtle}
                      keyboardType="numeric"
                      value={amount}
                      onChangeText={setAmount}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Währung</Text>
                    <View style={styles.chipRow}>
                      <SelectionChip label="USD ($)" value="USD" current={currency} onChange={setCurrency} />
                      <SelectionChip label="EUR (€)" value="EUR" current={currency} onChange={setCurrency} />
                    </View>
                  </View>
                </>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Typ</Text>
                <View style={styles.chipRow}>
                  <SelectionChip label="A (Growth)" value="A" current={type} onChange={setType} />
                  <SelectionChip label="B (Mega)" value="B" current={type} onChange={setType} />
                </View>
                <View style={[styles.chipRow, { marginTop: Theme.spacing.sm }]}>
                  <SelectionChip label="C (Commodity)" value="C" current={type} onChange={setType} />
                  <SelectionChip label="D (Hebel auf C)" value="D" current={type} onChange={setType} />
                </View>
              </View>

              {status === 'OWNED' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Finanzierung</Text>
                  <View style={styles.chipRow}>
                    <SelectionChip label="Eigenkapital" value="EQUITY" current={funding} onChange={setFunding} />
                    <SelectionChip label="Fremdkapital" value="DEBT" current={funding} onChange={setFunding} />
                    <SelectionChip label="Mix" value="MIXED" current={funding} onChange={setFunding} />
                  </View>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonPrimary} onPress={handleSave}>
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
    justifyContent: 'flex-end', 
  },
  dialogContainer: {
    backgroundColor: Theme.colors.bgMain, 
    borderTopLeftRadius: Theme.radii.dialog,
    borderTopRightRadius: Theme.radii.dialog,
    borderTopWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle, 
    padding: Theme.spacing.lg,
    maxHeight: '85%', 
  },
  dialogTitle: {
    fontSize: Theme.typography.size.xl,
    fontWeight: Theme.typography.weight.bold,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  inputGroup: { marginBottom: Theme.spacing.md },
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
  textInputDisabled: {
    backgroundColor: Theme.colors.bgSurface,
    color: Theme.colors.textSubtle,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xs,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle,
    borderRadius: Theme.radii.standard,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: Theme.colors.brandPrimary,
    borderColor: Theme.colors.brandPrimary,
  },
  chipText: {
    color: Theme.colors.textSubtle,
    fontSize: Theme.typography.size.xs,
    fontWeight: Theme.typography.weight.medium,
  },
  chipTextSelected: {
    color: Theme.colors.textOnPrimary,
  },
  buttonContainer: { marginTop: Theme.spacing.md, gap: Theme.spacing.md },
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

export default AddAssetDialog;
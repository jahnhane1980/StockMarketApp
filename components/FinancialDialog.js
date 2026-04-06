// components/FinancialDialog.js - Bearbeitung der Liquiditätsdaten

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

const FinancialDialog = ({ visible, onClose, onSave, initialData }) => {
  const [cash, setCash] = useState('0');
  const [cInt, setCInt] = useState('0');
  const [debt, setDebt] = useState('0');
  const [dInt, setDInt] = useState('0');

  useEffect(() => {
    if (visible && initialData) {
      setCash(initialData.currentCash.toString());
      setCInt(initialData.cashInterest.toString());
      setDebt(initialData.debtAmount.toString());
      setDInt(initialData.debtInterest.toString());
    }
  }, [visible, initialData]);

  const handleSave = () => {
    const data = {
      currentCash: parseFloat(cash.replace(',', '.')) || 0,
      cashInterest: parseFloat(cInt.replace(',', '.')) || 0,
      debtAmount: parseFloat(debt.replace(',', '.')) || 0,
      debtInterest: parseFloat(dInt.replace(',', '.')) || 0,
    };
    onSave(data);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Finanz-Status</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Verfügbares Cash (€)</Text>
                <TextInput 
                  style={styles.textInput} 
                  keyboardType="decimal-pad" 
                  value={cash} 
                  onChangeText={setCash} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Habenzinsen p.a. (%)</Text>
                <TextInput 
                  style={styles.textInput} 
                  keyboardType="decimal-pad" 
                  value={cInt} 
                  onChangeText={setCInt} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fremdkapital / Kredit (€)</Text>
                <TextInput 
                  style={styles.textInput} 
                  keyboardType="decimal-pad" 
                  value={debt} 
                  onChangeText={setDebt} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kreditzins p.a. (%)</Text>
                <TextInput 
                  style={styles.textInput} 
                  keyboardType="decimal-pad" 
                  value={dInt} 
                  onChangeText={setDInt} 
                />
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
  modalOverlay: { flex: 1, backgroundColor: Theme.colors.bgOverlay, justifyContent: 'center', alignItems: 'center' },
  dialogContainer: { width: '90%', backgroundColor: Theme.colors.bgMain, borderRadius: Theme.radii.dialog, padding: Theme.spacing.lg, borderWidth: Theme.effects.borderWidthThin, borderColor: Theme.colors.borderSubtle },
  dialogTitle: { color: Theme.colors.textPrimary, fontSize: Theme.typography.size.xl, fontWeight: Theme.typography.weight.bold, marginBottom: Theme.spacing.lg, textAlign: 'center' },
  inputGroup: { marginBottom: Theme.spacing.md },
  inputLabel: { color: Theme.colors.textSubtle, fontSize: Theme.typography.size.xs, marginBottom: Theme.spacing.xs },
  textInput: { color: Theme.colors.textPrimary, borderBottomWidth: Theme.effects.borderWidthThin, borderColor: Theme.colors.borderSubtle, padding: Theme.spacing.sm, fontSize: Theme.typography.size.md },
  buttonContainer: { marginTop: Theme.spacing.lg, gap: Theme.spacing.md },
  buttonPrimary: { backgroundColor: Theme.colors.brandPrimary, paddingVertical: Theme.spacing.md, borderRadius: Theme.radii.standard, alignItems: 'center' },
  buttonPrimaryText: { color: Theme.colors.textOnPrimary, fontWeight: Theme.typography.weight.bold },
  buttonSecondary: { backgroundColor: Theme.colors.bgSurface, paddingVertical: Theme.spacing.md, borderRadius: Theme.radii.standard, alignItems: 'center' },
  buttonSecondaryText: { color: Theme.colors.textPrimary }
});

export default FinancialDialog;
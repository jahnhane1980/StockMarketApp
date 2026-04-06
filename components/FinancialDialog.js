// components/FinancialDialog.js - Reaktives Theme (Full-Body)

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';

const FinancialDialog = ({ visible, onClose, onSave, initialData }) => {
  const theme = useTheme();
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
    onSave({
      currentCash: parseFloat(cash.replace(',', '.')) || 0,
      cashInterest: parseFloat(cInt.replace(',', '.')) || 0,
      debtAmount: parseFloat(debt.replace(',', '.')) || 0,
      debtInterest: parseFloat(dInt.replace(',', '.')) || 0,
    });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, { backgroundColor: theme.colors.bgMain, borderColor: theme.colors.borderSubtle }]}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Finanz-Status</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { label: 'Verfügbares Cash (€)', value: cash, set: setCash },
                { label: 'Habenzinsen p.a. (%)', value: cInt, set: setCInt },
                { label: 'Fremdkapital (€)', value: debt, set: setDebt },
                { label: 'Kreditzins p.a. (%)', value: dInt, set: setDInt },
              ].map((item, idx) => (
                <View key={idx} style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.colors.textSubtle }]}>{item.label}</Text>
                  <TextInput 
                    style={[styles.input, { color: theme.colors.textPrimary, borderColor: theme.colors.borderSubtle }]} 
                    keyboardType="decimal-pad" 
                    value={item.value} 
                    onChangeText={item.set} 
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.brandPrimary }]} onPress={handleSave}>
                <Text style={styles.btnText}>Speichern</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.bgSurface }]} onPress={onClose}>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', borderRadius: 8, padding: 24, borderWidth: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, marginBottom: 4 },
  input: { borderBottomWidth: 1, padding: 8, fontSize: 16 },
  btnRow: { marginTop: 24, gap: 12 },
  btn: { padding: 16, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' }
});

export default FinancialDialog;
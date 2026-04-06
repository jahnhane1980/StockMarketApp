// components/FinancialDialog.js - Professionelles Refactoring (Full-Body)

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
  ScrollView 
} from 'react-native';
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

  const dynamicStyles = {
    container: { 
      backgroundColor: theme.colors.bgMain, 
      borderColor: theme.colors.borderSubtle,
      borderRadius: theme.radii.dialog,
      padding: theme.spacing.lg,
      width: theme.layout.modalWidth,
      borderWidth: theme.effects.borderWidthThin
    },
    title: { 
      color: theme.colors.textPrimary, 
      fontSize: theme.typography.size.xl,
      fontWeight: theme.typography.weight.bold,
      marginBottom: theme.spacing.lg
    },
    inputGroup: { marginBottom: theme.spacing.md },
    label: { 
      color: theme.colors.textSubtle, 
      fontSize: theme.typography.size.xs,
      marginBottom: theme.spacing.xs 
    },
    input: { 
      color: theme.colors.textPrimary, 
      borderColor: theme.colors.borderSubtle,
      borderBottomWidth: theme.effects.borderWidthThin,
      padding: theme.spacing.sm,
      fontSize: theme.typography.size.md
    },
    btnPrimary: { backgroundColor: theme.colors.brandPrimary, padding: theme.spacing.md },
    btnSecondary: { backgroundColor: theme.colors.bgSurface, padding: theme.spacing.md }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={dynamicStyles.container}>
            <Text style={[styles.title, dynamicStyles.title]}>Finanz-Status</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { label: 'Verfügbares Cash (€)', value: cash, set: setCash },
                { label: 'Habenzinsen p.a. (%)', value: cInt, set: setCInt },
                { label: 'Fremdkapital (€)', value: debt, set: setDebt },
                { label: 'Kreditzins p.a. (%)', value: dInt, set: setDInt },
              ].map((item, idx) => (
                <View key={idx} style={dynamicStyles.inputGroup}>
                  <Text style={dynamicStyles.label}>{item.label}</Text>
                  <TextInput 
                    style={dynamicStyles.input} 
                    keyboardType="decimal-pad" 
                    value={item.value} 
                    onChangeText={item.set} 
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, dynamicStyles.btnPrimary]} onPress={handleSave}>
                <Text style={styles.btnText}>Speichern</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, dynamicStyles.btnSecondary]} onPress={onClose}>
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
  title: { textAlign: 'center' },
  btnRow: { marginTop: 24, gap: 12 },
  btn: { borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' }
});

export default FinancialDialog;
// src/ui/components/FinancialDialog.js - Semantic Refactor (Full-Body)

import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';

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

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton title="Speichern" onPress={handleSave} />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title="Liquidiät & Zinsen" footer={footer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedInput label="Cash-Bestand (€)" value={cash} onChangeText={setCash} keyboardType="decimal-pad" />
        <ThemedInput label="Habenzins p.a. (%)" value={cInt} onChangeText={setCInt} keyboardType="decimal-pad" />
        <ThemedInput label="Fremdkapital (€)" value={debt} onChangeText={setDebt} keyboardType="decimal-pad" />
        <ThemedInput label="Kreditzins p.a. (%)" value={dInt} onChangeText={setDInt} keyboardType="decimal-pad" />
      </ScrollView>
    </ThemedDialog>
  );
};

export default FinancialDialog;
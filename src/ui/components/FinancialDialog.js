// src/ui/components/FinancialDialog.js - Refactored (Full-Body)

import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';
import { InputUtils } from '../../core/InputUtils';

const FinancialDialog = ({ visible, onClose, onSave, initialData }) => {
  const theme = useTheme();
  const [cash, setCash] = useState('0');
  const [cInt, setCInt] = useState('0');
  const [debt, setDebt] = useState('0');
  const [dInt, setDInt] = useState('0');
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible && initialData) {
      setCash(initialData.currentCash.toString());
      setCInt(initialData.cashInterest.toString());
      setDebt(initialData.debtAmount.toString());
      setDInt(initialData.debtInterest.toString());
      setErrors({});
    }
  }, [visible, initialData]);

  const validateForm = () => {
    const newErrors = {
      cash: InputUtils.validateIsPositiveAmount(cash, "Cash-Bestand"),
      debt: InputUtils.validateIsPositiveAmount(debt, "Fremdkapital")
    };
    
    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, message]) => message !== null)
    );
    
    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        currentCash: InputUtils.localizeStringToFloat(cash),
        cashInterest: InputUtils.localizeStringToFloat(cInt),
        debtAmount: InputUtils.localizeStringToFloat(debt),
        debtInterest: InputUtils.localizeStringToFloat(dInt),
      });
    }
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
        <ThemedInput 
          label="Cash-Bestand (€)" 
          value={cash} 
          onChangeText={(v) => { setCash(v); setErrors({}); }} 
          keyboardType="decimal-pad" 
          errorMessage={errors.cash} 
        />
        <ThemedInput label="Habenzins p.a. (%)" value={cInt} onChangeText={setCInt} keyboardType="decimal-pad" />
        <ThemedInput 
          label="Fremdkapital (€)" 
          value={debt} 
          onChangeText={(v) => { setDebt(v); setErrors({}); }} 
          keyboardType="decimal-pad" 
          errorMessage={errors.debt} 
        />
        <ThemedInput label="Kreditzins p.a. (%)" value={dInt} onChangeText={setDInt} keyboardType="decimal-pad" />
      </ScrollView>
    </ThemedDialog>
  );
};

export default FinancialDialog;
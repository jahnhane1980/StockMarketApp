// src/ui/components/TransactionDialog.js - Refactored (Full-Body)

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { ACTIONS, CURRENCIES, FUNDING_SOURCES } from '../../core/Constants';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';
import { InputUtils } from '../../core/InputUtils';

const TransactionDialog = ({ visible, onClose, onSave, ticker }) => {
  const theme = useTheme();
  const [action, setAction] = useState(ACTIONS.BUY);
  const [totalFiat, setTotalFiat] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES.EUR);
  const [funding, setFunding] = useState(FUNDING_SOURCES.EQUITY);
  const [timestamp, setTimestamp] = useState('');
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible) {
      setTotalFiat(''); setPricePerUnit(''); setAction(ACTIONS.BUY);
      setErrors({});
      const now = new Date();
      setTimestamp(`${now.getDate().toString().padStart(2, '0')}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }
  }, [visible, ticker]);

  const validateForm = () => {
    const newErrors = {
      totalFiat: InputUtils.validateIsPositiveAmount(totalFiat, "Betrag"),
      pricePerUnit: InputUtils.validateIsPositiveAmount(pricePerUnit, "Kurs")
    };
    
    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, message]) => message !== null)
    );
    
    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(ticker, { 
        action, 
        totalFiat: InputUtils.localizeStringToFloat(totalFiat), 
        pricePerUnit: InputUtils.localizeStringToFloat(pricePerUnit), 
        currency, 
        funding: action === ACTIONS.BUY ? funding : null, 
        userTimestamp: timestamp 
      });
    }
  };

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton title="Speichern" onPress={handleSave} type={action === ACTIONS.BUY ? 'primary' : 'critical'} />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  const Chip = ({ label, value, current, onChange, activeColor }) => (
    <TouchableOpacity 
      style={[
        { flex: 1, padding: theme.spacing.sm, borderRadius: theme.radii.md, borderWidth: theme.effects.border, borderColor: theme.colors.border, alignItems: 'center' }, 
        current === value && { backgroundColor: activeColor || theme.colors.primary, borderColor: activeColor || theme.colors.primary }
      ]}
      onPress={() => onChange(value)}
    >
      <Text style={{ 
        color: current === value ? theme.colors.onPrimary : theme.colors.textSubtle, 
        fontSize: theme.typography.size.body, 
        fontWeight: current === value ? theme.typography.weight.bold : theme.typography.weight.regular 
      }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title={`${ticker}: Trade`} footer={footer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, marginBottom: theme.spacing.xs }}>Aktion</Text>
          <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
            <Chip label="Kauf" value={ACTIONS.BUY} current={action} onChange={setAction} />
            <Chip label="Verkauf" value={ACTIONS.SELL} current={action} onChange={setAction} activeColor={theme.colors.error} />
          </View>
        </View>
        <ThemedInput label="Zeitpunkt" value={timestamp} onChangeText={setTimestamp} />
        <ThemedInput 
          label="Betrag" 
          value={totalFiat} 
          onChangeText={(v) => { setTotalFiat(v); setErrors({}); }} 
          keyboardType="decimal-pad"
          errorMessage={errors.totalFiat}
        />
        <ThemedInput 
          label="Kurs" 
          value={pricePerUnit} 
          onChangeText={(v) => { setPricePerUnit(v); setErrors({}); }} 
          keyboardType="decimal-pad"
          errorMessage={errors.pricePerUnit}
        />
      </ScrollView>
    </ThemedDialog>
  );
};

export default TransactionDialog;
// components/TransactionDialog.js - Refactored with Shared Components

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext'; 
import { ACTIONS, CURRENCIES, FUNDING_SOURCES } from '../Constants';
import ThemedDialog from './common/ThemedDialog';
import ThemedButton from './common/ThemedButton';
import ThemedInput from './common/ThemedInput';

const TransactionDialog = ({ visible, onClose, onSave, ticker }) => {
  const theme = useTheme();
  const [action, setAction] = useState(ACTIONS.BUY); 
  const [totalFiat, setTotalFiat] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES.EUR); 
  const [funding, setFunding] = useState(FUNDING_SOURCES.EQUITY); 
  const [timestamp, setTimestamp] = useState(''); 

  useEffect(() => {
    if (visible) {
      setTotalFiat('');
      setPricePerUnit('');
      setAction(ACTIONS.BUY);
      const now = new Date();
      const formatted = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setTimestamp(formatted);
    }
  }, [visible, ticker]);

  const handleSave = () => {
    if (!totalFiat || !pricePerUnit) return;
    const transactionData = {
      action,
      totalFiat: parseFloat(totalFiat.replace(',', '.')),
      pricePerUnit: parseFloat(pricePerUnit.replace(',', '.')),
      currency,
      funding: action === ACTIONS.BUY ? funding : null,
      userTimestamp: timestamp 
    };
    if (onSave) onSave(ticker, transactionData);
  };

  const SelectionChip = ({ label, value, current, onChange, activeColor }) => {
    const isSelected = current === value;
    return (
      <TouchableOpacity
        style={[
          { borderColor: theme.colors.borderSubtle, borderWidth: theme.effects.borderWidthThin, borderRadius: theme.radii.input, padding: theme.spacing.sm, flex: 1, alignItems: 'center' },
          isSelected && { backgroundColor: activeColor || theme.colors.brandPrimary, borderColor: activeColor || theme.colors.brandPrimary }
        ]}
        onPress={() => onChange(value)}
      >
        <Text style={{ fontSize: theme.typography.size.sm, color: isSelected ? theme.colors.textOnPrimary : theme.colors.textSubtle, fontWeight: isSelected ? theme.typography.weight.bold : theme.typography.weight.normal }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton 
        title="Transaktion speichern" 
        onPress={handleSave} 
        type={action === ACTIONS.BUY ? 'primary' : 'critical'} 
      />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title={`${ticker}: Trade erfassen`} footer={footer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.sm, marginBottom: theme.spacing.xs }}>Aktion</Text>
          <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
            <SelectionChip label="Kauf" value={ACTIONS.BUY} current={action} onChange={setAction} />
            <SelectionChip label="Verkauf" value={ACTIONS.SELL} current={action} onChange={setAction} activeColor={theme.colors.statusCritical} />
          </View>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.sm, marginBottom: theme.spacing.xs }}>Währung</Text>
          <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
            {Object.values(CURRENCIES).map(curr => (
              <SelectionChip key={curr} label={curr} value={curr} current={currency} onChange={setCurrency} />
            ))}
          </View>
        </View>

        <ThemedInput label="Zeitpunkt" value={timestamp} onChangeText={setTimestamp} />
        <ThemedInput label="Gesamtbetrag (Fiat)" value={totalFiat} onChangeText={setTotalFiat} keyboardType="decimal-pad" placeholder="0.00" />
        <ThemedInput label="Stückpreis / Kurs" value={pricePerUnit} onChangeText={setPricePerUnit} keyboardType="decimal-pad" placeholder="0.00" />

        {action === ACTIONS.BUY && (
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.sm, marginBottom: theme.spacing.xs }}>Finanzierung</Text>
            <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
              <SelectionChip label="EK" value={FUNDING_SOURCES.EQUITY} current={funding} onChange={setFunding} />
              <SelectionChip label="FK" value={FUNDING_SOURCES.DEBT} current={funding} onChange={setFunding} />
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedDialog>
  );
};

export default TransactionDialog;
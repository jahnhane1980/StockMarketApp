// src/ui/components/TransactionDialog.js - Strategy-Pattern Implementation (Full-Body)

import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { ACTIONS, CURRENCIES, FUNDING_SOURCES } from '../../core/Constants';
import { AssetPresenter } from '../presenters/AssetPresenter';
import { InputUtils } from '../../core/InputUtils';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';
import ThemedInput from '../common/ThemedInput';
import ThemedChipGroup from '../common/ThemedChipGroup';

const TransactionDialog = ({ visible, onClose, onSave, ticker }) => {
  const theme = useTheme();
  const [action, setAction] = useState(ACTIONS.BUY);
  const [totalFiat, setTotalFiat] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES.EUR);
  const [funding, setFunding] = useState(FUNDING_SOURCES.EQUITY);
  const [timestamp, setTimestamp] = useState('');
  
  const [errors, setErrors] = useState({});

  // Strategy abrufen
  const strategy = AssetPresenter.getTransactionStrategy(action, theme);

  useEffect(() => {
    if (visible) {
      setTotalFiat(''); 
      setPricePerUnit(''); 
      setAction(ACTIONS.BUY);
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
    const activeErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, m]) => m !== null));
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
        funding: strategy.showFunding ? funding : null, 
        userTimestamp: timestamp 
      });
    }
  };

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton 
        title={strategy.buttonTitle} 
        onPress={handleSave} 
        type={strategy.buttonType} 
      />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog 
      visible={visible} 
      onClose={onClose} 
      title={`${ticker}: ${strategy.headerSuffix}`} 
      footer={footer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedChipGroup 
          label="Aktion"
          selected={action}
          onSelect={setAction}
          activeColor={strategy.themeColor}
          options={[
            { label: 'Kauf', value: ACTIONS.BUY },
            { label: 'Verkauf', value: ACTIONS.SELL }
          ]}
        />

        <ThemedInput label="Zeitpunkt" value={timestamp} onChangeText={setTimestamp} />
        <ThemedInput 
          label="Betrag (€)" 
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
        
        {strategy.showFunding && (
          <ThemedChipGroup 
            label="Finanzierungsquelle"
            selected={funding}
            onSelect={setFunding}
            options={[
              { label: 'Eigenkapital', value: FUNDING_SOURCES.EQUITY },
              { label: 'Fremdkapital', value: FUNDING_SOURCES.DEBT }
            ]}
          />
        )}
      </ScrollView>
    </ThemedDialog>
  );
};

export default TransactionDialog;
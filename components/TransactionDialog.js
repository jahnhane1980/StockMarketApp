// components/TransactionDialog.js - Trades erfassen (Full-Body)

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
import { ACTIONS, CURRENCIES, FUNDING_SOURCES } from '../Constants';

const TransactionDialog = ({ visible, onClose, onSave, ticker }) => {
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
      // Format: DD.MM.YYYY HH:mm
      const formatted = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setTimestamp(formatted);
      if (global.log) log.info(`TransactionDialog: Geöffnet für ${ticker}`);
    }
  }, [visible, ticker]);

  const handleSave = () => {
    if (!totalFiat || !pricePerUnit) {
      if (global.log) log.warn("TransactionDialog: Pflichtfelder fehlen.");
      return;
    }
    
    const transactionData = {
      action,
      totalFiat: parseFloat(totalFiat.replace(',', '.')),
      pricePerUnit: parseFloat(pricePerUnit.replace(',', '.')),
      currency,
      funding: action === ACTIONS.BUY ? funding : null,
      userTimestamp: timestamp 
    };
    
    if (onSave) {
      onSave(ticker, transactionData);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>{ticker}: Trade erfassen</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Aktion</Text>
                <View style={styles.chipRow}>
                  <TouchableOpacity 
                    style={[styles.chip, action === ACTIONS.BUY && styles.chipSelectedBuy]}
                    onPress={() => setAction(ACTIONS.BUY)}
                  >
                    <Text style={[styles.chipText, action === ACTIONS.BUY && styles.chipTextActive]}>Kauf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.chip, action === ACTIONS.SELL && styles.chipSelectedSell]}
                    onPress={() => setAction(ACTIONS.SELL)}
                  >
                    <Text style={[styles.chipText, action === ACTIONS.SELL && styles.chipTextActive]}>Verkauf</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Währung</Text>
                <View style={styles.chipRow}>
                  {Object.values(CURRENCIES).map(curr => (
                    <TouchableOpacity 
                      key={curr} 
                      style={[styles.chip, currency === curr && styles.chipSelected]}
                      onPress={() => setCurrency(curr)}
                    >
                      <Text style={[styles.chipText, currency === curr && styles.chipTextActive]}>{curr}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Zeitpunkt (DD.MM.YYYY HH:mm)</Text>
                <TextInput 
                  style={styles.textInput} 
                  value={timestamp} 
                  onChangeText={setTimestamp} 
                  placeholder="01.01.2024 12:00"
                  placeholderTextColor={Theme.colors.textSubtle} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gesamtbetrag (Fiat)</Text>
                <TextInput 
                  style={styles.textInput} 
                  keyboardType="decimal-pad" 
                  value={totalFiat} 
                  onChangeText={setTotalFiat} 
                  placeholder="0.00"
                  placeholderTextColor={Theme.colors.textSubtle} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Stückpreis / Kurs</Text>
                <TextInput 
                  style={styles.textInput} 
                  keyboardType="decimal-pad" 
                  value={pricePerUnit} 
                  onChangeText={setPricePerUnit} 
                  placeholder="0.00"
                  placeholderTextColor={Theme.colors.textSubtle} 
                />
              </View>

              {action === ACTIONS.BUY && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Finanzierung</Text>
                  <View style={styles.chipRow}>
                    <TouchableOpacity 
                      style={[styles.chip, funding === FUNDING_SOURCES.EQUITY && styles.chipSelected]} 
                      onPress={() => setFunding(FUNDING_SOURCES.EQUITY)}
                    >
                      <Text style={[styles.chipText, funding === FUNDING_SOURCES.EQUITY && styles.chipTextActive]}>EK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.chip, funding === FUNDING_SOURCES.DEBT && styles.chipSelected]} 
                      onPress={() => setFunding(FUNDING_SOURCES.DEBT)}
                    >
                      <Text style={[styles.chipText, funding === FUNDING_SOURCES.DEBT && styles.chipTextActive]}>FK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.buttonPrimary, action === ACTIONS.SELL && { backgroundColor: Theme.colors.statusCritical }]} 
              onPress={handleSave}
            >
              <Text style={styles.buttonPrimaryText}>Transaktion speichern</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: Theme.colors.bgOverlay, justifyContent: 'center', alignItems: 'center' },
  dialogContainer: { 
    width: '90%', 
    backgroundColor: Theme.colors.bgMain, 
    borderRadius: Theme.radii.dialog, 
    padding: Theme.spacing.lg,
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle
  },
  dialogTitle: { 
    color: Theme.colors.textPrimary, 
    fontSize: Theme.typography.size.lg, 
    fontWeight: Theme.typography.weight.bold, 
    marginBottom: Theme.spacing.md, 
    textAlign: 'center' 
  },
  inputGroup: { marginBottom: Theme.spacing.md },
  inputLabel: { color: Theme.colors.textSubtle, fontSize: Theme.typography.size.sm, marginBottom: Theme.spacing.xs },
  textInput: { 
    color: Theme.colors.textPrimary, 
    borderBottomWidth: Theme.effects.borderWidthThin, 
    borderColor: Theme.colors.borderSubtle, 
    padding: Theme.spacing.sm,
    fontSize: Theme.typography.size.md
  },
  chipRow: { flexDirection: 'row', gap: Theme.spacing.sm },
  chip: { 
    flex: 1, 
    padding: Theme.spacing.sm, 
    borderRadius: Theme.radii.input, 
    alignItems: 'center', 
    borderWidth: Theme.effects.borderWidthThin, 
    borderColor: Theme.colors.borderSubtle 
  },
  chipSelected: { backgroundColor: Theme.colors.brandPrimary, borderColor: Theme.colors.brandPrimary },
  chipSelectedBuy: { backgroundColor: Theme.colors.brandPrimary, borderColor: Theme.colors.brandPrimary },
  chipSelectedSell: { backgroundColor: Theme.colors.statusCritical, borderColor: Theme.colors.statusCritical },
  chipText: { color: Theme.colors.textSubtle, fontSize: Theme.typography.size.sm },
  chipTextActive: { color: Theme.colors.textOnPrimary },
  buttonPrimary: { 
    backgroundColor: Theme.colors.brandPrimary, 
    padding: Theme.spacing.md, 
    borderRadius: Theme.radii.standard, 
    alignItems: 'center', 
    marginTop: Theme.spacing.md 
  },
  buttonPrimaryText: { color: Theme.colors.textOnPrimary, fontWeight: Theme.typography.weight.bold }
});

export default TransactionDialog;
// components/TransactionDialog.js - Trades erfassen

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Theme } from '../Theme';
import { ACTIONS, CURRENCIES } from '../Constants';

const TransactionDialog = ({ visible, onClose, onSave, ticker }) => {
  const [action, setAction] = useState(ACTIONS.BUY); 
  const [totalFiat, setTotalFiat] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES.EUR); 
  const [timestamp, setTimestamp] = useState(''); 

  useEffect(() => {
    if (visible) {
      setTotalFiat('');
      setPricePerUnit('');
      const now = new Date();
      setTimestamp(`${now.getDate().toString().padStart(2, '0')}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }
  }, [visible]);

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
                  <TouchableOpacity style={[styles.chip, action === ACTIONS.BUY && {backgroundColor: Theme.colors.brandPrimary}]} onPress={() => setAction(ACTIONS.BUY)}>
                    <Text style={{color: action === ACTIONS.BUY ? 'white' : Theme.colors.textSubtle}}>Kauf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.chip, action === ACTIONS.SELL && {backgroundColor: Theme.colors.statusCritical}]} onPress={() => setAction(ACTIONS.SELL)}>
                    <Text style={{color: action === ACTIONS.SELL ? 'white' : Theme.colors.textSubtle}}>Verkauf</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Währung</Text>
                <View style={styles.chipRow}>
                  {Object.values(CURRENCIES).map(curr => (
                    <TouchableOpacity key={curr} style={[styles.chip, currency === curr && {backgroundColor: Theme.colors.brandPrimary}]} onPress={() => setCurrency(curr)}>
                      <Text style={{color: currency === curr ? 'white' : Theme.colors.textSubtle}}>{curr}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Zeitpunkt (DD.MM.YYYY HH:mm)</Text>
                <TextInput style={styles.textInput} value={timestamp} onChangeText={setTimestamp} placeholder="01.01.2024 12:00" placeholderTextColor={Theme.colors.textSubtle} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gesamtbetrag (Fiat)</Text>
                <TextInput style={styles.textInput} keyboardType="decimal-pad" value={totalFiat} onChangeText={setTotalFiat} placeholder="0.00" placeholderTextColor={Theme.colors.textSubtle} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Stückpreis / Kurs</Text>
                <TextInput style={styles.textInput} keyboardType="decimal-pad" value={pricePerUnit} onChangeText={setPricePerUnit} placeholder="0.00" placeholderTextColor={Theme.colors.textSubtle} />
              </View>
            </ScrollView>
            <TouchableOpacity style={[styles.buttonPrimary, action === ACTIONS.SELL && {backgroundColor: Theme.colors.statusCritical}]} onPress={() => onSave(ticker, { action, totalFiat: parseFloat(totalFiat.replace(',', '.')), pricePerUnit: parseFloat(pricePerUnit.replace(',', '.')), currency, userTimestamp: timestamp })}>
              <Text style={styles.buttonPrimaryText}>Speichern</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: Theme.colors.bgOverlay, justifyContent: 'flex-end' },
  dialogContainer: { backgroundColor: Theme.colors.bgMain, borderTopLeftRadius: Theme.radii.dialog, borderTopRightRadius: Theme.radii.dialog, padding: Theme.spacing.lg, maxHeight: '85%' },
  dialogTitle: { color: Theme.colors.textPrimary, fontSize: Theme.typography.size.lg, fontWeight: 'bold', marginBottom: Theme.spacing.md, textAlign: 'center' },
  inputGroup: { marginBottom: Theme.spacing.md },
  inputLabel: { color: Theme.colors.textSubtle, fontSize: 12, marginBottom: 4 },
  textInput: { color: Theme.colors.textPrimary, borderBottomWidth: 1, borderColor: Theme.colors.borderSubtle, padding: 8, fontSize: 14 },
  chipRow: { flexDirection: 'row', gap: 10 },
  chip: { flex: 1, padding: 10, borderRadius: 4, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.borderSubtle },
  buttonPrimary: { backgroundColor: Theme.colors.brandPrimary, padding: 15, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonPrimaryText: { color: 'white', fontWeight: 'bold' }
});

export default TransactionDialog;
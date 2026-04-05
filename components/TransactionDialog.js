// components/TransactionDialog.js - Erfassung von Käufen und Verkäufen

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
import { Theme } from '../Theme'; //

const TransactionDialog = ({ visible, onClose, onSave, ticker }) => {
  const [action, setAction] = useState('BUY'); 
  const [totalFiat, setTotalFiat] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [currency, setCurrency] = useState('EUR'); 
  const [funding, setFunding] = useState('EQUITY'); 

  useEffect(() => {
    if (visible) {
      setTotalFiat('');
      setPricePerUnit('');
    }
  }, [visible]);

  const handleSave = () => {
    if (!totalFiat || !pricePerUnit) return;
    
    const tx = {
      action,
      totalFiat: parseFloat(totalFiat.replace(',', '.')),
      pricePerUnit: parseFloat(pricePerUnit.replace(',', '.')),
      currency,
      funding: action === 'BUY' ? funding : null
    };
    
    onSave(ticker, tx);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>{ticker}: Transaktion</Text>
            
            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Typ</Text>
                <View style={styles.chipRow}>
                  <TouchableOpacity 
                    style={[styles.chip, action === 'BUY' && {backgroundColor: Theme.colors.brandPrimary}]} //
                    onPress={() => setAction('BUY')}
                  >
                    <Text style={{color: action === 'BUY' ? 'white' : Theme.colors.textSubtle}}>Kauf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.chip, action === 'SELL' && {backgroundColor: Theme.colors.statusCritical}]} //
                    onPress={() => setAction('SELL')}
                  >
                    <Text style={{color: action === 'SELL' ? 'white' : Theme.colors.textSubtle}}>Verkauf</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gesamtbetrag (Fiat)</Text>
                <TextInput 
                  style={styles.textInput} 
                  keyboardType="decimal-pad" 
                  value={totalFiat} 
                  onChangeText={setTotalFiat} 
                  placeholder="z.B. 5000"
                  placeholderTextColor={Theme.colors.textSubtle} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Preis pro Stück</Text>
                <TextInput 
                  style={styles.textInput} 
                  keyboardType="decimal-pad" 
                  value={pricePerUnit} 
                  onChangeText={setPricePerUnit} 
                  placeholder="z.B. 65000"
                  placeholderTextColor={Theme.colors.textSubtle} 
                />
              </View>

              {action === 'BUY' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Finanzierung</Text>
                  <View style={styles.chipRow}>
                    <TouchableOpacity style={[styles.chip, funding === 'EQUITY' && styles.chipSelected]} onPress={() => setFunding('EQUITY')}>
                      <Text style={styles.chipText}>EK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chip, funding === 'DEBT' && styles.chipSelected]} onPress={() => setFunding('DEBT')}>
                      <Text style={styles.chipText}>FK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.buttonPrimary, action === 'SELL' && {backgroundColor: Theme.colors.statusCritical}]} 
              onPress={handleSave}
            >
              <Text style={styles.buttonPrimaryText}>Speichern</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: Theme.colors.bgOverlay, justifyContent: 'center', alignItems: 'center' }, //
  dialogContainer: { width: '85%', backgroundColor: Theme.colors.bgMain, borderRadius: Theme.radii.dialog, padding: Theme.spacing.lg }, //
  dialogTitle: { color: Theme.colors.textPrimary, fontSize: Theme.typography.size.lg, marginBottom: Theme.spacing.md, textAlign: 'center' }, //
  inputGroup: { marginBottom: Theme.spacing.md },
  inputLabel: { color: Theme.colors.textSubtle, fontSize: 12, marginBottom: 4 }, //
  textInput: { color: Theme.colors.textPrimary, borderBottomWidth: 1, borderColor: Theme.colors.borderSubtle, padding: 8 }, //
  chipRow: { flexDirection: 'row', gap: 10 },
  chip: { flex: 1, padding: 10, borderRadius: 4, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.borderSubtle }, //
  chipSelected: { backgroundColor: Theme.colors.brandPrimary, borderColor: Theme.colors.brandPrimary }, //
  chipText: { color: 'white', fontSize: 12 },
  buttonPrimary: { backgroundColor: Theme.colors.brandPrimary, padding: 15, borderRadius: 6, alignItems: 'center', marginTop: 10 }, //
  buttonPrimaryText: { color: 'white', fontWeight: 'bold' }
});

export default TransactionDialog;
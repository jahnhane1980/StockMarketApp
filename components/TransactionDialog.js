// components/TransactionDialog.js - Reaktives Theme-Management (Full-Body)

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
import { useTheme } from '../ThemeContext'; 
import { ACTIONS, CURRENCIES, FUNDING_SOURCES } from '../Constants';

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

  const dynamicStyles = {
    container: { backgroundColor: theme.colors.bgMain, borderRadius: theme.radii.dialog, borderColor: theme.colors.borderSubtle },
    title: { color: theme.colors.textPrimary, fontSize: theme.typography.size.lg },
    label: { color: theme.colors.textSubtle, fontSize: theme.typography.size.sm },
    input: { color: theme.colors.textPrimary, borderColor: theme.colors.borderSubtle },
    chip: { borderColor: theme.colors.borderSubtle },
    chipText: { color: theme.colors.textSubtle },
    chipSelected: { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary },
    chipSelectedSell: { backgroundColor: theme.colors.statusCritical, borderColor: theme.colors.statusCritical }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.dialogContainer, dynamicStyles.container]}>
            <Text style={[styles.dialogTitle, dynamicStyles.title]}>{ticker}: Trade erfassen</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.label]}>Aktion</Text>
                <View style={styles.chipRow}>
                  <TouchableOpacity 
                    style={[styles.chip, dynamicStyles.chip, action === ACTIONS.BUY && dynamicStyles.chipSelected]}
                    onPress={() => setAction(ACTIONS.BUY)}
                  >
                    <Text style={[styles.chipText, dynamicStyles.chipText, action === ACTIONS.BUY && styles.chipTextActive]}>Kauf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.chip, dynamicStyles.chip, action === ACTIONS.SELL && dynamicStyles.chipSelectedSell]}
                    onPress={() => setAction(ACTIONS.SELL)}
                  >
                    <Text style={[styles.chipText, dynamicStyles.chipText, action === ACTIONS.SELL && styles.chipTextActive]}>Verkauf</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.label]}>Währung</Text>
                <View style={styles.chipRow}>
                  {Object.values(CURRENCIES).map(curr => (
                    <TouchableOpacity 
                      key={curr} 
                      style={[styles.chip, dynamicStyles.chip, currency === curr && dynamicStyles.chipSelected]}
                      onPress={() => setCurrency(curr)}
                    >
                      <Text style={[styles.chipText, dynamicStyles.chipText, currency === curr && styles.chipTextActive]}>{curr}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.label]}>Zeitpunkt</Text>
                <TextInput style={[styles.textInput, dynamicStyles.input]} value={timestamp} onChangeText={setTimestamp} placeholderTextColor={theme.colors.textSubtle} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.label]}>Gesamtbetrag (Fiat)</Text>
                <TextInput style={[styles.textInput, dynamicStyles.input]} keyboardType="decimal-pad" value={totalFiat} onChangeText={setTotalFiat} placeholder="0.00" placeholderTextColor={theme.colors.textSubtle} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, dynamicStyles.label]}>Stückpreis / Kurs</Text>
                <TextInput style={[styles.textInput, dynamicStyles.input]} keyboardType="decimal-pad" value={pricePerUnit} onChangeText={setPricePerUnit} placeholder="0.00" placeholderTextColor={theme.colors.textSubtle} />
              </View>

              {action === ACTIONS.BUY && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, dynamicStyles.label]}>Finanzierung</Text>
                  <View style={styles.chipRow}>
                    <TouchableOpacity style={[styles.chip, dynamicStyles.chip, funding === FUNDING_SOURCES.EQUITY && dynamicStyles.chipSelected]} onPress={() => setFunding(FUNDING_SOURCES.EQUITY)}>
                      <Text style={[styles.chipText, dynamicStyles.chipText, funding === FUNDING_SOURCES.EQUITY && styles.chipTextActive]}>EK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chip, dynamicStyles.chip, funding === FUNDING_SOURCES.DEBT && dynamicStyles.chipSelected]} onPress={() => setFunding(FUNDING_SOURCES.DEBT)}>
                      <Text style={[styles.chipText, dynamicStyles.chipText, funding === FUNDING_SOURCES.DEBT && styles.chipTextActive]}>FK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.buttonPrimary, { backgroundColor: action === ACTIONS.BUY ? theme.colors.brandPrimary : theme.colors.statusCritical }]} 
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dialogContainer: { width: '90%', padding: 24, borderWidth: 1 },
  dialogTitle: { fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { marginBottom: 4 },
  textInput: { borderBottomWidth: 1, padding: 8, fontSize: 16 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, padding: 8, borderRadius: 4, alignItems: 'center', borderWidth: 1 },
  chipText: { fontSize: 14 },
  chipTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  buttonPrimary: { padding: 16, borderRadius: 6, alignItems: 'center', marginTop: 16 },
  buttonPrimaryText: { color: '#FFFFFF', fontWeight: 'bold' }
});

export default TransactionDialog;
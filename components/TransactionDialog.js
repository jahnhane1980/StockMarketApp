// components/TransactionDialog.js - Reaktives Theme & Theme-Tokens (Full-Body)

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
    container: { backgroundColor: theme.colors.bgMain, borderRadius: theme.radii.dialog, borderColor: theme.colors.borderSubtle, width: theme.layout.modalWidth, padding: theme.spacing.lg },
    title: { color: theme.colors.textPrimary, fontSize: theme.typography.size.lg },
    label: { color: theme.colors.textSubtle, fontSize: theme.typography.size.sm },
    input: { color: theme.colors.textPrimary, borderColor: theme.colors.borderSubtle, padding: theme.spacing.sm, fontSize: theme.typography.size.md },
    chip: { borderColor: theme.colors.borderSubtle, padding: theme.spacing.sm, borderRadius: theme.radii.input, gap: theme.spacing.sm },
    chipText: { color: theme.colors.textSubtle, fontSize: theme.typography.size.sm },
    chipSelected: { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary },
    chipSelectedSell: { backgroundColor: theme.colors.statusCritical, borderColor: theme.colors.statusCritical }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.dialogContainer, dynamicStyles.container]}>
            <Text style={[styles.dialogTitle, dynamicStyles.title, { fontWeight: theme.typography.weight.bold, marginBottom: theme.spacing.md }]}>{ticker}: Trade erfassen</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.inputGroup, { marginBottom: theme.spacing.md }]}>
                <Text style={[styles.inputLabel, dynamicStyles.label, { marginBottom: theme.spacing.xs }]}>Aktion</Text>
                <View style={[styles.chipRow, { gap: dynamicStyles.chip.gap }]}>
                  <TouchableOpacity 
                    style={[styles.chip, { borderColor: dynamicStyles.chip.borderColor, padding: dynamicStyles.chip.padding, borderRadius: dynamicStyles.chip.borderRadius }, action === ACTIONS.BUY && dynamicStyles.chipSelected]}
                    onPress={() => setAction(ACTIONS.BUY)}
                  >
                    <Text style={[styles.chipText, { color: dynamicStyles.chipText.color, fontSize: dynamicStyles.chipText.fontSize }, action === ACTIONS.BUY && styles.chipTextActive]}>Kauf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.chip, { borderColor: dynamicStyles.chip.borderColor, padding: dynamicStyles.chip.padding, borderRadius: dynamicStyles.chip.borderRadius }, action === ACTIONS.SELL && dynamicStyles.chipSelectedSell]}
                    onPress={() => setAction(ACTIONS.SELL)}
                  >
                    <Text style={[styles.chipText, { color: dynamicStyles.chipText.color, fontSize: dynamicStyles.chipText.fontSize }, action === ACTIONS.SELL && styles.chipTextActive]}>Verkauf</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.inputGroup, { marginBottom: theme.spacing.md }]}>
                <Text style={[styles.inputLabel, dynamicStyles.label, { marginBottom: theme.spacing.xs }]}>Währung</Text>
                <View style={[styles.chipRow, { gap: dynamicStyles.chip.gap }]}>
                  {Object.values(CURRENCIES).map(curr => (
                    <TouchableOpacity 
                      key={curr} 
                      style={[styles.chip, { borderColor: dynamicStyles.chip.borderColor, padding: dynamicStyles.chip.padding, borderRadius: dynamicStyles.chip.borderRadius }, currency === curr && dynamicStyles.chipSelected]}
                      onPress={() => setCurrency(curr)}
                    >
                      <Text style={[styles.chipText, { color: dynamicStyles.chipText.color, fontSize: dynamicStyles.chipText.fontSize }, currency === curr && styles.chipTextActive]}>{curr}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.inputGroup, { marginBottom: theme.spacing.md }]}>
                <Text style={[styles.inputLabel, dynamicStyles.label, { marginBottom: theme.spacing.xs }]}>Zeitpunkt</Text>
                <TextInput style={[styles.textInput, { borderBottomWidth: 1, color: dynamicStyles.input.color, borderColor: dynamicStyles.input.borderColor, padding: dynamicStyles.input.padding, fontSize: dynamicStyles.input.fontSize }]} value={timestamp} onChangeText={setTimestamp} placeholderTextColor={theme.colors.textSubtle} />
              </View>

              <View style={[styles.inputGroup, { marginBottom: theme.spacing.md }]}>
                <Text style={[styles.inputLabel, dynamicStyles.label, { marginBottom: theme.spacing.xs }]}>Gesamtbetrag (Fiat)</Text>
                <TextInput style={[styles.textInput, { borderBottomWidth: 1, color: dynamicStyles.input.color, borderColor: dynamicStyles.input.borderColor, padding: dynamicStyles.input.padding, fontSize: dynamicStyles.input.fontSize }]} keyboardType="decimal-pad" value={totalFiat} onChangeText={setTotalFiat} placeholder="0.00" placeholderTextColor={theme.colors.textSubtle} />
              </View>

              <View style={[styles.inputGroup, { marginBottom: theme.spacing.md }]}>
                <Text style={[styles.inputLabel, dynamicStyles.label, { marginBottom: theme.spacing.xs }]}>Stückpreis / Kurs</Text>
                <TextInput style={[styles.textInput, { borderBottomWidth: 1, color: dynamicStyles.input.color, borderColor: dynamicStyles.input.borderColor, padding: dynamicStyles.input.padding, fontSize: dynamicStyles.input.fontSize }]} keyboardType="decimal-pad" value={pricePerUnit} onChangeText={setPricePerUnit} placeholder="0.00" placeholderTextColor={theme.colors.textSubtle} />
              </View>

              {action === ACTIONS.BUY && (
                <View style={[styles.inputGroup, { marginBottom: theme.spacing.md }]}>
                  <Text style={[styles.inputLabel, dynamicStyles.label, { marginBottom: theme.spacing.xs }]}>Finanzierung</Text>
                  <View style={[styles.chipRow, { gap: dynamicStyles.chip.gap }]}>
                    <TouchableOpacity style={[styles.chip, { borderColor: dynamicStyles.chip.borderColor, padding: dynamicStyles.chip.padding, borderRadius: dynamicStyles.chip.borderRadius }, funding === FUNDING_SOURCES.EQUITY && dynamicStyles.chipSelected]} onPress={() => setFunding(FUNDING_SOURCES.EQUITY)}>
                      <Text style={[styles.chipText, { color: dynamicStyles.chipText.color, fontSize: dynamicStyles.chipText.fontSize }, funding === FUNDING_SOURCES.EQUITY && styles.chipTextActive]}>EK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chip, { borderColor: dynamicStyles.chip.borderColor, padding: dynamicStyles.chip.padding, borderRadius: dynamicStyles.chip.borderRadius }, funding === FUNDING_SOURCES.DEBT && dynamicStyles.chipSelected]} onPress={() => setFunding(FUNDING_SOURCES.DEBT)}>
                      <Text style={[styles.chipText, { color: dynamicStyles.chipText.color, fontSize: dynamicStyles.chipText.fontSize }, funding === FUNDING_SOURCES.DEBT && styles.chipTextActive]}>FK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.buttonPrimary, { backgroundColor: action === ACTIONS.BUY ? theme.colors.brandPrimary : theme.colors.statusCritical, padding: theme.spacing.md, borderRadius: theme.radii.standard, marginTop: theme.spacing.md }]} 
              onPress={handleSave}
            >
              <Text style={[styles.buttonPrimaryText, { fontWeight: theme.typography.weight.bold }]}>Transaktion speichern</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dialogContainer: { borderWidth: 1 },
  dialogTitle: { textAlign: 'center' },
  inputGroup: {},
  inputLabel: {},
  textInput: {},
  chipRow: { flexDirection: 'row' },
  chip: { flex: 1, alignItems: 'center', borderWidth: 1 },
  chipText: {},
  chipTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  buttonPrimary: { alignItems: 'center' },
  buttonPrimaryText: { color: '#FFFFFF' }
});

export default TransactionDialog;
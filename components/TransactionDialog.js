// components/TransactionDialog.js - 100% Theme-basiert (Full-Body)

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
    overlay: { backgroundColor: theme.colors.bgOverlay },
    container: { 
      backgroundColor: theme.colors.bgMain, 
      borderRadius: theme.radii.dialog, 
      borderColor: theme.colors.borderSubtle,
      width: theme.layout.modalWidth,
      padding: theme.spacing.lg,
      borderWidth: theme.effects.borderWidthThin
    },
    title: { 
      color: theme.colors.textPrimary, 
      fontSize: theme.typography.size.lg,
      fontWeight: theme.typography.weight.bold,
      marginBottom: theme.spacing.md
    },
    label: { 
      color: theme.colors.textSubtle, 
      fontSize: theme.typography.size.sm,
      marginBottom: theme.spacing.xs
    },
    input: { 
      color: theme.colors.textPrimary, 
      borderColor: theme.colors.borderSubtle,
      borderBottomWidth: theme.effects.borderWidthThin,
      padding: theme.spacing.sm,
      fontSize: theme.typography.size.md
    },
    chip: { 
      borderColor: theme.colors.borderSubtle,
      padding: theme.spacing.sm,
      borderRadius: theme.radii.input,
      borderWidth: theme.effects.borderWidthThin
    },
    chipText: { 
      color: theme.colors.textSubtle,
      fontSize: theme.typography.size.sm
    },
    btnText: {
      color: theme.colors.textOnPrimary,
      fontWeight: theme.typography.weight.bold
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={[styles.modalOverlay, dynamicStyles.overlay]} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={dynamicStyles.container}>
            <Text style={[styles.dialogTitle, dynamicStyles.title]}>{ticker}: Trade erfassen</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Aktion</Text>
                <View style={styles.chipRow}>
                  <TouchableOpacity 
                    style={[dynamicStyles.chip, action === ACTIONS.BUY && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }]}
                    onPress={() => setAction(ACTIONS.BUY)}
                  >
                    <Text style={[dynamicStyles.chipText, action === ACTIONS.BUY && dynamicStyles.btnText]}>Kauf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[dynamicStyles.chip, action === ACTIONS.SELL && { backgroundColor: theme.colors.statusCritical, borderColor: theme.colors.statusCritical }]}
                    onPress={() => setAction(ACTIONS.SELL)}
                  >
                    <Text style={[dynamicStyles.chipText, action === ACTIONS.SELL && dynamicStyles.btnText]}>Verkauf</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Währung</Text>
                <View style={styles.chipRow}>
                  {Object.values(CURRENCIES).map(curr => (
                    <TouchableOpacity 
                      key={curr} 
                      style={[dynamicStyles.chip, currency === curr && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }]}
                      onPress={() => setCurrency(curr)}
                    >
                      <Text style={[dynamicStyles.chipText, currency === curr && dynamicStyles.btnText]}>{curr}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Zeitpunkt</Text>
                <TextInput style={dynamicStyles.input} value={timestamp} onChangeText={setTimestamp} placeholderTextColor={theme.colors.textSubtle} />
              </View>

              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Gesamtbetrag (Fiat)</Text>
                <TextInput style={dynamicStyles.input} keyboardType="decimal-pad" value={totalFiat} onChangeText={setTotalFiat} placeholder="0.00" placeholderTextColor={theme.colors.textSubtle} />
              </View>

              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Stückpreis / Kurs</Text>
                <TextInput style={dynamicStyles.input} keyboardType="decimal-pad" value={pricePerUnit} onChangeText={setPricePerUnit} placeholder="0.00" placeholderTextColor={theme.colors.textSubtle} />
              </View>

              {action === ACTIONS.BUY && (
                <View style={{ marginBottom: theme.spacing.md }}>
                  <Text style={dynamicStyles.label}>Finanzierung</Text>
                  <View style={styles.chipRow}>
                    <TouchableOpacity style={[dynamicStyles.chip, funding === FUNDING_SOURCES.EQUITY && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }]} onPress={() => setFunding(FUNDING_SOURCES.EQUITY)}>
                      <Text style={[dynamicStyles.chipText, funding === FUNDING_SOURCES.EQUITY && dynamicStyles.btnText]}>EK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[dynamicStyles.chip, funding === FUNDING_SOURCES.DEBT && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }]} onPress={() => setFunding(FUNDING_SOURCES.DEBT)}>
                      <Text style={[dynamicStyles.chipText, funding === FUNDING_SOURCES.DEBT && dynamicStyles.btnText]}>FK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.buttonPrimary, { backgroundColor: action === ACTIONS.BUY ? theme.colors.brandPrimary : theme.colors.statusCritical, padding: theme.spacing.md, borderRadius: theme.radii.standard, marginTop: theme.spacing.md }]} 
              onPress={handleSave}
            >
              <Text style={dynamicStyles.btnText}>Transaktion speichern</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dialogTitle: { textAlign: 'center' },
  chipRow: { flexDirection: 'row', gap: 8 },
  buttonPrimary: { alignItems: 'center' }
});

export default TransactionDialog;
// components/TransactionDialog.js - 100% Theme-basiert (Full-Body Sync)

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
      borderWidth: theme.effects.borderWidthThin,
      flex: 1,
      alignItems: 'center'
    },
    chipText: { 
      color: theme.colors.textSubtle,
      fontSize: theme.typography.size.sm
    },
    chipSelected: { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary },
    chipSelectedSell: { backgroundColor: theme.colors.statusCritical, borderColor: theme.colors.statusCritical },
    btnTextActive: {
      color: theme.colors.textOnPrimary,
      fontWeight: theme.typography.weight.bold
    },
    buttonPrimary: { 
      padding: theme.spacing.md, 
      borderRadius: theme.radii.standard, 
      alignItems: 'center', 
      marginTop: theme.spacing.md 
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={[styles.modalOverlay, dynamicStyles.overlay]} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={dynamicStyles.container}>
            <Text style={[{ textAlign: 'center' }, dynamicStyles.title]}>{ticker}: Trade erfassen</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Aktion</Text>
                <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
                  <TouchableOpacity 
                    style={[dynamicStyles.chip, action === ACTIONS.BUY && dynamicStyles.chipSelected]}
                    onPress={() => setAction(ACTIONS.BUY)}
                  >
                    <Text style={[dynamicStyles.chipText, action === ACTIONS.BUY && dynamicStyles.btnTextActive]}>Kauf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[dynamicStyles.chip, action === ACTIONS.SELL && dynamicStyles.chipSelectedSell]}
                    onPress={() => setAction(ACTIONS.SELL)}
                  >
                    <Text style={[dynamicStyles.chipText, action === ACTIONS.SELL && dynamicStyles.btnTextActive]}>Verkauf</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Währung</Text>
                <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
                  {Object.values(CURRENCIES).map(curr => (
                    <TouchableOpacity 
                      key={curr} 
                      style={[dynamicStyles.chip, currency === curr && dynamicStyles.chipSelected]}
                      onPress={() => setCurrency(curr)}
                    >
                      <Text style={[dynamicStyles.chipText, currency === curr && dynamicStyles.btnTextActive]}>{curr}</Text>
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
                <TextInput style={dynamicStyles.input} keyboardType="decimal-pad" value={totalFiat} onChangeText={setTotalFiat} placeholderTextColor={theme.colors.textSubtle} />
              </View>

              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Stückpreis / Kurs</Text>
                <TextInput style={dynamicStyles.input} keyboardType="decimal-pad" value={pricePerUnit} onChangeText={setPricePerUnit} placeholderTextColor={theme.colors.textSubtle} />
              </View>

              {action === ACTIONS.BUY && (
                <View style={{ marginBottom: theme.spacing.md }}>
                  <Text style={dynamicStyles.label}>Finanzierung</Text>
                  <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
                    <TouchableOpacity style={[dynamicStyles.chip, funding === FUNDING_SOURCES.EQUITY && dynamicStyles.chipSelected]} onPress={() => setFunding(FUNDING_SOURCES.EQUITY)}>
                      <Text style={[dynamicStyles.chipText, funding === FUNDING_SOURCES.EQUITY && dynamicStyles.btnTextActive]}>EK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[dynamicStyles.chip, funding === FUNDING_SOURCES.DEBT && dynamicStyles.chipSelected]} onPress={() => setFunding(FUNDING_SOURCES.DEBT)}>
                      <Text style={[dynamicStyles.chipText, funding === FUNDING_SOURCES.DEBT && dynamicStyles.btnTextActive]}>FK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[dynamicStyles.buttonPrimary, { backgroundColor: action === ACTIONS.BUY ? theme.colors.brandPrimary : theme.colors.statusCritical }]} 
              onPress={handleSave}
            >
              <Text style={dynamicStyles.btnTextActive}>Transaktion speichern</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default TransactionDialog;
// components/AddAssetDialog.js - 100% Theme-basiert (Full-Body Sync)

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';
import { ASSET_STATUS, ASSET_TYPES } from '../Constants';

const AddAssetDialog = ({ visible, onClose, onSave, initialAsset }) => {
  const theme = useTheme();
  const [ticker, setTicker] = useState('');
  const [status, setStatus] = useState(ASSET_STATUS.WATCH); 
  const [type, setType] = useState(ASSET_TYPES.A); 

  useEffect(() => {
    if (visible) {
      setTicker(initialAsset?.ticker || '');
      setStatus(initialAsset?.status || ASSET_STATUS.WATCH);
      setType(initialAsset?.type || ASSET_TYPES.A);
    }
  }, [visible, initialAsset]);

  const SelectionChip = ({ label, value, current, onChange }) => {
    const isSelected = current === value;
    return (
      <TouchableOpacity
        style={[
          { 
            borderColor: theme.colors.borderSubtle, 
            borderWidth: theme.effects.borderWidthThin, 
            borderRadius: theme.radii.standard, 
            paddingVertical: theme.spacing.sm,
            flex: 1,
            alignItems: 'center'
          }, 
          isSelected && { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.brandPrimary }
        ]}
        onPress={() => onChange(value)}
      >
        <Text style={{ 
          fontSize: theme.typography.size.sm,
          color: isSelected ? theme.colors.textOnPrimary : theme.colors.textSubtle, 
          fontWeight: isSelected ? theme.typography.weight.bold : theme.typography.weight.normal 
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSave = () => {
    if (!ticker.trim()) return;
    onSave({ ticker: ticker.toUpperCase(), status, type });
  };

  const dynamicStyles = {
    overlay: { backgroundColor: theme.colors.bgOverlay },
    container: { 
      backgroundColor: theme.colors.bgMain, 
      borderColor: theme.colors.borderSubtle,
      borderTopLeftRadius: theme.radii.dialog, 
      borderTopRightRadius: theme.radii.dialog, 
      padding: theme.spacing.lg, 
      borderTopWidth: theme.effects.borderWidthThin 
    },
    title: { 
      color: theme.colors.textPrimary, 
      fontSize: theme.typography.size.xl, 
      fontWeight: theme.typography.weight.bold, 
      marginBottom: theme.spacing.lg,
      textAlign: 'center'
    },
    label: { color: theme.colors.textSubtle, fontSize: theme.typography.size.sm, marginBottom: theme.spacing.xs },
    input: { 
      color: theme.colors.textPrimary, 
      borderColor: theme.colors.borderSubtle,
      borderWidth: theme.effects.borderWidthThin, 
      borderRadius: theme.radii.input, 
      padding: theme.spacing.sm, 
      fontSize: theme.typography.size.md,
      backgroundColor: theme.dark ? theme.colors.bgMain : theme.colors.bgSurface 
    },
    buttonPrimary: { paddingVertical: theme.spacing.md, borderRadius: theme.radii.standard, alignItems: 'center' },
    buttonSecondary: { paddingVertical: theme.spacing.md, borderRadius: theme.radii.standard, alignItems: 'center' }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={[{ flex: 1, justifyContent: 'flex-end' }, dynamicStyles.overlay]} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={dynamicStyles.container}>
            <Text style={dynamicStyles.title}>{initialAsset ? 'Basisdaten bearbeiten' : 'Neues Asset hinzufügen'}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Ticker / Symbol</Text>
                <TextInput style={[dynamicStyles.input, !!initialAsset && { opacity: theme.effects.opacityDisabled }]} value={ticker} onChangeText={setTicker} autoCapitalize="characters" editable={!initialAsset} placeholderTextColor={theme.colors.textSubtle} />
              </View>
              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Status</Text>
                <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
                  <SelectionChip label="Beobachten" value={ASSET_STATUS.WATCH} current={status} onChange={setStatus} />
                  <SelectionChip label="Portfolio" value={ASSET_STATUS.OWNED} current={status} onChange={setStatus} />
                </View>
              </View>
              <View style={{ marginBottom: theme.spacing.md }}>
                <Text style={dynamicStyles.label}>Asset Typ</Text>
                <View style={{ flexDirection: 'row', gap: theme.layout.standardGap }}>
                  <SelectionChip label="A (Growth)" value={ASSET_TYPES.A} current={type} onChange={setType} />
                  <SelectionChip label="B (Mega)" value={ASSET_TYPES.B} current={type} onChange={setType} />
                </View>
              </View>
            </ScrollView>
            <View style={{ marginTop: theme.spacing.md, gap: theme.spacing.md }}>
              <TouchableOpacity style={[dynamicStyles.buttonPrimary, { backgroundColor: theme.colors.brandPrimary }]} onPress={handleSave}>
                <Text style={{ color: theme.colors.textOnPrimary, fontWeight: theme.typography.weight.bold }}>Asset speichern</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[dynamicStyles.buttonSecondary, { backgroundColor: theme.colors.bgSurface }]} onPress={onClose}>
                <Text style={{ color: theme.colors.textPrimary }}>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default AddAssetDialog;
// src/ui/components/ConfirmRefreshDialog.js - Custom Theme Confirmation (Full-Body)

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';

const ConfirmRefreshDialog = ({ visible, onClose, onConfirm }) => {
  const theme = useTheme();

  const footer = (
    <View style={{ gap: theme.layout.standardGap }}>
      <ThemedButton title="Analysieren" onPress={onConfirm} />
      <ThemedButton title="Abbrechen" onPress={onClose} type="secondary" />
    </View>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title="KI-Analyse erzwingen" footer={footer}>
      <View style={{ alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <Ionicons name="warning-outline" size={48} color={theme.colors.warning} style={{ marginBottom: theme.spacing.md }} />
        <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.body, textAlign: 'center', lineHeight: 22 }}>
          Möchtest du die Marktdaten live neu abfragen? Dies leert den lokalen Cache und dauert einige Sekunden.
        </Text>
      </View>
    </ThemedDialog>
  );
};

export default ConfirmRefreshDialog;
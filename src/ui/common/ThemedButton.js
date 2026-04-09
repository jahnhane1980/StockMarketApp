// src/ui/common/ThemedButton.js - Semantisches Refactoring

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const ThemedButton = ({ onPress, title, type = 'primary', style }) => {
  const theme = useTheme();

  const getVariant = () => {
    if (type === 'secondary') return { bg: theme.colors.surface, text: theme.colors.text };
    if (type === 'critical') return { bg: theme.colors.error, text: theme.colors.onPrimary };
    return { bg: theme.colors.primary, text: theme.colors.onPrimary };
  };

  const variant = getVariant();

  return (
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: variant.bg, padding: theme.spacing.md, borderRadius: theme.radii.md }, style]} 
      onPress={onPress}
    >
      <Text style={{ color: variant.text, fontWeight: theme.typography.weight.bold, fontSize: theme.typography.size.body }}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center' }
});

export default ThemedButton;
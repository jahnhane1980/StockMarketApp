// components/common/ThemedButton.js - Standardisierter Button

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../ThemeContext';

const ThemedButton = ({ onPress, title, type = 'primary', style }) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (type) {
      case 'secondary':
        return { 
          bg: theme.colors.bgSurface, 
          text: theme.colors.textPrimary,
          weight: theme.typography.weight.normal 
        };
      case 'critical':
        return { 
          bg: theme.colors.statusCritical, 
          text: theme.colors.textOnPrimary,
          weight: theme.typography.weight.bold 
        };
      default:
        return { 
          bg: theme.colors.brandPrimary, 
          text: theme.colors.textOnPrimary,
          weight: theme.typography.weight.bold 
        };
    }
  };

  const variant = getVariantStyles();

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: variant.bg, paddingVertical: theme.spacing.sm, borderRadius: theme.radii.standard },
        style
      ]} 
      onPress={onPress}
    >
      <Text style={{ color: variant.text, fontWeight: variant.weight, fontSize: theme.typography.size.sm }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center' }
});

export default ThemedButton;
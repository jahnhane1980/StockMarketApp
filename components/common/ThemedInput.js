// components/common/ThemedInput.js - Standardisiertes Eingabefeld

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../ThemeContext';

const ThemedInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', editable = true, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { marginBottom: theme.spacing.md }, style]}>
      {label && (
        <Text style={{ 
          color: theme.colors.textSubtle, 
          fontSize: theme.typography.size.xs, 
          marginBottom: theme.spacing.xs 
        }}>
          {label}
        </Text>
      )}
      <TextInput
        style={{
          color: theme.colors.textPrimary,
          borderColor: theme.colors.borderSubtle,
          borderWidth: theme.effects.borderWidthThin,
          borderRadius: theme.radii.input,
          padding: theme.spacing.sm,
          fontSize: theme.typography.size.md,
          backgroundColor: theme.dark ? 'transparent' : theme.colors.bgSurface,
          opacity: editable ? 1 : theme.effects.opacityDisabled
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSubtle}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' }
});

export default ThemedInput;
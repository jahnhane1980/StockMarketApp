// src/ui/common/ThemedInput.js - Mit Formular-Validierung (Full-Body)

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const ThemedInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default', 
  editable = true, 
  style,
  errorMessage // Neue Prop für Validierung
}) => {
  const theme = useTheme();

  return (
    <View style={[{ marginBottom: theme.spacing.md }, style]}>
      {label && (
        <Text style={{ 
          color: errorMessage ? theme.colors.error : theme.colors.textSubtle, 
          fontSize: theme.typography.size.caption, 
          marginBottom: theme.spacing.xs,
          fontWeight: theme.typography.weight.medium
        }}>
          {label}
        </Text>
      )}
      <TextInput
        style={{
          color: theme.colors.text,
          borderColor: errorMessage ? theme.colors.error : theme.colors.border,
          borderWidth: theme.effects.border,
          borderRadius: theme.radii.sm,
          padding: theme.spacing.sm,
          fontSize: theme.typography.size.body,
          backgroundColor: theme.dark ? 'transparent' : theme.colors.surface,
          opacity: editable ? 1 : theme.effects.opacityDisabled
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSubtle}
        keyboardType={keyboardType}
        editable={editable}
      />
      {/* Anzeige der Fehlermeldung */}
      {errorMessage ? (
        <Text style={{ 
          color: theme.colors.error, 
          fontSize: theme.typography.size.caption, 
          marginTop: theme.spacing.xs,
          fontWeight: theme.typography.weight.medium
        }}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

export default ThemedInput;
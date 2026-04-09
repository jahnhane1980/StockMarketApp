// src/ui/common/ThemedInput.js - 100% Semantisches Theme (Full-Body)

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const ThemedInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', editable = true, style }) => {
  const theme = useTheme();

  return (
    <View style={[{ marginBottom: theme.spacing.md }, style]}>
      {label && (
        <Text style={{ 
          color: theme.colors.textSubtle, 
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
          borderColor: theme.colors.border,
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
    </View>
  );
};

export default ThemedInput;
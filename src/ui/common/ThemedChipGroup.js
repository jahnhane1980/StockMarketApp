// src/ui/common/ThemedChipGroup.js - Einheitliche Auswahl-Komponente

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const ThemedChipGroup = ({ 
  label, 
  options, 
  selected, 
  onSelect, 
  activeColor, 
  containerStyle 
}) => {
  const theme = useTheme();

  return (
    <View style={[{ marginBottom: theme.spacing.md }, containerStyle]}>
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
      <View style={styles.chipRow}>
        {options.map((option) => {
          const isSelected = selected === option.value;
          const chipColor = activeColor || theme.colors.primary;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                { 
                  borderColor: theme.colors.border, 
                  borderWidth: theme.effects.border, 
                  borderRadius: theme.radii.md, 
                  paddingVertical: theme.spacing.sm,
                  backgroundColor: isSelected ? chipColor : 'transparent'
                }, 
                isSelected && { borderColor: chipColor }
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text style={{ 
                fontSize: theme.typography.size.caption,
                color: isSelected ? theme.colors.onPrimary : theme.colors.textSubtle, 
                fontWeight: isSelected ? theme.typography.weight.bold : theme.typography.weight.regular,
                textAlign: 'center'
              }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }
});

export default ThemedChipGroup;
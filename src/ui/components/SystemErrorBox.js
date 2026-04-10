// src/ui/components/SystemErrorBox.js - Kapselung der kritischen Warnungen (Full-Body)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

const SystemErrorBox = ({ error, fontsLoaded }) => {
  const theme = useTheme();

  if (!error) return null;

  const styles = StyleSheet.create({
    errorBox: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.error,
      borderWidth: 1,
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    }
  });

  return (
    <View style={styles.errorBox}>
      {fontsLoaded && <Ionicons name="warning" size={24} color={theme.colors.error} />}
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.colors.error, fontWeight: 'bold', marginBottom: 4 }}>System-Hinweis</Text>
        <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.body }}>{error}</Text>
      </View>
    </View>
  );
};

export default SystemErrorBox;
// src/ui/components/MacroDetailsDialog.js - Refactored (Full-Body)

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';

const MacroDetailsDialog = ({ visible, data, onClose }) => {
  const theme = useTheme();
  if (!data) return null;

  const Row = ({ label, value, color }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
      <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.body }}>{label}</Text>
      <Text style={{ color: color || theme.colors.text, fontSize: theme.typography.size.body, fontWeight: theme.typography.weight.medium }}>{value || '---'}</Text>
    </View>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title="Market Intelligence" footer={<ThemedButton title="Schließen" onPress={onClose} />}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: theme.spacing.lg, borderBottomWidth: theme.effects.border, borderColor: theme.colors.border, paddingBottom: theme.spacing.sm }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Risk Stats</Text>
          <Row label="Global Score" value={data.action_summary?.global_ui_score} />
          <Row label="Urgency" value={data.action_summary?.urgency} color={theme.colors.warning} />
        </View>
        <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radii.md }}>
          <Text style={{ color: theme.colors.primary, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold }}>Logic</Text>
          <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.body, fontStyle: theme.typography.style.italic, marginTop: theme.spacing.xs }}>{data.cycling_navigator?.logic}</Text>
        </View>
      </ScrollView>
    </ThemedDialog>
  );
};

export default MacroDetailsDialog;
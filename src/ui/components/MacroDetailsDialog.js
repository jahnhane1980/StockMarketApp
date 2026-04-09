// src/ui/components/MacroDetailsDialog.js - Daten-Wiederherstellung (Full-Body)

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
        {/* Phase & Recommendation */}
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.primary, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase' }}>Strategy</Text>
          <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.subheading, fontWeight: theme.typography.weight.bold }}>
            {data.cycling_navigator?.current_phase} ➔ {data.cycling_navigator?.recommendation}
          </Text>
        </View>

        {/* Risk Stats */}
        <View style={{ marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.sm, borderBottomWidth: theme.effects.border, borderColor: theme.colors.border }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Risk Stats</Text>
          <Row label="Global UI Score" value={data.action_summary?.global_ui_score} color={data.action_summary?.global_ui_score >= 7 ? theme.colors.success : theme.colors.warning} />
          <Row label="Urgency" value={data.action_summary?.urgency} color={theme.colors.warning} />
        </View>

        {/* NEU: Metrics Validation (Macro) */}
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Macro Metrics</Text>
          <Row label="VIX State" value={data.metrics_validation?.macro?.vix_state} />
          <Row label="Real Yield" value={data.metrics_validation?.macro?.real_yield} />
          <Row label="Gold Stress" value={data.metrics_validation?.macro?.gold_stress} color={data.metrics_validation?.macro?.gold_stress === 'INACTIVE' ? theme.colors.success : theme.colors.error} />
        </View>

        {/* Logic / Summary */}
        <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radii.md }}>
          <Text style={{ color: theme.colors.primary, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold }}>Intelligence Logic</Text>
          <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.body, fontStyle: theme.typography.style.italic, marginTop: theme.spacing.xs }}>{data.cycling_navigator?.logic}</Text>
        </View>
      </ScrollView>
    </ThemedDialog>
  );
};

export default MacroDetailsDialog;
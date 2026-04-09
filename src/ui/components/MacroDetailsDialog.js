// src/ui/components/MacroDetailsDialog.js - Presenter Integration (Full-Body)

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AssetPresenter } from '../presenters/AssetPresenter';
import ThemedDialog from '../common/ThemedDialog';
import ThemedButton from '../common/ThemedButton';

const MacroDetailsDialog = ({ visible, data, onClose }) => {
  const theme = useTheme();
  const vm = AssetPresenter.getMacroDetailsViewModel(data, theme);

  if (!data || !vm) return null;

  const Row = ({ label, value, color }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
      <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.body }}>{label}</Text>
      <Text style={{ color: color || theme.colors.text, fontSize: theme.typography.size.body, fontWeight: theme.typography.weight.medium }}>{value || '---'}</Text>
    </View>
  );

  return (
    <ThemedDialog visible={visible} onClose={onClose} title="Market Intelligence" footer={<ThemedButton title="Schließen" onPress={onClose} />}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.primary, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase' }}>Strategy</Text>
          <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.subheading, fontWeight: theme.typography.weight.bold }}>
            {vm.phaseLabel}
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.sm, borderBottomWidth: theme.effects.border, borderColor: theme.colors.border }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Risk Stats</Text>
          <Row label="Global UI Score" value={data.action_summary?.global_ui_score} color={vm.scoreColor} />
          <Row label="Urgency" value={data.action_summary?.urgency} color={vm.urgencyColor} />
        </View>

        {/* NEU: Die fehlende Liquidity & Debt Sektion aus der V34 JSON */}
        <View style={{ marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.sm, borderBottomWidth: theme.effects.border, borderColor: theme.colors.border }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Liquidity & Debt</Text>
          <Row label="Cash to Deploy" value={data.action_summary?.total_cash_to_deploy ? `${data.action_summary.total_cash_to_deploy} $` : undefined} />
          <Row label="Net Liquidity Change" value={data.action_summary?.net_liquidity_change ? `${data.action_summary.net_liquidity_change} $` : undefined} />
          <Row label="Accrued Interest" value={data.debt_metrics?.accrued_interest ? `${data.debt_metrics.accrued_interest} $` : undefined} />
          <Row 
            label="Principal Safety" 
            value={data.debt_metrics?.principal_safety_status} 
            color={data.debt_metrics?.principal_safety_status === 'SECURE' ? theme.colors.success : theme.colors.error} 
          />
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Macro Metrics</Text>
          <Row label="VIX State" value={data.metrics_validation?.macro?.vix_state} />
          <Row label="Real Yield" value={data.metrics_validation?.macro?.real_yield} />
          <Row label="Gold Stress" value={data.metrics_validation?.macro?.gold_stress} color={vm.goldStressColor} />
        </View>

        <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radii.md }}>
          <Text style={{ color: theme.colors.primary, fontSize: theme.typography.size.caption, fontWeight: theme.typography.weight.bold }}>Intelligence Logic</Text>
          <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.body, fontStyle: theme.typography.style.italic, marginTop: theme.spacing.xs }}>{data.cycling_navigator?.logic}</Text>
        </View>
      </ScrollView>
    </ThemedDialog>
  );
};

export default MacroDetailsDialog;
// components/MacroDetailsDialog.js - Refactored with Shared Components

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';
import ThemedDialog from './common/ThemedDialog';
import ThemedButton from './common/ThemedButton';

const MacroDetailsDialog = ({ visible, data, onClose }) => {
  const theme = useTheme();
  if (!data) return null;

  const InfoRow = ({ label, value, color }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
      <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.sm }}>{label}</Text>
      <Text style={[{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm, fontWeight: theme.typography.weight.medium }, color && { color }]}>
        {value !== undefined && value !== null ? value : '---'}
      </Text>
    </View>
  );

  const Section = ({ title, children, last }) => (
    <View style={{ 
      borderBottomColor: theme.colors.borderSubtle, 
      marginBottom: theme.spacing.lg, 
      paddingBottom: theme.spacing.sm, 
      borderBottomWidth: last ? 0 : theme.effects.borderWidthThin 
    }}>
      <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <ThemedDialog 
      visible={visible} 
      onClose={onClose} 
      title="Market Intelligence" 
      footer={<ThemedButton title="Schließen" onPress={onClose} type="primary" />}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section title="Summary & Risk">
          <InfoRow label="Global UI Score" value={data.action_summary?.global_ui_score} />
          <InfoRow label="Urgency" value={data.action_summary?.urgency} color={theme.colors.statusAlert} />
        </Section>

        <Section title="Cycling Navigator">
          <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm, fontStyle: theme.typography.style.italic, marginBottom: theme.spacing.sm, lineHeight: 20 }}>
            {data.cycling_navigator?.logic}
          </Text>
          <View style={{ backgroundColor: theme.colors.bgSurface, padding: theme.spacing.md, borderRadius: theme.radii.standard }}>
            <Text style={{ color: theme.colors.brandPrimary, fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.bold }}>Recommendation</Text>
            <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm, marginTop: 2 }}>
              {data.cycling_navigator?.recommendation || 'HOLD'}
            </Text>
          </View>
        </Section>

        <Section title="Macro Validation" last>
          <InfoRow label="VIX State" value={data.metrics_validation?.macro?.vix_state} />
          <InfoRow label="Real Yield" value={data.metrics_validation?.macro?.real_yield} />
        </Section>
      </ScrollView>
    </ThemedDialog>
  );
};

export default MacroDetailsDialog;
// components/MacroDetailsDialog.js - 100% Theme-basiert (Full-Body)

import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';

const MacroDetailsDialog = ({ visible, data, onClose }) => {
  const theme = useTheme();
  if (!data) return null;

  const InfoRow = ({ label, value, color }) => (
    <View style={styles.infoRow}>
      <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.sm }}>{label}</Text>
      <Text style={[{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm, fontWeight: theme.typography.weight.medium }, color && { color }]}>
        {value !== undefined && value !== null ? value : '---'}
      </Text>
    </View>
  );

  const dynamicStyles = {
    overlay: { backgroundColor: theme.colors.bgOverlay },
    container: { 
      backgroundColor: theme.colors.bgMain, borderColor: theme.colors.borderSubtle, 
      width: theme.layout.modalWidth, padding: theme.spacing.lg, borderRadius: theme.radii.dialog, 
      maxHeight: theme.layout.dialogMaxHeight, borderWidth: theme.effects.borderWidthThin 
    },
    title: { color: theme.colors.textPrimary, fontSize: theme.typography.size.xl, fontWeight: theme.typography.weight.bold },
    section: { borderBottomColor: theme.colors.borderSubtle, marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.sm, borderBottomWidth: theme.effects.borderWidthThin },
    logicText: { color: theme.colors.textPrimary, fontSize: theme.typography.size.sm, fontStyle: theme.typography.style.italic, marginBottom: theme.spacing.sm, lineHeight: 20 },
    highlightBox: { backgroundColor: theme.colors.bgSurface, padding: theme.spacing.md, borderRadius: theme.radii.standard }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={[styles.overlay, dynamicStyles.overlay]} activeOpacity={1} onPress={onClose}>
        <View style={dynamicStyles.container}>
          <Text style={[styles.title, dynamicStyles.title]}>Market Intelligence</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={dynamicStyles.section}>
              <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Summary & Risk</Text>
              <InfoRow label="Global UI Score" value={data.action_summary?.global_ui_score} />
              <InfoRow label="Urgency" value={data.action_summary?.urgency} color={theme.colors.statusAlert} />
            </View>
            <View style={dynamicStyles.section}>
              <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Cycling Navigator</Text>
              <Text style={dynamicStyles.logicText}>{data.cycling_navigator?.logic}</Text>
              <View style={dynamicStyles.highlightBox}>
                <Text style={{ color: theme.colors.brandPrimary, fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.bold }}>Recommendation</Text>
                <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm, marginTop: 2 }}>{data.cycling_navigator?.recommendation || 'HOLD'}</Text>
              </View>
            </View>
            <View style={[dynamicStyles.section, { borderBottomWidth: 0 }]}>
              <Text style={{ color: theme.colors.textSubtle, fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.bold, textTransform: 'uppercase', marginBottom: theme.spacing.sm }}>Macro Validation</Text>
              <InfoRow label="VIX State" value={data.metrics_validation?.macro?.vix_state} />
              <InfoRow label="Real Yield" value={data.metrics_validation?.macro?.real_yield} />
            </View>
          </ScrollView>
          <TouchableOpacity style={{ backgroundColor: theme.colors.brandPrimary, padding: theme.spacing.md, borderRadius: theme.radii.standard, marginTop: theme.spacing.md, alignItems: 'center' }} onPress={onClose}>
            <Text style={{ color: theme.colors.textOnPrimary, fontWeight: theme.typography.weight.bold }}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { marginBottom: 16, textAlign: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }
});

export default MacroDetailsDialog;
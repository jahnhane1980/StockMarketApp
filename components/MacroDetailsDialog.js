// components/MacroDetailsDialog.js - Reaktives Theme & Theme-Tokens (Full-Body)

import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';

const MacroDetailsDialog = ({ visible, data, onClose }) => {
  const theme = useTheme();
  if (!data) return null;

  const InfoRow = ({ label, value, color }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.colors.textSubtle, fontSize: theme.typography.size.sm }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.colors.textPrimary, fontSize: theme.typography.size.sm }, color && { color }]}>
        {value !== undefined && value !== null ? value : '---'}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.container, { backgroundColor: theme.colors.bgMain, borderColor: theme.colors.borderSubtle, width: theme.layout.modalWidth, padding: theme.spacing.lg, borderRadius: theme.radii.dialog, maxHeight: theme.layout.dialogMaxHeight }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary, fontSize: theme.typography.size.xl }]}>Market Intelligence</Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { borderBottomColor: theme.colors.borderSubtle, marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.sm }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSubtle, fontSize: theme.typography.size.xs }]}>Summary & Risk</Text>
              <InfoRow label="Global UI Score" value={data.action_summary?.global_ui_score} />
              <InfoRow label="Urgency" value={data.action_summary?.urgency} color={theme.colors.statusAlert} />
            </View>

            <View style={[styles.section, { borderBottomColor: theme.colors.borderSubtle, marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.sm }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSubtle, fontSize: theme.typography.size.xs }]}>Cycling Navigator</Text>
              <Text style={[styles.logicText, { color: theme.colors.textPrimary, fontSize: theme.typography.size.sm, marginBottom: theme.spacing.sm }]}>{data.cycling_navigator?.logic}</Text>
              <View style={[styles.highlightBox, { backgroundColor: theme.colors.bgSurface, padding: theme.spacing.md, borderRadius: theme.radii.standard }]}>
                <Text style={{ color: theme.colors.brandPrimary, fontSize: theme.typography.size.xs, fontWeight: theme.typography.weight.bold }}>Recommendation</Text>
                <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.sm, marginTop: 2 }}>{data.cycling_navigator?.recommendation || 'HOLD'}</Text>
              </View>
            </View>

            <View style={[styles.section, { borderBottomColor: theme.colors.borderSubtle, borderBottomWidth: 0 }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSubtle, fontSize: theme.typography.size.xs }]}>Macro Validation</Text>
              <InfoRow label="VIX State" value={data.metrics_validation?.macro?.vix_state} />
              <InfoRow label="Real Yield" value={data.metrics_validation?.macro?.real_yield} />
            </View>
          </ScrollView>

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.brandPrimary, padding: theme.spacing.md, borderRadius: theme.radii.standard, marginTop: theme.spacing.md }]} onPress={onClose}>
            <Text style={[styles.buttonText, { fontWeight: theme.typography.weight.bold }]}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  container: { borderWidth: 1 },
  title: { fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  section: { borderBottomWidth: 1 },
  sectionTitle: { fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  infoLabel: {},
  infoValue: { fontWeight: '500' },
  logicText: { fontStyle: 'italic', lineHeight: 20 },
  highlightBox: {},
  button: { alignItems: 'center' },
  buttonText: { color: '#FFFFFF' }
});

export default MacroDetailsDialog;
// components/MacroDetailsDialog.js - Reaktives Theme (Full-Body)

import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../ThemeContext';

const MacroDetailsDialog = ({ visible, data, onClose }) => {
  const theme = useTheme();
  if (!data) return null;

  const InfoRow = ({ label, value, color }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.colors.textSubtle }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.colors.textPrimary }, color && { color }]}>
        {value !== undefined && value !== null ? value : '---'}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.container, { backgroundColor: theme.colors.bgMain, borderColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Market Intelligence</Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { borderBottomColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSubtle }]}>Summary & Risk</Text>
              <InfoRow label="Global UI Score" value={data.action_summary?.global_ui_score} />
              <InfoRow label="Urgency" value={data.action_summary?.urgency} color={theme.colors.statusAlert} />
            </View>

            <View style={[styles.section, { borderBottomColor: theme.colors.borderSubtle }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSubtle }]}>Cycling Navigator</Text>
              <Text style={[styles.logicText, { color: theme.colors.textPrimary }]}>{data.cycling_navigator?.logic}</Text>
              <View style={[styles.highlightBox, { backgroundColor: theme.colors.bgSurface }]}>
                <Text style={{ color: theme.colors.brandPrimary, fontSize: 12, fontWeight: 'bold' }}>Recommendation</Text>
                <Text style={{ color: theme.colors.textPrimary, fontSize: 14, marginTop: 2 }}>{data.cycling_navigator?.recommendation || 'HOLD'}</Text>
              </View>
            </View>

            <View style={[styles.section, { borderBottomColor: theme.colors.borderSubtle, borderBottomWidth: 0 }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSubtle }]}>Macro Validation</Text>
              <InfoRow label="VIX State" value={data.metrics_validation?.macro?.vix_state} />
              <InfoRow label="Real Yield" value={data.metrics_validation?.macro?.real_yield} />
            </View>
          </ScrollView>

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.brandPrimary }]} onPress={onClose}>
            <Text style={styles.buttonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', borderRadius: 8, padding: 24, maxHeight: '85%', borderWidth: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  section: { marginBottom: 24, paddingBottom: 8, borderBottomWidth: 1 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  logicText: { fontSize: 14, fontStyle: 'italic', marginBottom: 12, lineHeight: 20 },
  highlightBox: { padding: 12, borderRadius: 6 },
  button: { padding: 16, borderRadius: 6, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' }
});

export default MacroDetailsDialog;
// components/MacroDetailsDialog.js - Rekonstruierte Detailansicht (Full-Body Sync)

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Theme } from '../Theme';

const MacroDetailsDialog = ({ visible, data, onClose }) => {
  if (!data) return null;

  const InfoRow = ({ label, value, color }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, color && { color }]}>
        {value !== undefined && value !== null ? value : '---'}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Market Intelligence</Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary & Risk</Text>
              <InfoRow 
                label="Global UI Score" 
                value={data.action_summary?.global_ui_score} 
              />
              <InfoRow 
                label="Urgency" 
                value={data.action_summary?.urgency} 
                color={Theme.colors.statusAlert} 
              />
              <InfoRow 
                label="Master Switch" 
                value={data.master_switch ? `${data.master_switch.status} (${data.master_switch.mode})` : '---'} 
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Liquidity Metrics</Text>
              <InfoRow 
                label="Cash to Deploy" 
                value={data.action_summary?.total_cash_to_deploy ? `${data.action_summary.total_cash_to_deploy} USD` : '---'} 
              />
              <InfoRow 
                label="Net Liq. Change" 
                value={data.action_summary?.net_liquidity_change} 
                color={data.action_summary?.net_liquidity_change?.startsWith('-') ? Theme.colors.statusCritical : Theme.colors.statusSuccess}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cycling Navigator</Text>
              <InfoRow 
                label="Current Phase" 
                value={data.cycling_navigator?.current_phase} 
              />
              <Text style={styles.logicText}>
                {data.cycling_navigator?.logic || 'Keine Logik-Daten verfügbar.'}
              </Text>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightLabel}>Recommendation</Text>
                <Text style={styles.highlightValue}>
                  {data.cycling_navigator?.recommendation || 'HOLD'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Debt Analysis</Text>
              <InfoRow 
                label="Repayment Required" 
                value={data.action_summary?.debt_repayment_required} 
              />
              <InfoRow 
                label="Accrued Interest" 
                value={data.debt_metrics?.accrued_interest} 
              />
              <InfoRow 
                label="Safety Status" 
                value={data.debt_metrics?.principal_safety_status} 
                color={data.debt_metrics?.principal_safety_status === 'SECURE' ? Theme.colors.statusSuccess : Theme.colors.statusAlert}
              />
            </View>

            <View style={[styles.section, { marginBottom: 0 }]}>
              <Text style={styles.sectionTitle}>Macro Validation</Text>
              <InfoRow 
                label="VIX State" 
                value={data.metrics_validation?.macro?.vix_state} 
              />
              <InfoRow 
                label="Real Yield" 
                value={data.metrics_validation?.macro?.real_yield} 
              />
              <InfoRow 
                label="Gold Stress" 
                value={data.metrics_validation?.macro?.gold_stress} 
              />
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={onClose}
          >
            <Text style={styles.buttonPrimaryText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: Theme.colors.bgOverlay, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: { 
    width: '90%', 
    backgroundColor: Theme.colors.bgMain, 
    borderRadius: Theme.radii.dialog, 
    padding: Theme.spacing.lg, 
    maxHeight: '85%',
    borderWidth: Theme.effects.borderWidthThin,
    borderColor: Theme.colors.borderSubtle
  },
  title: { 
    color: Theme.colors.textPrimary, 
    fontSize: Theme.typography.size.xl, 
    fontWeight: Theme.typography.weight.bold, 
    marginBottom: Theme.spacing.md, 
    textAlign: 'center' 
  },
  section: { 
    marginBottom: Theme.spacing.lg,
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.borderSubtle 
  },
  sectionTitle: { 
    color: Theme.colors.textSubtle, 
    fontSize: Theme.typography.size.xs, 
    fontWeight: Theme.typography.weight.bold, 
    textTransform: 'uppercase', 
    marginBottom: Theme.spacing.sm 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4 
  },
  infoLabel: { 
    color: Theme.colors.textSubtle, 
    fontSize: Theme.typography.size.sm 
  },
  infoValue: { 
    color: Theme.colors.textPrimary, 
    fontSize: Theme.typography.size.sm, 
    fontWeight: Theme.typography.weight.medium 
  },
  logicText: { 
    color: Theme.colors.textPrimary, 
    fontSize: Theme.typography.size.sm, 
    fontStyle: 'italic', 
    marginTop: Theme.spacing.xs,
    marginBottom: Theme.spacing.sm,
    lineHeight: 20
  },
  highlightBox: { 
    backgroundColor: Theme.colors.bgSurface, 
    padding: Theme.spacing.sm, 
    borderRadius: Theme.radii.standard,
    marginTop: Theme.spacing.xs
  },
  highlightLabel: { 
    color: Theme.colors.brandPrimary, 
    fontSize: Theme.typography.size.xs, 
    fontWeight: Theme.typography.weight.bold 
  },
  highlightValue: { 
    color: Theme.colors.textOnPrimary, 
    fontSize: Theme.typography.size.sm, 
    marginTop: 2 
  },
  buttonPrimary: { 
    backgroundColor: Theme.colors.brandPrimary, 
    padding: Theme.spacing.md, 
    borderRadius: Theme.radii.standard, 
    alignItems: 'center', 
    marginTop: Theme.spacing.md 
  },
  buttonPrimaryText: { 
    color: Theme.colors.textOnPrimary, 
    fontWeight: Theme.typography.weight.bold 
  }
});

export default MacroDetailsDialog;
// src/ui/components/MainToolbar.js - App Header & Toolbar (Full-Body)

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated, StyleSheet, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { AssetPresenter } from '../presenters/AssetPresenter';

const MainToolbar = ({ actions, settings, macroData, isLoading, hasT212Credentials, fontsLoaded }) => {
  const theme = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Neuer State für das Burger-Menü
  const [menuVisible, setMenuVisible] = useState(false);

  const marketScore = macroData?.error ? null : macroData?.action_summary?.global_ui_score;
  const marketVm = AssetPresenter.getMarketViewModel(marketScore, theme);

  useEffect(() => {
    if (macroData && !macroData.error) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [macroData, pulseAnim]);

  // Hilfsfunktion: Menü schließen und dann Aktion ausführen
  const closeMenuAndDo = (action) => {
    setMenuVisible(false);
    action();
  };

  const styles = StyleSheet.create({
    toolbar: { 
      height: theme.layout.headerHeight, 
      backgroundColor: theme.colors.background, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingHorizontal: theme.spacing.md, 
      borderBottomWidth: theme.effects.border, 
      borderColor: theme.colors.border 
    },
    menuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.1)' // Leicht abgedunkelt, um Fokus auf das Menü zu legen
    },
    menuContainer: {
      position: 'absolute',
      top: theme.layout.headerHeight + Platform.select({ ios: 40, android: 10 }), // Anpassung je nach SafeArea
      right: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      padding: theme.spacing.sm,
      minWidth: 200,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    menuItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    menuText: {
      color: theme.colors.text,
      fontSize: theme.typography.size.body,
    }
  });

  return (
    <View style={styles.toolbar}>
      
      {/* Linker Bereich: Market Indicator */}
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }} onPress={() => actions.toggleDialog('macro', true)}>
        <Animated.View style={[{ width: 12, height: 12, borderRadius: 6, backgroundColor: marketVm.color }, { transform: [{ scale: pulseAnim }] }]} />
        <Text style={{ color: theme.colors.text, fontSize: theme.typography.size.subheading, fontWeight: '500' }}>Market</Text>
        {isLoading && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginLeft: 8 }} />}
      </TouchableOpacity>
      
      {/* Rechter Bereich: Test-Mode Indikator + Burger Menü Icon */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {fontsLoaded && (
          <View style={{ padding: 4 }}>
            <Ionicons 
              name={settings.testMode ? "flash-off" : "flash"} 
              size={18} 
              color={settings.testMode ? theme.colors.warning : theme.colors.success} 
            />
          </View>
        )}

        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 4 }}>
          {fontsLoaded && <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />}
        </TouchableOpacity>
      </View>

      {/* Das Dropdown-Menü als Modal */}
      <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.menuOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={styles.menuContainer}>
          
          <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={() => closeMenuAndDo(actions.handleForceRefresh)}>
            {fontsLoaded && <Ionicons name="refresh-outline" size={20} color={theme.colors.warning} />}
            <Text style={styles.menuText}>Force Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.menuItemBorder, !hasT212Credentials && { opacity: 0.5 }]} 
            onPress={() => hasT212Credentials && closeMenuAndDo(actions.handleT212Refresh)}
            disabled={!hasT212Credentials}
          >
            {fontsLoaded && <Ionicons name="briefcase-outline" size={20} color={hasT212Credentials ? theme.colors.primary : theme.colors.textSubtle} />}
            <Text style={styles.menuText}>Trading212 Sync</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={() => closeMenuAndDo(() => actions.toggleDialog('radar', true))}>
            {fontsLoaded && <Ionicons name="radio-outline" size={20} color={theme.colors.text} />}
            <Text style={styles.menuText}>Stock Radar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={() => closeMenuAndDo(() => actions.toggleDialog('history', true))}>
            {fontsLoaded && <Ionicons name="receipt-outline" size={20} color={theme.colors.text} />}
            <Text style={styles.menuText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => closeMenuAndDo(() => actions.toggleDialog('settings', true))}>
            {fontsLoaded && <Ionicons name="settings-outline" size={20} color={theme.colors.text} />}
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </View>
  );
};

export default MainToolbar;
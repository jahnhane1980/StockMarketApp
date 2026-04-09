// src/ui/common/ThemedDialog.js - Semantisches Refactoring

import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const ThemedDialog = ({ visible, onClose, title, children, footer }) => {
  const theme = useTheme();

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, { 
            backgroundColor: theme.colors.background, 
            borderRadius: theme.radii.md, 
            padding: theme.spacing.lg, 
            borderWidth: theme.effects.border, 
            borderColor: theme.colors.border, 
            width: theme.layout.modalWidth 
          }]}>
            {title && <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.typography.size.heading, fontWeight: theme.typography.weight.bold, marginBottom: theme.spacing.lg }]}>{title}</Text>}
            {children}
            {footer && <View style={{ marginTop: theme.spacing.lg }}>{footer}</View>}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { maxWidth: 500 },
  title: { textAlign: 'center' }
});

export default ThemedDialog;
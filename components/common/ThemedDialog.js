// components/common/ThemedDialog.js - Standardisierter Dialog-Wrapper

import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard, 
  StyleSheet 
} from 'react-native';
import { useTheme } from '../../ThemeContext';

const ThemedDialog = ({ visible, onClose, title, children, footer }) => {
  const theme = useTheme();

  const dynamicStyles = {
    overlay: { backgroundColor: theme.colors.bgOverlay },
    container: {
      backgroundColor: theme.colors.bgMain,
      borderRadius: theme.radii.dialog,
      padding: theme.spacing.lg,
      borderWidth: theme.effects.borderWidthThin,
      borderColor: theme.colors.borderSubtle,
      width: theme.layout.modalWidth,
    },
    title: { 
      color: theme.colors.textPrimary, 
      fontSize: theme.typography.size.xl, 
      fontWeight: theme.typography.weight.bold,
      marginBottom: theme.spacing.lg,
      textAlign: 'center'
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity 
        style={[styles.modalOverlay, dynamicStyles.overlay]} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={dynamicStyles.container}>
            {title && <Text style={dynamicStyles.title}>{title}</Text>}
            {children}
            {footer && <View style={{ marginTop: theme.spacing.lg }}>{footer}</View>}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ThemedDialog;
// src/ui/hooks/useUiState.js - UI & Dialog State Management (Full-Body)

import { useState } from 'react';

export const useUiState = () => {
  const [dialogs, setDialogs] = useState({
    settings: false, 
    addAsset: false, 
    transaction: false,
    history: false, 
    macro: false, 
    finance: false, 
    radar: false,
    confirmRefresh: false
  });

  const [activeTicker, setActiveTicker] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);

  const toggleDialog = (key, visible, data = null) => {
    setDialogs(prev => ({ ...prev, [key]: visible }));
    if (!visible) {
      if (key === 'addAsset') setEditingAsset(null);
      return;
    }
    if (key === 'transaction' || key === 'radar') setActiveTicker(data);
    if (key === 'addAsset' && data) setEditingAsset(data);
  };

  return {
    dialogs,
    activeTicker,
    editingAsset,
    toggleDialog,
    setEditingAsset
  };
};
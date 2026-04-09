// ThemeContext.js - Ermöglicht reaktive Design-Updates

import React, { createContext, useContext } from 'react';
import { DarkTheme } from './Theme';

export const ThemeContext = createContext(DarkTheme);

export const useTheme = () => useContext(ThemeContext);
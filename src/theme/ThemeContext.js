// src/theme/ThemeContext.js - Kontext für reaktives Design

import { createContext, useContext } from 'react';
import { DarkTheme } from './Theme';

export const ThemeContext = createContext(DarkTheme);
export const useTheme = () => useContext(ThemeContext);
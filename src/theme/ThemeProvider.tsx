import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, Theme } from './theme';

const STORAGE_KEY = '@app_theme_mode';

type ThemeMode = 'light' | 'dark' | 'solarized';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
};

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [theme, setTheme] = useState<Theme>(themes.light as Theme);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'solarized' || saved === 'light') {
          setModeState(saved);
          setTheme(themes[saved]);
        }
      } catch (e) {
        console.warn('Failed to load theme', e);
      }
    })();
  }, []);

  const setMode = async (m: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, m);
    } catch (e) {
      console.warn('Failed to persist theme', e);
    }
    setModeState(m);
    setTheme(themes[m] as Theme);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, theme }}>{children}</ThemeContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, ThemeColors } from './colors';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  setDarkMode: () => {},
  colors: darkColors,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme_preference');
      if (saved !== null) {
        setIsDark(saved === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (dark: boolean) => {
    try {
      await AsyncStorage.setItem('theme_preference', dark ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    saveThemePreference(newValue);
  };

  const setDarkMode = (dark: boolean) => {
    setIsDark(dark);
    saveThemePreference(dark);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LightTokens,
  createDarkTokens,
  ColorTokens,
  SkyThemeKey,
  AccentChoice,
  Palette,
} from '../constants/colors';
import { TypographyChoice } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: ColorTokens;
  skyTheme: SkyThemeKey;
  accentColor: AccentChoice;
  typographyChoice: TypographyChoice;
  setMode: (mode: ThemeMode) => Promise<void>;
  setSkyTheme: (sky: SkyThemeKey) => Promise<void>;
  setAccentColor: (accent: AccentChoice) => Promise<void>;
  setTypographyChoice: (choice: TypographyChoice) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [skyTheme, setSkyThemeState] = useState<SkyThemeKey>('midnight_library');
  const [accentColor, setAccentColorState] = useState<AccentChoice>('gold');
  const [typographyChoice, setTypographyChoiceState] =
    useState<TypographyChoice>('celestial_serif');

  // Load preferences from AsyncStorage on mount
  useEffect(() => {
    async function loadThemePreferences() {
      try {
        const [storedMode, storedSky, storedAccent, storedTypo] =
          await Promise.all([
            AsyncStorage.getItem('@cb/theme_mode') ||
              AsyncStorage.getItem('@cb/theme'),
            AsyncStorage.getItem('@cb/sky_theme'),
            AsyncStorage.getItem('@cb/accent_color'),
            AsyncStorage.getItem('@cb/typography'),
          ]);

        if (
          storedMode === 'light' ||
          storedMode === 'dark' ||
          storedMode === 'system'
        ) {
          setModeState(storedMode);
        }
        if (storedSky) {
          setSkyThemeState(storedSky as SkyThemeKey);
        }
        if (storedAccent === 'gold' || storedAccent === 'blue') {
          setAccentColorState(storedAccent);
        }
        if (
          storedTypo === 'celestial_serif' ||
          storedTypo === 'literary_italic' ||
          storedTypo === 'modern_sans' ||
          storedTypo === 'classic_serif'
        ) {
          setTypographyChoiceState(storedTypo);
        }
      } catch {
        // Fallbacks remain defaults
      }
    }
    loadThemePreferences();
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem('@cb/theme_mode', newMode);
      await AsyncStorage.setItem('@cb/theme', newMode);
    } catch {
      // Storage error ignored
    }
  };

  const setSkyTheme = async (newSky: SkyThemeKey) => {
    setSkyThemeState(newSky);
    try {
      await AsyncStorage.setItem('@cb/sky_theme', newSky);
    } catch {
      // Storage error ignored
    }
  };

  const setAccentColor = async (newAccent: AccentChoice) => {
    setAccentColorState(newAccent);
    try {
      await AsyncStorage.setItem('@cb/accent_color', newAccent);
    } catch {
      // Storage error ignored
    }
  };

  const setTypographyChoice = async (newTypography: TypographyChoice) => {
    setTypographyChoiceState(newTypography);
    try {
      await AsyncStorage.setItem('@cb/typography', newTypography);
    } catch {
      // Storage error ignored
    }
  };

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  // Compute active tokens based on isDark, skyTheme, and accentColor
  let colors: ColorTokens;
  if (isDark) {
    colors = createDarkTokens(skyTheme, accentColor);
  } else {
    const isGold = accentColor === 'gold';
    colors = {
      ...LightTokens,
      accent: isGold ? Palette.goldDark : Palette.blueDark,
      accentDark: isGold ? Palette.goldDark : Palette.blueDark,
      textAccent: isGold ? Palette.goldDark : Palette.blue,
      borderStrong: isGold ? Palette.goldDark : Palette.blue,
      tabActive: isGold ? Palette.goldDark : Palette.blueDark,
    };
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark,
        colors,
        skyTheme,
        accentColor,
        typographyChoice,
        setMode,
        setSkyTheme,
        setAccentColor,
        setTypographyChoice,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

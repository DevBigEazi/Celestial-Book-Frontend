import React, { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
} from '@expo-google-fonts/geist-mono';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { useAuth } from '../src/hooks/useAuth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(auth)',
};

interface NavigationStackProps {
  fontsLoaded: boolean;
}

function NavigationStack({ fontsLoaded }: NavigationStackProps) {
  const { isDark } = useTheme();
  const { user, onboarded, loading: authLoading } = useAuth();
  const segments = useSegments() as unknown as string[];
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded || authLoading) return;

    // Hide splash screen once fonts and auth are ready
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      // User is not logged in: redirect to welcome if outside auth group
      if (!inAuthGroup) {
        router.replace('/(auth)/welcome');
      }
    } else if (!onboarded) {
      // User is logged in but not onboarded: redirect to onboarding
      if (segments[0] !== '(auth)' || segments[1] !== 'onboarding') {
        router.replace('/(auth)/onboarding');
      }
    } else {
      // User is logged in and onboarded: redirect to discover if in auth group or at root index
      if (inAuthGroup || segments.length === 0 || segments[0] === 'index') {
        router.replace('/(tabs)/discover');
      }
    }
  }, [user, onboarded, authLoading, fontsLoaded, segments, router]);

  if (!fontsLoaded || authLoading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(stack)/book/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="(stack)/club/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="(stack)/community/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="(stack)/settings" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    GeistSans_400Regular: Geist_400Regular,
    GeistSans_500Medium: Geist_500Medium,
    GeistSans_600SemiBold: Geist_600SemiBold,
    GeistSans_700Bold: Geist_700Bold,
    GeistMono_400Regular,
    GeistMono_500Medium,
    ...Ionicons.font,
  });

  const fontsLoaded = loaded || !!error;

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationStack fontsLoaded={fontsLoaded} />
      </AuthProvider>
    </ThemeProvider>
  );
}


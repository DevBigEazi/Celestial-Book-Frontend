import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    async function checkAuthAndOnboarding() {
      try {
        // Read onboarding and registration state from AsyncStorage
        const onboardingComplete = await AsyncStorage.getItem('@onboarding_complete');
        const userRegistered = await AsyncStorage.getItem('@user_registered');

        if (onboardingComplete !== 'true') {
          // If onboarding is not complete, redirect to welcome
          router.replace('/(auth)/welcome');
        } else if (userRegistered !== 'true') {
          // If onboarding is complete but not registered, redirect to register
          router.replace('/(auth)/register');
        } else {
          // If registered, redirect to discover tab
          router.replace('/(tabs)/discover');
        }
      } catch (error) {
        // Default fallback to welcome on error
        router.replace('/(auth)/welcome');
      }
    }

    checkAuthAndOnboarding();
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Spacing } from '../../src/constants/theme';
import { Image } from 'expo-image';

export default function Welcome() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={styles.brandContainer}>
        {/* Typographic Logo & Icon */}
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logoImage}
          contentFit="contain"
        />
        <Typography variant="display" color={colors.textPrimary} align="center">
          Celestial Books
        </Typography>
        <Typography variant="subtitle" color={colors.textSecondary} align="center" style={styles.tagline}>
          An AI-powered social reading platform
        </Typography>
      </View>

      <View style={styles.actionsContainer}>
        <Button
          variant="primary"
          label="Get started"
          fullWidth
          onPress={() => router.push('/(auth)/onboarding')}
          style={styles.button}
        />
        <Button
          variant="outline"
          label="Sign in"
          fullWidth
          onPress={() => router.push('/(auth)/login')}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['6'],
    paddingTop: Spacing['16'],
    paddingBottom: Spacing['12'],
  },
  brandContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing['4'],
  },
  tagline: {
    marginTop: Spacing['3'],
  },
  actionsContainer: {
    gap: Spacing['3'],
  },
  button: {
    marginVertical: Spacing['1'],
  },
});

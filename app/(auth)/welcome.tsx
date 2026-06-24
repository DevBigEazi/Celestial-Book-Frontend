import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Spacing } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Welcome() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={styles.brandContainer}>
        {/* Typographic Logo & Icon */}
        <Ionicons name="book" size={80} color={colors.accent} style={styles.logoIcon} />
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
  logoIcon: {
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

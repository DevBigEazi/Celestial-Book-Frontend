import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useTheme, ThemeMode } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Spacing, Radius } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const router = useRouter();
  const { colors, mode, setMode } = useTheme();
  const { logout, resetOnboarding } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch {
            // Ignored
          }
        },
      },
    ]);
  };

  const handleMockAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <ScreenWrapper scrollEnabled={true} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Typography variant="heading" color={colors.textPrimary} style={styles.headerTitle}>
          Settings
        </Typography>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Typography variant="label" color={colors.textMuted} style={styles.sectionLabel}>
          ACCOUNT
        </Typography>
        <View style={[styles.sectionContent, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Pressable
            onPress={() => handleMockAlert('Edit Profile', 'Edit Profile form. (Mock only)')}
            style={[styles.row, { borderBottomColor: colors.divider }]}
          >
            <Typography variant="body" color={colors.textPrimary}>Edit Profile</Typography>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
          <Pressable
            onPress={() => handleMockAlert('Change Password', 'Check your email for password reset links.')}
            style={[styles.row, { borderBottomColor: colors.divider }]}
          >
            <Typography variant="body" color={colors.textPrimary}>Change Password</Typography>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
          <Pressable
            onPress={() => handleMockAlert('Delete Account', 'Mock deletion requested.')}
            style={styles.row}
          >
            <Typography variant="body" color={colors.error}>Delete Account</Typography>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Typography variant="label" color={colors.textMuted} style={styles.sectionLabel}>
          APPEARANCE
        </Typography>
        <View style={[styles.sectionContent, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.appearanceRow}>
            <Typography variant="body" color={colors.textPrimary}>Theme Mode</Typography>
            <View style={styles.themeToggleGroup}>
              {(['light', 'dark', 'system'] as ThemeMode[]).map((t) => {
                const isActive = mode === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setMode(t)}
                    style={[
                      styles.toggleBtn,
                      { backgroundColor: isActive ? colors.accent : colors.bgSecondary },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      color={isActive ? colors.accentText : colors.textPrimary}
                      style={styles.toggleText}
                    >
                      {t.toUpperCase()}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Typography variant="label" color={colors.textMuted} style={styles.sectionLabel}>
          READING PREFERENCES
        </Typography>
        <View style={[styles.sectionContent, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Pressable
            onPress={() => {
              Alert.alert('Retake Quiz', 'Would you like to reset and retake onboarding?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Retake',
                  onPress: async () => {
                    try {
                      await resetOnboarding();
                    } catch {
                      // Ignored
                    }
                  },
                },
              ]);
            }}
            style={styles.row}
          >
            <Typography variant="body" color={colors.textPrimary}>Re-take Onboarding Quiz</Typography>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Typography variant="label" color={colors.textMuted} style={styles.sectionLabel}>
          SUPPORT
        </Typography>
        <View style={[styles.sectionContent, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Pressable
            onPress={() => handleMockAlert('Support', 'Contacting support...')}
            style={[styles.row, { borderBottomColor: colors.divider }]}
          >
            <Typography variant="body" color={colors.textPrimary}>Contact Support</Typography>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
          <Pressable
            onPress={() => handleMockAlert('Help', 'Opening help center...')}
            style={styles.row}
          >
            <Typography variant="body" color={colors.textPrimary}>Help Center</Typography>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* App Section */}
      <View style={styles.section}>
        <Typography variant="label" color={colors.textMuted} style={styles.sectionLabel}>
          APP
        </Typography>
        <View style={[styles.sectionContent, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.row, { borderBottomColor: colors.divider }]}>
            <Typography variant="body" color={colors.textPrimary}>Version</Typography>
            <Typography variant="mono" color={colors.textSecondary}>{appVersion}</Typography>
          </View>
          <Pressable
            onPress={() => handleMockAlert('Licenses', 'MIT License')}
            style={styles.row}
          >
            <Typography variant="body" color={colors.textPrimary}>Open Source Licenses</Typography>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* Sign Out Button */}
      <Button
        variant="danger"
        label="Sign Out"
        onPress={handleSignOut}
        fullWidth
        style={styles.signOutBtn}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['4'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing['4'],
    marginBottom: Spacing['6'],
  },
  backBtn: {
    marginRight: Spacing['4'],
  },
  headerTitle: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing['5'],
  },
  sectionLabel: {
    fontWeight: 'bold',
    marginBottom: Spacing['2'],
    fontFamily: 'GeistMono_500Medium',
  },
  sectionContent: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing['4'],
    paddingHorizontal: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Default override
  },
  appearanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing['4'],
    paddingHorizontal: Spacing['4'],
  },
  themeToggleGroup: {
    flexDirection: 'row',
    gap: Spacing['1'],
  },
  toggleBtn: {
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.sm,
  },
  toggleText: {
    fontWeight: 'bold',
  },
  signOutBtn: {
    marginTop: Spacing['6'],
    marginBottom: Spacing['12'],
  },
});

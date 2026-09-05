import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Spacing, Radius, TYPOGRAPHY_OPTIONS, TypographyChoice } from '../../src/constants/theme';
import { SKY_PRESETS, SkyThemeKey, AccentChoice } from '../../src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const NATIVE_LANGUAGES = [
  'English',
  'Français (French)',
  'Español (Spanish)',
  'Deutsch (German)',
  'Italiano (Italian)',
  '日本語 (Japanese)',
  '한국어 (Korean)',
  '中文 (Chinese)',
  'Português (Portuguese)',
  'Русский (Russian)',
  'العربية (Arabic)',
  'हिन्दी (Hindi)',
  'Nederlands (Dutch)',
];

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, setMode, isDark, skyTheme, setSkyTheme, accentColor, setAccentColor, typographyChoice, setTypographyChoice } = useTheme();
  const { user, readerPersona, logout } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const displayPersona = readerPersona || {
    name: 'The Midnight Romancer',
    tagline: 'Romantic · Atmospheric · Slow Burn',
  };

  const handleSendSignal = () => {
    Alert.alert('Signal Transmitted', 'Your quiet message has reached the Celestial team.');
    setContactMessage('');
    setShowContactModal(false);
  };

  const handleLogout = () => {
    Alert.alert('Depart Sanctuary', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const handleConfirmCancelAccount = () => {
    setShowCancelModal(false);
    logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          YOUR ORBIT
        </Typography>
        <Typography variant="caption" color={colors.accent} style={styles.subtitle}>
          SETTINGS &amp; SANCTUARY CONTROLS
        </Typography>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: User & Persona Profile */}
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: user?.avatarUrl || 'https://i.pravatar.cc/150?u=celestial' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Typography variant="title" color={colors.textPrimary}>
                {user?.name || 'Fellow Wanderer'}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                @{user?.username || 'reader'}
              </Typography>
              <View style={[styles.personaPill, { backgroundColor: colors.accentMuted, borderColor: colors.accent }]}>
                <Ionicons name="star" size={12} color={colors.accent} style={{ marginRight: 4 }} />
                <Typography variant="caption" color={colors.accent} style={styles.personaPillText}>
                  {displayPersona.name.toUpperCase()}
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* Section 2: Personal Appearance */}
        <Typography variant="subtitle" color={colors.textPrimary} style={styles.sectionTitle}>
          Personal Appearance
        </Typography>

        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          {/* Theme Mode Toggles */}
          <Typography variant="body" color={colors.textPrimary} style={styles.settingLabel}>
            Theme Mode
          </Typography>
          <View style={[styles.segmentedRow, { backgroundColor: colors.bgSecondary }]}>
            {(['light', 'dark', 'system'] as const).map((tMode) => {
              const isSelected = mode === tMode;
              const labels: Record<string, string> = { light: 'Light', dark: 'Dark', system: 'System' };
              return (
                <Pressable
                  key={tMode}
                  onPress={() => setMode(tMode)}
                  style={[
                    styles.segmentBtn,
                    isSelected && { backgroundColor: colors.accent },
                  ]}
                >
                  <Typography
                    variant="caption"
                    color={isSelected ? colors.accentText : colors.textSecondary}
                    style={isSelected ? styles.activeSegmentText : undefined}
                  >
                    {labels[tMode]}
                  </Typography>
                </Pressable>
              );
            })}
          </View>

          {/* 8 Celestial Skies (Active in Dark mode) */}
          {isDark && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <Typography variant="body" color={colors.textPrimary} style={styles.settingLabel}>
                Celestial Sky Presets
              </Typography>
              <View style={styles.skyGrid}>
                {Object.keys(SKY_PRESETS).map((key) => {
                  const preset = SKY_PRESETS[key as SkyThemeKey];
                  const isSelected = skyTheme === preset.id;
                  return (
                    <Pressable
                      key={preset.id}
                      onPress={() => setSkyTheme(preset.id)}
                      style={[
                        styles.skyCard,
                        {
                          backgroundColor: preset.bgPrimary,
                          borderColor: isSelected ? colors.accent : colors.border,
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                    >
                      <View style={[styles.skyDot, { backgroundColor: preset.borderStrong }]} />
                      <Typography
                        variant="caption"
                        color={isSelected ? colors.accent : '#C8C4BA'}
                        style={styles.skyName}
                        numberOfLines={1}
                      >
                        {preset.name}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {/* Accent Color Switcher (Gold vs Blue) */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <Typography variant="body" color={colors.textPrimary} style={styles.settingLabel}>
            Accent Highlight
          </Typography>
          <View style={styles.accentChoiceRow}>
            {(['gold', 'blue'] as AccentChoice[]).map((acc) => {
              const isSelected = accentColor === acc;
              const colorVal = acc === 'gold' ? '#E5C158' : '#3B82F6';
              return (
                <Pressable
                  key={acc}
                  onPress={() => setAccentColor(acc)}
                  style={[
                    styles.accentChoiceBtn,
                    {
                      backgroundColor: isSelected ? colors.bgSecondary : 'transparent',
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <View style={[styles.accentCircle, { backgroundColor: colorVal }]} />
                  <Typography variant="body" color={colors.textPrimary}>
                    {acc === 'gold' ? 'Celestial Gold' : 'Celestial Blue'}
                  </Typography>
                </Pressable>
              );
            })}
          </View>

          {/* Typography Choice */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <Typography variant="body" color={colors.textPrimary} style={styles.settingLabel}>
            Reading Typography
          </Typography>
          <View style={styles.typoGrid}>
            {TYPOGRAPHY_OPTIONS.map((opt) => {
              const isSelected = typographyChoice === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setTypographyChoice(opt.id as TypographyChoice)}
                  style={[
                    styles.typoCard,
                    {
                      backgroundColor: isSelected ? colors.accentMuted : colors.bgSecondary,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Typography
                    variant="title"
                    color={isSelected ? colors.accent : colors.textPrimary}
                    style={opt.isItalic ? { fontStyle: 'italic' } : undefined}
                  >
                    {opt.sample}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                    {opt.name}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section 3: Language & Identity */}
        <Typography variant="subtitle" color={colors.textPrimary} style={styles.sectionTitle}>
          Language &amp; Region
        </Typography>

        <Pressable
          onPress={() => setShowLanguageModal(true)}
          style={[styles.rowButton, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="globe-outline" size={20} color={colors.accent} />
            <View>
              <Typography variant="body" color={colors.textPrimary}>
                App Language
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {selectedLanguage}
              </Typography>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>

        {/* Section 4: Contact & Help */}
        <Typography variant="subtitle" color={colors.textPrimary} style={styles.sectionTitle}>
          Sanctuary Support
        </Typography>

        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Pressable onPress={() => setShowContactModal(true)} style={styles.menuRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="mail-outline" size={20} color={colors.accent} />
              <Typography variant="body" color={colors.textPrimary}>
                Send a Signal (Contact Us)
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <Pressable
            onPress={() =>
              Alert.alert('Sanctuary Help', 'Celestial is built to help stories find their true readers. Reach out anytime at support@celestialbook.app.')
            }
            style={styles.menuRow}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="help-circle-outline" size={20} color={colors.accent} />
              <Typography variant="body" color={colors.textPrimary}>
                Help &amp; FAQs
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <Pressable onPress={handleLogout} style={styles.menuRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="log-out-outline" size={20} color={colors.textSecondary} />
              <Typography variant="body" color={colors.textSecondary}>
                Sign Out
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <Pressable onPress={() => setShowCancelModal(true)} style={styles.menuRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Typography variant="body" color="#EF4444">
                Cancel Account
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#EF4444" />
          </Pressable>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={showLanguageModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Typography variant="title" color={colors.textPrimary} style={{ marginBottom: Spacing['4'] }}>
              Select Language
            </Typography>
            <ScrollView style={{ maxHeight: 320 }}>
              {NATIVE_LANGUAGES.map((lang) => (
                <Pressable
                  key={lang}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageModal(false);
                  }}
                  style={styles.langItem}
                >
                  <Typography
                    variant="body"
                    color={selectedLanguage === lang ? colors.accent : colors.textPrimary}
                    style={selectedLanguage === lang ? { fontWeight: '700' } : undefined}
                  >
                    {lang}
                  </Typography>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setShowLanguageModal(false)} style={styles.closeBtn}>
              <Typography variant="body" color={colors.accent} align="center">
                Done
              </Typography>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Contact Modal */}
      <Modal visible={showContactModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Typography variant="title" color={colors.textPrimary}>
              Send a Signal
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginVertical: Spacing['2'] }}>
              Transmit a message to the Celestial guardians.
            </Typography>
            <TextInput
              value={contactMessage}
              onChangeText={setContactMessage}
              placeholder="Your thoughts, feedback, or inquiry..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.modalTextInput,
                { color: colors.textPrimary, backgroundColor: colors.bgSecondary, borderColor: colors.border },
              ]}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActionsRow}>
              <Pressable onPress={() => setShowContactModal(false)} style={styles.modalCancelBtn}>
                <Typography variant="body" color={colors.textMuted}>
                  Cancel
                </Typography>
              </Pressable>
              <Pressable onPress={handleSendSignal} style={[styles.modalSendBtn, { backgroundColor: colors.accent }]}>
                <Typography variant="body" color={colors.accentText} style={{ fontWeight: '700' }}>
                  Transmit
                </Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Account Confirmation Modal */}
      <Modal visible={showCancelModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Typography variant="title" color="#EF4444">
              Cancel Account
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={{ marginVertical: Spacing['3'], lineHeight: 22 }}>
              Are you certain you wish to close your sanctuary? Your saved stars, reading persona, and circle notes will be dissolved.
            </Typography>
            <View style={styles.modalActionsRow}>
              <Pressable onPress={() => setShowCancelModal(false)} style={styles.modalCancelBtn}>
                <Typography variant="body" color={colors.textPrimary}>
                  Keep Orbit
                </Typography>
              </Pressable>
              <Pressable onPress={handleConfirmCancelAccount} style={[styles.modalSendBtn, { backgroundColor: '#EF4444' }]}>
                <Typography variant="body" color="#FFFFFF" style={{ fontWeight: '700' }}>
                  Dissolve Account
                </Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing['6'],
    paddingTop: Spacing['6'],
    paddingBottom: Spacing['3'],
  },
  subtitle: {
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing['6'],
    paddingBottom: Spacing['6'],
  },
  sectionTitle: {
    marginTop: Spacing['6'],
    marginBottom: Spacing['3'],
  },
  card: {
    padding: Spacing['4'],
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['4'],
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
  },
  profileInfo: {
    flex: 1,
  },
  personaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing['3'],
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginTop: 6,
  },
  personaPillText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  settingLabel: {
    marginBottom: Spacing['3'],
    fontWeight: '600',
  },
  segmentedRow: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  activeSegmentText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: Spacing['4'],
  },
  skyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
  },
  skyCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing['3'],
    borderRadius: Radius.md,
    gap: Spacing['2'],
  },
  skyDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  skyName: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  accentChoiceRow: {
    flexDirection: 'row',
    gap: Spacing['3'],
  },
  accentChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    padding: Spacing['3'],
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  accentCircle: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
  },
  typoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
  },
  typoCard: {
    width: '48%',
    padding: Spacing['3'],
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing['4'],
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing['2'],
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 6, 11, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['6'],
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing['6'],
  },
  langItem: {
    paddingVertical: Spacing['3'],
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeBtn: {
    marginTop: Spacing['4'],
    paddingVertical: Spacing['2'],
  },
  modalTextInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing['3'],
    textAlignVertical: 'top',
    fontSize: 14,
    minHeight: 80,
    marginBottom: Spacing['4'],
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing['3'],
  },
  modalCancelBtn: {
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['2'],
  },
  modalSendBtn: {
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.md,
  },
});

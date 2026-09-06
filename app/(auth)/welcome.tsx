import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Spacing, Radius } from '../../src/constants/theme';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Welcome() {
  const router = useRouter();
  const { colors } = useTheme();
  const [showAiModal, setShowAiModal] = useState(false);

  const handleProceedWithAi = async (enableAi: boolean) => {
    try {
      await AsyncStorage.setItem('@cb/ai_enabled', enableAi ? 'true' : 'false');
    } catch {
      // Ignored
    }
    setShowAiModal(false);
    router.push('/(auth)/onboarding');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Brand & Manifesto Section */}
      <View style={styles.brandContainer}>
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logoImage}
          contentFit="contain"
        />

        <Typography variant="display" color={colors.textPrimary} align="center">
          CELESTIAL
        </Typography>

        <Typography
          variant="caption"
          color={colors.accent}
          align="center"
          style={styles.subtitle}
        >
          WHERE STORIES FIND THEIR READERS
        </Typography>

        {/* Manifesto Card */}
        <View
          style={[
            styles.manifestoCard,
            { backgroundColor: colors.bgSecondary, borderColor: colors.border },
          ]}
        >
          <Typography
            variant="body"
            color={colors.textPrimary}
            align="center"
            style={styles.manifestoQuote}
          >
            &ldquo;A book is not content. It is a constellation of human thought, feeling, and wonder.&rdquo;
          </Typography>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <Typography
            variant="caption"
            color={colors.textSecondary}
            align="center"
            style={styles.manifestoBody}
          >
            We believe reading is the quietest rebellion against a loud world.
            Not algorithms chasing trends, but starlight guiding you home.
          </Typography>
        </View>
      </View>

      {/* Primary Actions */}
      <View style={styles.actionsContainer}>
        <Button
          variant="primary"
          label="Begin your journey"
          fullWidth
          onPress={() => setShowAiModal(true)}
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

      {/* AI Recommendation Permission Modal */}
      <Modal
        visible={showAiModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAiModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
            ]}
          >
            <Typography
              variant="title"
              color={colors.textPrimary}
              align="center"
              style={styles.modalTitle}
            >
              Use AI Recommendations?
            </Typography>

            <Typography
              variant="body"
              color={colors.textSecondary}
              align="center"
              style={styles.modalBody}
            >
              Celestial uses quiet intelligence to match books with your deepest
              moods, tropes, and reading persona. You can change this anytime in
              Settings.
            </Typography>

            <View style={styles.modalActions}>
              <Button
                variant="primary"
                label="Enable AI matching"
                fullWidth
                onPress={() => handleProceedWithAi(true)}
              />
              <Button
                variant="outline"
                label="Browse manually"
                fullWidth
                onPress={() => handleProceedWithAi(false)}
              />
              <Pressable
                onPress={() => setShowAiModal(false)}
                style={styles.dismissButton}
              >
                <Typography variant="caption" color={colors.textMuted} align="center">
                  Cancel
                </Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 96,
    height: 96,
    marginBottom: Spacing['3'],
  },
  subtitle: {
    letterSpacing: 3,
    fontWeight: '600',
    marginTop: Spacing['1'],
    marginBottom: Spacing['6'],
  },
  manifestoCard: {
    padding: Spacing['5'],
    borderRadius: Radius.lg,
    borderWidth: 1,
    maxWidth: 340,
    width: '100%',
  },
  manifestoQuote: {
    fontStyle: 'italic',
    lineHeight: 22,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: Spacing['3'],
  },
  manifestoBody: {
    lineHeight: 18,
  },
  actionsContainer: {
    gap: Spacing['3'],
  },
  button: {
    marginVertical: Spacing['1'],
  },
  modalOverlay: {
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
  modalTitle: {
    marginBottom: Spacing['3'],
  },
  modalBody: {
    marginBottom: Spacing['6'],
    lineHeight: 22,
  },
  modalActions: {
    gap: Spacing['3'],
  },
  dismissButton: {
    paddingVertical: Spacing['2'],
  },
});

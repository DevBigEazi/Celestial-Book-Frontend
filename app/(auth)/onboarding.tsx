import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Spacing, Radius, Shadow } from '../../src/constants/theme';

interface StepConfig {
  title: string;
  question: string;
  type: 'single' | 'multi';
  options: string[];
  minSelections?: number;
  maxSelections?: number;
}

const ONBOARDING_STEPS: StepConfig[] = [
  {
    title: 'Genres',
    question: 'Select your favorite genres (choose at least 1):',
    type: 'multi',
    options: ['Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Biography', 'History', 'Self-Help'],
    minSelections: 1,
  },
  {
    title: 'Reading Mood',
    question: 'What is your typical reading mood?',
    type: 'single',
    options: ['Adventurous', 'Cosy', 'Thoughtful', 'Escapist'],
  },
  {
    title: 'Personality',
    question: 'Which best describes your reading personality?',
    type: 'single',
    options: ['Explorer', 'Comfort Seeker', 'Deep Thinker', 'Thrill Seeker'],
  },
  {
    title: 'Tropes',
    question: 'Select your favorite tropes (choose 1 to 5):',
    type: 'multi',
    options: ['Enemies to Lovers', 'Found Family', 'Chosen One', 'Time Loop', 'Secret Identity', 'Reluctant Hero', 'Fated Mates'],
    minSelections: 1,
    maxSelections: 5,
  },
  {
    title: 'Reading Habit',
    question: 'How often do you read?',
    type: 'single',
    options: ['Daily', 'A few times a week', 'Weekends only', 'Occasionally'],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { colors } = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Store user selections: keys are step indexes, values are selected options
  const [selections, setSelections] = useState<Record<number, string[]>>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  });

  const step = ONBOARDING_STEPS[currentStepIndex];
  const stepSelections = selections[currentStepIndex] || [];

  const handleOptionPress = (option: string) => {
    if (step.type === 'single') {
      setSelections((prev) => ({
        ...prev,
        [currentStepIndex]: [option],
      }));
    } else {
      const isSelected = stepSelections.includes(option);
      let nextSelections: string[];

      if (isSelected) {
        nextSelections = stepSelections.filter((item) => item !== option);
      } else {
        const max = step.maxSelections || Infinity;
        if (stepSelections.length < max) {
          nextSelections = [...stepSelections, option];
        } else {
          return; // Max selections reached
        }
      }

      setSelections((prev) => ({
        ...prev,
        [currentStepIndex]: nextSelections,
      }));
    }
  };

  const handleNext = async () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Save results on the final step
      try {
        await AsyncStorage.setItem('@onboarding_complete', 'true');
        await AsyncStorage.setItem('@onboarding_answers', JSON.stringify(selections));
        router.replace('/(auth)/register');
      } catch (e) {
        // Fallback redirection
        router.replace('/(auth)/register');
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Validate if step is complete (Next button should be enabled)
  const isStepValid = () => {
    if (step.type === 'single') {
      return stepSelections.length === 1;
    }
    const min = step.minSelections || 0;
    return stepSelections.length >= min;
  };

  const progressPercent = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Progress Bar Header */}
      <View style={styles.header}>
        <View style={[styles.progressBarBg, { backgroundColor: colors.bgSecondary }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%`, backgroundColor: colors.accent },
            ]}
          />
        </View>
        <Typography variant="label" color={colors.textMuted} style={styles.progressText}>
          Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length} — {step.title}
        </Typography>
      </View>

      {/* Quiz Body */}
      <View style={styles.quizBody}>
        <Typography variant="title" color={colors.textPrimary} style={styles.questionText}>
          {step.question}
        </Typography>

        <View style={styles.optionsContainer}>
          {step.options.map((option) => {
            const isSelected = stepSelections.includes(option);
            return (
              <Pressable
                key={option}
                onPress={() => handleOptionPress(option)}
                style={({ pressed }) => [
                  styles.optionItem,
                  {
                    backgroundColor: isSelected ? colors.bgSecondary : colors.bgPrimary,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Typography
                  variant="body"
                  color={isSelected ? colors.textAccent : colors.textPrimary}
                  style={styles.optionLabel}
                >
                  {option}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Footer Navigation Buttons */}
      <View style={styles.footer}>
        {currentStepIndex > 0 ? (
          <Button
            variant="outline"
            label="Back"
            onPress={handleBack}
            style={styles.navButton}
          />
        ) : (
          <View style={styles.navSpacer} />
        )}
        <Button
          variant="primary"
          label={currentStepIndex === ONBOARDING_STEPS.length - 1 ? 'Finish' : 'Next'}
          onPress={handleNext}
          disabled={!isStepValid()}
          style={styles.navButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['5'],
  },
  header: {
    paddingTop: Spacing['4'],
    marginBottom: Spacing['6'],
  },
  progressBarBg: {
    height: 6,
    borderRadius: Radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  progressText: {
    marginTop: Spacing['2'],
    fontFamily: 'GeistMono_500Medium',
  },
  quizBody: {
    flex: 1,
  },
  questionText: {
    marginBottom: Spacing['6'],
  },
  optionsContainer: {
    gap: Spacing['3'],
  },
  optionItem: {
    paddingVertical: Spacing['4'],
    paddingHorizontal: Spacing['5'],
    borderWidth: 1,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  optionLabel: {
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Spacing['6'],
    gap: Spacing['4'],
  },
  navButton: {
    flex: 1,
  },
  navSpacer: {
    flex: 1,
  },
});

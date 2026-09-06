import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { DualPoleSlider } from '../../src/components/ui/DualPoleSlider';
import { Spacing, Radius } from '../../src/constants/theme';
import { MoodSpectrum, QuizResult, ReaderPersona } from '../../src/types';

const TOTAL_STEPS = 5;

const DEEP_QUESTIONS = [
  {
    id: 'q1',
    question: 'Do you read to escape this world, or to understand it deeper?',
    options: ['To escape into other realities', 'To understand this one deeper'],
  },
  {
    id: 'q2',
    question: 'Can you forgive a slow beginning if the ending shatters you?',
    options: ['Yes, destroy me in the end', 'No, hook me from chapter one'],
  },
  {
    id: 'q3',
    question: 'Do you fall in love with characters or the world they live in?',
    options: ['The characters and their fractures', 'The world and its atmosphere'],
  },
];

const AVAILABLE_TROPES = [
  'Slow Burn',
  'Forbidden Love',
  'Dark Academia',
  'Found Family',
  'Morally Gray',
  'Enemies to Lovers',
  'Yearning',
  'Hidden Magic',
  'Forced Proximity',
];

const AVAILABLE_GENRES = [
  'Fantasy',
  'Literary Fiction',
  'Historical',
  'Mystery / Gothic',
  'Sci-Fi',
  'Romance',
  'Poetry',
];

export default function Onboarding() {
  const router = useRouter();
  const { colors } = useTheme();
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Part I: Deep Resonance Selections
  const [deepAnswers, setDeepAnswers] = useState<Record<string, string>>({});

  // Part II: Mood Spectrum Sliders
  const [moodSliders, setMoodSliders] = useState<MoodSpectrum>({
    pacing: -1, // Slow Burn
    tone: -1, // Tender
    ending: -1, // Bittersweet
    scope: 0, // Balanced
    pov: -1, // First Person
  });

  // Part III: In Your Own Words
  const [takeYouText, setTakeYouText] = useState('');
  const [resideBookText, setResideBookText] = useState('');

  // Part IV: Tropes & Genres
  const [selectedTropes, setSelectedTropes] = useState<string[]>(['Slow Burn', 'Yearning']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Fantasy', 'Literary Fiction']);

  // Handle Trope Toggle
  const toggleTrope = (trope: string) => {
    if (selectedTropes.includes(trope)) {
      setSelectedTropes(selectedTropes.filter((t) => t !== trope));
    } else if (selectedTropes.length < 5) {
      setSelectedTropes([...selectedTropes, trope]);
    }
  };

  // Handle Genre Toggle
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Derive active persona
  const derivePersona = (): ReaderPersona => {
    const primaryGenre = selectedGenres[0] || 'Literary Fiction';
    const primaryTrope = selectedTropes[0] || 'Slow Burn';

    let title = 'The Midnight Romancer';
    let tagline = 'Romantic · Atmospheric · Slow Burn';
    let description =
      'You seek stories that linger in the dark like candlelight. Emotional depth and slow-burning tension speak louder to you than mere plot velocity.';

    if (primaryTrope === 'Dark Academia' || primaryGenre === 'Mystery / Gothic') {
      title = 'The Scholar of Shadows';
      tagline = 'Dark Academia · Intellectual · Haunting';
      description =
        'Drawn to arcane libraries, morally gray allegiances, and obsessive intellects. You read for the chill of forbidden revelations.';
    } else if (primaryTrope === 'Found Family' || primaryGenre === 'Fantasy') {
      title = 'The Realm Wanderer';
      tagline = 'Mythic · Found Family · Lyrical';
      description =
        'You seek grand mythical sanctuaries where broken travelers find kin under starlit skies.';
    }

    return {
      name: title,
      title,
      tagline,
      description,
      genres: selectedGenres,
      tropes: selectedTropes,
    };
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return Object.keys(deepAnswers).length === DEEP_QUESTIONS.length;
    }
    if (currentStep === 1) {
      return true; // Sliders are always valid
    }
    if (currentStep === 2) {
      return true; // Free text inputs are optional but encouraged
    }
    if (currentStep === 3) {
      return selectedTropes.length >= 1 && selectedGenres.length >= 1;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = async () => {
    const persona = derivePersona();
    const quizResult: QuizResult = {
      genres: selectedGenres,
      tropes: selectedTropes,
      moodSliders,
      whereShouldStoryTakeYou: takeYouText,
      currentResidingBook: resideBookText,
      mood: selectedTropes[0] || 'Atmospheric',
      personality: persona.name,
      readingHabit: 'Daily',
    };

    await completeOnboarding(quizResult, persona);
    router.replace('/(tabs)/home');
  };

  const progressPercent = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const persona = derivePersona();

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={[styles.progressBarBg, { backgroundColor: colors.bgSecondary }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%`, backgroundColor: colors.accent },
            ]}
          />
        </View>
        <Typography variant="caption" color={colors.textSecondary} align="center">
          PART {currentStep + 1} OF {TOTAL_STEPS}
        </Typography>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 0: Part I — Deep Resonance Questions */}
        {currentStep === 0 && (
          <View style={styles.stepBlock}>
            <Typography variant="title" color={colors.textPrimary} style={styles.stepTitle}>
              Deep Resonance
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.stepSubtitle}>
              Three questions to map your instinctive reader soul.
            </Typography>

            {DEEP_QUESTIONS.map((q) => (
              <View key={q.id} style={styles.deepQuestionBlock}>
                <Typography variant="subtitle" color={colors.textPrimary} style={styles.questionText}>
                  {q.question}
                </Typography>
                <View style={styles.optionsCol}>
                  {q.options.map((opt) => {
                    const isSelected = deepAnswers[q.id] === opt;
                    return (
                      <Pressable
                        key={opt}
                        onPress={() => setDeepAnswers({ ...deepAnswers, [q.id]: opt })}
                        style={[
                          styles.choiceCard,
                          {
                            backgroundColor: isSelected ? colors.bgSecondary : colors.bgCard,
                            borderColor: isSelected ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Typography
                          variant="body"
                          color={isSelected ? colors.accent : colors.textPrimary}
                          style={isSelected ? styles.selectedText : undefined}
                        >
                          {opt}
                        </Typography>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Step 1: Part II — Mood Spectrum Sliders */}
        {currentStep === 1 && (
          <View style={styles.stepBlock}>
            <Typography variant="title" color={colors.textPrimary} style={styles.stepTitle}>
              Tune Your Mood Spectrum
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.stepSubtitle}>
              Slide between the dual poles of reading tension.
            </Typography>

            <DualPoleSlider
              leftLabel="Slow Burn"
              rightLabel="Fast Plot"
              value={moodSliders.pacing}
              onChange={(val) => setMoodSliders({ ...moodSliders, pacing: val })}
            />

            <DualPoleSlider
              leftLabel="Tender"
              rightLabel="Brutal"
              value={moodSliders.tone}
              onChange={(val) => setMoodSliders({ ...moodSliders, tone: val })}
            />

            <DualPoleSlider
              leftLabel="Bittersweet"
              rightLabel="Triumphant"
              value={moodSliders.ending}
              onChange={(val) => setMoodSliders({ ...moodSliders, ending: val })}
            />

            <DualPoleSlider
              leftLabel="Intimate Room"
              rightLabel="Whole Empire"
              value={moodSliders.scope}
              onChange={(val) => setMoodSliders({ ...moodSliders, scope: val })}
            />

            <DualPoleSlider
              leftLabel="First Person"
              rightLabel="Third Person"
              value={moodSliders.pov}
              onChange={(val) => setMoodSliders({ ...moodSliders, pov: val })}
            />
          </View>
        )}

        {/* Step 2: Part III — In Your Own Words */}
        {currentStep === 2 && (
          <View style={styles.stepBlock}>
            <Typography variant="title" color={colors.textPrimary} style={styles.stepTitle}>
              In Your Own Words
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.stepSubtitle}>
              Speak directly to the quiet intelligence of Celestial.
            </Typography>

            <View style={styles.inputGroup}>
              <Typography variant="subtitle" color={colors.textPrimary} style={styles.inputLabel}>
                Where do you want a story to take you?
              </Typography>
              <TextInput
                value={takeYouText}
                onChangeText={setTakeYouText}
                placeholder="e.g., A rainy coastal library where secrets slumber..."
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.textInput,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bgCard,
                    borderColor: colors.border,
                  },
                ]}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Typography variant="subtitle" color={colors.textPrimary} style={styles.inputLabel}>
                What book do you currently reside in?
              </Typography>
              <TextInput
                value={resideBookText}
                onChangeText={setResideBookText}
                placeholder="e.g., Piranesi, The Night Circus, Babel..."
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.textInput,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bgCard,
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Step 3: Part IV — Tropes & Genres */}
        {currentStep === 3 && (
          <View style={styles.stepBlock}>
            <Typography variant="title" color={colors.textPrimary} style={styles.stepTitle}>
              Tropes & Sacred Genres
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.stepSubtitle}>
              Choose your emotional anchors (choose 1 to 5 tropes).
            </Typography>

            <Typography variant="caption" color={colors.accent} style={styles.sectionHeading}>
              BELOVED TROPES
            </Typography>
            <View style={styles.chipsWrap}>
              {AVAILABLE_TROPES.map((trope) => {
                const isSelected = selectedTropes.includes(trope);
                return (
                  <Pressable
                    key={trope}
                    onPress={() => toggleTrope(trope)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.accent : colors.bgCard,
                        borderColor: isSelected ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      color={isSelected ? colors.accentText : colors.textPrimary}
                      style={styles.chipText}
                    >
                      {trope}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>

            <Typography variant="caption" color={colors.accent} style={styles.sectionHeading}>
              FAVORITE GENRES
            </Typography>
            <View style={styles.chipsWrap}>
              {AVAILABLE_GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <Pressable
                    key={genre}
                    onPress={() => toggleGenre(genre)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.accent : colors.bgCard,
                        borderColor: isSelected ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      color={isSelected ? colors.accentText : colors.textPrimary}
                      style={styles.chipText}
                    >
                      {genre}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 4: Part V — Reveal My Persona */}
        {currentStep === 4 && (
          <View style={styles.stepBlock}>
            <Typography variant="title" color={colors.textPrimary} align="center" style={styles.stepTitle}>
              Your Reading Persona
            </Typography>
            <Typography variant="body" color={colors.textSecondary} align="center" style={styles.stepSubtitle}>
              Your unique reader profile is ready to guide you.
            </Typography>

            <View
              style={[
                styles.personaCard,
                { backgroundColor: colors.bgCard, borderColor: colors.accent },
              ]}
            >
              <View style={[styles.personaCapsule, { backgroundColor: colors.accentMuted, borderColor: colors.accent }]}>
                <Typography variant="caption" color={colors.accent} style={styles.personaCapsuleText}>
                  {persona.title?.toUpperCase() || persona.name.toUpperCase()}
                </Typography>
              </View>

              <Typography variant="body" color={colors.accent} align="center" style={styles.personaTagline}>
                {persona.tagline}
              </Typography>

              <Typography variant="body" color={colors.textSecondary} align="center" style={styles.personaDesc}>
                {persona.description}
              </Typography>

              <View style={[styles.personaDivider, { backgroundColor: colors.divider }]} />

              <View style={styles.personaChipsRow}>
                {selectedTropes.slice(0, 3).map((t) => (
                  <View key={t} style={[styles.miniBadge, { borderColor: colors.border }]}>
                    <Typography variant="caption" color={colors.textMuted}>
                      {t}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.footer, { backgroundColor: colors.bgPrimary, borderTopColor: colors.divider }]}>
        {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
          <Button
            variant="ghost"
            label="Back"
            onPress={() => setCurrentStep(currentStep - 1)}
            style={styles.backButton}
          />
        )}
        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            variant="primary"
            label={currentStep === 3 ? 'Reveal my persona' : 'Continue'}
            disabled={!isStepValid()}
            onPress={handleNext}
            style={styles.forwardButton}
          />
        ) : (
          <Button
            variant="primary"
            label="Enter Celestial"
            fullWidth
            onPress={handleFinish}
          />
        )}
      </View>
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
  progressBarBg: {
    height: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing['2'],
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing['6'],
    paddingBottom: Spacing['10'],
  },
  stepBlock: {
    paddingTop: Spacing['4'],
  },
  stepTitle: {
    marginBottom: Spacing['2'],
  },
  stepSubtitle: {
    marginBottom: Spacing['6'],
    lineHeight: 22,
  },
  deepQuestionBlock: {
    marginBottom: Spacing['6'],
  },
  questionText: {
    marginBottom: Spacing['3'],
    fontWeight: '600',
  },
  optionsCol: {
    gap: Spacing['2'],
  },
  choiceCard: {
    padding: Spacing['4'],
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  selectedText: {
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: Spacing['5'],
  },
  inputLabel: {
    marginBottom: Spacing['2'],
  },
  textInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing['3'],
    fontSize: 15,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  sectionHeading: {
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: Spacing['4'],
    marginBottom: Spacing['3'],
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
    marginBottom: Spacing['3'],
  },
  chip: {
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: '500',
  },
  personaCard: {
    padding: Spacing['6'],
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    marginVertical: Spacing['4'],
  },
  personaCapsule: {
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
    borderWidth: 1,
    marginBottom: Spacing['3'],
  },
  personaCapsuleText: {
    letterSpacing: 2,
    fontWeight: '700',
  },
  personaTagline: {
    fontWeight: '600',
    marginBottom: Spacing['3'],
  },
  personaDesc: {
    lineHeight: 22,
  },
  personaDivider: {
    height: 1,
    width: '100%',
    marginVertical: Spacing['4'],
  },
  personaChipsRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  miniBadge: {
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['4'],
    borderTopWidth: 1,
    gap: Spacing['3'],
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
  },
  forwardButton: {
    flex: 2,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { MoodSpectrum, QuizResult, ReaderPersona } from "../../types";
import { Button } from "../ui/Button";
import { DualPoleSlider } from "../ui/DualPoleSlider";
import { Typography } from "../ui/Typography";

interface RetakePersonaModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (quiz: QuizResult, persona: ReaderPersona) => Promise<void>;
}

const DEEP_QUESTIONS = [
  {
    id: "q1",
    question: "Do you read to escape this world, or to understand it deeper?",
    options: [
      "To escape into other realities",
      "To understand this one deeper",
    ],
  },
  {
    id: "q2",
    question: "Can you forgive a slow beginning if the ending shatters you?",
    options: ["Yes, destroy me in the end", "No, hook me from chapter one"],
  },
  {
    id: "q3",
    question: "Do you fall in love with characters or the world they live in?",
    options: [
      "The characters and their fractures",
      "The world and its atmosphere",
    ],
  },
];

const AVAILABLE_TROPES = [
  "Slow Burn",
  "Forbidden Love",
  "Dark Academia",
  "Found Family",
  "Morally Gray",
  "Enemies to Lovers",
  "Yearning",
  "Hidden Magic",
  "Forced Proximity",
];

const AVAILABLE_GENRES = [
  "Fantasy",
  "Literary Fiction",
  "Historical",
  "Mystery / Gothic",
  "Sci-Fi",
  "Romance",
  "Poetry",
];

export function RetakePersonaModal({
  visible,
  onClose,
  onComplete,
}: RetakePersonaModalProps) {
  const { colors } = useTheme();

  const [step, setStep] = useState<number>(0);
  const [deepAnswers, setDeepAnswers] = useState<Record<string, string>>({});
  const [moodSliders, setMoodSliders] = useState<MoodSpectrum>({
    pacing: -1,
    tone: -1,
    ending: -1,
    scope: 0,
    pov: -1,
  });
  const [selectedTropes, setSelectedTropes] = useState<string[]>([
    "Slow Burn",
    "Yearning",
  ]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Fantasy",
    "Literary Fiction",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTrope = (trope: string) => {
    if (selectedTropes.includes(trope)) {
      setSelectedTropes(selectedTropes.filter((t) => t !== trope));
    } else if (selectedTropes.length < 5) {
      setSelectedTropes([...selectedTropes, trope]);
    }
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const derivePersona = (): ReaderPersona => {
    const primaryGenre = selectedGenres[0] || "Literary Fiction";
    const primaryTrope = selectedTropes[0] || "Slow Burn";

    let title = "The Midnight Romancer";
    let tagline = "Romantic · Atmospheric · Slow Burn";
    let description =
      "You seek stories that linger in the dark like candlelight. Emotional depth and slow-burning tension speak louder to you than mere plot velocity.";

    if (
      primaryTrope === "Dark Academia" ||
      primaryGenre === "Mystery / Gothic"
    ) {
      title = "The Scholar of Shadows";
      tagline = "Dark Academia · Intellectual · Haunting";
      description =
        "Drawn to arcane libraries, morally gray allegiances, and obsessive intellects. You read for the chill of forbidden revelations.";
    } else if (primaryTrope === "Found Family" || primaryGenre === "Fantasy") {
      title = "The Realm Wanderer";
      tagline = "Mythic · Found Family · Lyrical";
      description =
        "You seek grand mythical sanctuaries where broken travelers find kin under starlit skies.";
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

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const persona = derivePersona();
      const quiz: QuizResult = {
        moodSliders,
        whereShouldStoryTakeYou: "Quiet starlight",
        currentResidingBook: "Stories that outlast the night",
        genres: selectedGenres,
        tropes: selectedTropes,
      };
      await onComplete(quiz, persona);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const derived = derivePersona();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.bgCard, borderColor: colors.border },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Ionicons name="star-outline" size={20} color={colors.accent} />
              <Typography
                variant="title"
                color={colors.textPrimary}
                style={styles.title}
              >
                Recalibrate Reader Persona
              </Typography>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Step Indicator */}
          <View style={styles.stepRow}>
            {["Resonance", "Mood", "Aesthetic", "Reveal"].map((label, idx) => (
              <Pressable
                key={label}
                onPress={() => setStep(idx)}
                style={[
                  styles.stepPill,
                  {
                    backgroundColor:
                      step === idx ? colors.accent : colors.bgSecondary,
                    borderColor: step === idx ? colors.accent : colors.border,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={step === idx ? colors.bgPrimary : colors.textMuted}
                  style={styles.stepText}
                >
                  {label}
                </Typography>
              </Pressable>
            ))}
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Step 0: Deep Questions */}
            {step === 0 && (
              <View style={styles.stepContent}>
                <Typography
                  variant="body"
                  color={colors.accent}
                  style={styles.stepInstruction}
                >
                  1. Deep Resonance Questions
                </Typography>
                {DEEP_QUESTIONS.map((q) => (
                  <View key={q.id} style={styles.questionBlock}>
                    <Typography
                      variant="label"
                      color={colors.textPrimary}
                      style={styles.questionText}
                    >
                      {q.question}
                    </Typography>
                    {q.options.map((opt) => {
                      const isChosen = deepAnswers[q.id] === opt;
                      return (
                        <Pressable
                          key={opt}
                          onPress={() =>
                            setDeepAnswers((prev) => ({ ...prev, [q.id]: opt }))
                          }
                          style={[
                            styles.optionCard,
                            {
                              backgroundColor: isChosen
                                ? `${colors.accent}18`
                                : colors.bgSecondary,
                              borderColor: isChosen
                                ? colors.accent
                                : colors.border,
                            },
                          ]}
                        >
                          <Ionicons
                            name={
                              isChosen ? "radio-button-on" : "radio-button-off"
                            }
                            size={16}
                            color={isChosen ? colors.accent : colors.textMuted}
                          />
                          <Typography
                            variant="caption"
                            color={
                              isChosen ? colors.accent : colors.textPrimary
                            }
                            style={styles.optionText}
                          >
                            {opt}
                          </Typography>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>
            )}

            {/* Step 1: Mood Spectrum Sliders */}
            {step === 1 && (
              <View style={styles.stepContent}>
                <Typography
                  variant="body"
                  color={colors.accent}
                  style={styles.stepInstruction}
                >
                  2. Dual-Pole Mood Sliders
                </Typography>
                <View style={styles.sliderBox}>
                  <DualPoleSlider
                    leftLabel="Slow Burn"
                    rightLabel="Fast Paced"
                    value={moodSliders.pacing}
                    onChange={(v) =>
                      setMoodSliders((m) => ({ ...m, pacing: v }))
                    }
                  />
                  <DualPoleSlider
                    leftLabel="Tender & Emotional"
                    rightLabel="Dark & Ruthless"
                    value={moodSliders.tone}
                    onChange={(v) => setMoodSliders((m) => ({ ...m, tone: v }))}
                  />
                  <DualPoleSlider
                    leftLabel="Bittersweet"
                    rightLabel="Triumphant"
                    value={moodSliders.ending}
                    onChange={(v) =>
                      setMoodSliders((m) => ({ ...m, ending: v }))
                    }
                  />
                  <DualPoleSlider
                    leftLabel="Intimate & Quiet"
                    rightLabel="Epic & Vast"
                    value={moodSliders.scope}
                    onChange={(v) =>
                      setMoodSliders((m) => ({ ...m, scope: v }))
                    }
                  />
                  <DualPoleSlider
                    leftLabel="First Person (Close)"
                    rightLabel="Third Person (Omni)"
                    value={moodSliders.pov}
                    onChange={(v) => setMoodSliders((m) => ({ ...m, pov: v }))}
                  />
                </View>
              </View>
            )}

            {/* Step 2: Tropes & Genres */}
            {step === 2 && (
              <View style={styles.stepContent}>
                <Typography
                  variant="body"
                  color={colors.accent}
                  style={styles.stepInstruction}
                >
                  3. Tropes &amp; Genres
                </Typography>

                <Typography
                  variant="label"
                  color={colors.textPrimary}
                  style={styles.subHeading}
                >
                  Favorite Tropes (Up to 5)
                </Typography>
                <View style={styles.chipGrid}>
                  {AVAILABLE_TROPES.map((trope) => {
                    const active = selectedTropes.includes(trope);
                    return (
                      <Pressable
                        key={trope}
                        onPress={() => toggleTrope(trope)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: active
                              ? colors.accent
                              : colors.bgSecondary,
                            borderColor: active ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          color={active ? colors.bgPrimary : colors.textPrimary}
                          style={styles.chipText}
                        >
                          {trope}
                        </Typography>
                      </Pressable>
                    );
                  })}
                </View>

                <Typography
                  variant="label"
                  color={colors.textPrimary}
                  style={[styles.subHeading, { marginTop: Spacing["3"] }]}
                >
                  Favorite Genres
                </Typography>
                <View style={styles.chipGrid}>
                  {AVAILABLE_GENRES.map((genre) => {
                    const active = selectedGenres.includes(genre);
                    return (
                      <Pressable
                        key={genre}
                        onPress={() => toggleGenre(genre)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: active
                              ? colors.accent
                              : colors.bgSecondary,
                            borderColor: active ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          color={active ? colors.bgPrimary : colors.textPrimary}
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

            {/* Step 3: Reveal Summary */}
            {step === 3 && (
              <View style={styles.stepContent}>
                <Typography
                  variant="body"
                  color={colors.accent}
                  style={styles.stepInstruction}
                >
                  4. Your Recalibrated Persona
                </Typography>

                <View
                  style={[
                    styles.previewCard,
                    {
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.accent,
                    },
                  ]}
                >
                  <View style={styles.starWrap}>
                    <Ionicons name="star" size={24} color={colors.accent} />
                  </View>
                  <Typography
                    variant="title"
                    color={colors.textPrimary}
                    align="center"
                    style={styles.personaTitle}
                  >
                    {derived.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={colors.accent}
                    align="center"
                    style={styles.personaTagline}
                  >
                    {derived.tagline}
                  </Typography>
                  <Typography
                    variant="body"
                    color={colors.textSecondary}
                    align="center"
                    style={styles.personaDesc}
                  >
                    {derived.description}
                  </Typography>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Controls */}
          <View style={styles.modalFooter}>
            {step > 0 ? (
              <Button
                variant="outline"
                size="sm"
                label="Back"
                onPress={() => setStep((s) => s - 1)}
                style={styles.footerBtn}
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                label="Cancel"
                onPress={onClose}
                style={styles.footerBtn}
              />
            )}

            {step < 3 ? (
              <Button
                variant="primary"
                size="sm"
                label="Next Step →"
                onPress={() => setStep((s) => s + 1)}
                style={styles.footerBtn}
              />
            ) : (
              <Button
                variant="primary"
                size="sm"
                label={isSubmitting ? "Calibrating..." : "Apply Persona"}
                onPress={handleFinish}
                disabled={isSubmitting}
                style={styles.footerBtn}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["4"],
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing["4"],
    maxHeight: "88%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2"],
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
  },
  closeBtn: {
    padding: 4,
  },
  stepRow: {
    flexDirection: "row",
    gap: Spacing["2"],
    marginBottom: Spacing["3"],
  },
  stepPill: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: "center",
  },
  stepText: {
    fontWeight: "700",
    fontSize: 10,
  },
  modalScroll: {
    maxHeight: 380,
  },
  stepContent: {
    paddingVertical: Spacing["1"],
  },
  stepInstruction: {
    fontWeight: "700",
    marginBottom: Spacing["2"],
  },
  questionBlock: {
    marginBottom: Spacing["3"],
  },
  questionText: {
    fontWeight: "600",
    marginBottom: Spacing["2"],
    fontSize: 13,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["2"],
    padding: Spacing["3"],
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginBottom: Spacing["2"],
  },
  optionText: {
    flex: 1,
    fontWeight: "500",
  },
  sliderBox: {
    gap: Spacing["3"],
    paddingVertical: Spacing["1"],
  },
  subHeading: {
    fontWeight: "700",
    marginBottom: Spacing["2"],
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
  },
  chip: {
    paddingHorizontal: Spacing["3"],
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: "600",
    fontSize: 11,
  },
  previewCard: {
    padding: Spacing["4"],
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  starWrap: {
    marginBottom: Spacing["2"],
  },
  personaTitle: {
    fontWeight: "800",
    marginBottom: 4,
  },
  personaTagline: {
    fontWeight: "600",
    fontStyle: "italic",
    marginBottom: Spacing["2"],
  },
  personaDesc: {
    lineHeight: 19,
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing["3"],
    marginTop: Spacing["3"],
    paddingTop: Spacing["2"],
  },
  footerBtn: {
    flex: 1,
  },
});

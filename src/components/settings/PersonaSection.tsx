import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { QuizResult, ReaderPersona } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { RetakePersonaModal } from "./RetakePersonaModal";

interface PersonaSectionProps {
  readerPersona: ReaderPersona | null;
  onCompleteQuiz: (quiz: QuizResult, persona?: ReaderPersona) => Promise<void>;
}

export function PersonaSection({
  readerPersona,
  onCompleteQuiz,
}: PersonaSectionProps) {
  const { colors } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayPersona = readerPersona || {
    name: "The Midnight Romancer",
    tagline: "Romantic · Atmospheric · Slow Burn",
    description:
      "You seek stories that linger in the dark like candlelight. Emotional depth and slow-burning tension speak louder to you than mere speed.",
    genres: ["Fantasy", "Literary Fiction"],
    tropes: ["Slow Burn", "Yearning"],
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="planet-outline" size={18} color={colors.accent} />
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.sectionTitle}
          >
            Reader Persona
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.sectionSubtitle}
        >
          Your reading soul constellation.
        </Typography>
      </View>

      <Card style={styles.card} variant="outlined">
        <View style={styles.personaTop}>
          <View
            style={[
              styles.badgeWrap,
              {
                backgroundColor: "rgba(229, 193, 88, 0.15)",
                borderColor: colors.accent,
              },
            ]}
          >
            <Ionicons name="moon-outline" size={15} color={colors.accent} />
            <Typography
              variant="label"
              color={colors.accent}
              style={styles.badgeText}
            >
              Active Alignment
            </Typography>
          </View>
          <Button
            variant="outline"
            size="sm"
            label="Recalibrate Quiz"
            onPress={() => setIsModalOpen(true)}
            style={styles.recalibrateBtn}
          />
        </View>

        <Typography
          variant="title"
          color={colors.textPrimary}
          style={styles.personaName}
        >
          {displayPersona.name}
        </Typography>
        <Typography
          variant="caption"
          color={colors.accent}
          style={styles.personaTagline}
        >
          {displayPersona.tagline}
        </Typography>
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.personaDesc}
        >
          {displayPersona.description}
        </Typography>

        {/* Display associated tropes and genres if available */}
        {(displayPersona.genres || displayPersona.tropes) && (
          <View style={styles.traitsRow}>
            {(displayPersona.genres || []).map((g) => (
              <View
                key={g}
                style={[
                  styles.traitPill,
                  {
                    backgroundColor: colors.bgSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={colors.textPrimary}
                  style={styles.traitText}
                >
                  📖 {g}
                </Typography>
              </View>
            ))}
            {(displayPersona.tropes || []).map((t) => (
              <View
                key={t}
                style={[
                  styles.traitPill,
                  {
                    backgroundColor: colors.bgSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={colors.accent}
                  style={styles.traitText}
                >
                  ✦ {t}
                </Typography>
              </View>
            ))}
          </View>
        )}
      </Card>

      <RetakePersonaModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={onCompleteQuiz}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing["4"],
  },
  sectionHeader: {
    marginBottom: Spacing["2"],
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontStyle: "italic",
    marginTop: 2,
  },
  card: {
    padding: Spacing["4"],
  },
  personaTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["3"],
  },
  badgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: Spacing["2"],
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recalibrateBtn: {
    paddingHorizontal: Spacing["2"],
  },
  personaName: {
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 2,
  },
  personaTagline: {
    fontWeight: "700",
    fontStyle: "italic",
    marginBottom: Spacing["2"],
  },
  personaDesc: {
    lineHeight: 20,
    marginBottom: Spacing["3"],
  },
  traitsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
    paddingTop: Spacing["2"],
  },
  traitPill: {
    paddingHorizontal: Spacing["2"],
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  traitText: {
    fontSize: 11,
    fontWeight: "600",
  },
});

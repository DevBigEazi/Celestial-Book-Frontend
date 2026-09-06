import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { LanguageModal } from "./LanguageModal";

interface LanguageSectionProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

export function LanguageSection({
  selectedLanguage,
  onSelectLanguage,
}: LanguageSectionProps) {
  const { colors } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="globe-outline" size={18} color={colors.accent} />
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.sectionTitle}
          >
            Language
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.sectionSubtitle}
        >
          The tongue your library will speak.
        </Typography>
      </View>

      <Card style={styles.card} variant="outlined">
        <Pressable
          onPress={() => setIsModalOpen(true)}
          style={styles.langSelectorRow}
        >
          <View style={styles.langLeft}>
            <Typography
              variant="body"
              color={colors.textPrimary}
              style={styles.currentLangText}
            >
              {selectedLanguage}
            </Typography>
            <Typography variant="caption" color={colors.textMuted}>
              Tap to browse all 13 native scripts
            </Typography>
          </View>
          <View
            style={[
              styles.langBadge,
              {
                backgroundColor: colors.bgSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Typography
              variant="caption"
              color={colors.accent}
              style={styles.changeTongueText}
            >
              Change Tongue →
            </Typography>
          </View>
        </Pressable>
      </Card>

      <LanguageModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={onSelectLanguage}
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
  langSelectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["3"],
  },
  langLeft: {
    flex: 1,
  },
  currentLangText: {
    fontWeight: "700",
    fontSize: 16,
  },
  langBadge: {
    paddingHorizontal: Spacing["3"],
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  changeTongueText: {
    fontWeight: "700",
  },
  quickLangGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
  },
  quickLangChip: {
    paddingHorizontal: Spacing["3"],
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  quickLangText: {
    fontWeight: "600",
    fontSize: 12,
  },
});

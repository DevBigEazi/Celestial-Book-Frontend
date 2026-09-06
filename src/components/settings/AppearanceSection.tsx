import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AccentChoice, SKY_PRESETS } from "../../constants/colors";
import {
  Radius,
  Spacing,
  TYPOGRAPHY_OPTIONS,
  TypographyChoice,
} from "../../constants/theme";
import { ThemeMode, useTheme } from "../../context/ThemeContext";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { SkyPresetsModal } from "./SkyPresetsModal";

export function AppearanceSection() {
  const {
    colors,
    mode,
    setMode,
    isDark,
    skyTheme,
    setSkyTheme,
    accentColor,
    setAccentColor,
    typographyChoice,
    setTypographyChoice,
  } = useTheme();

  const [isSkyModalOpen, setIsSkyModalOpen] = useState(false);
  const currentSkyPreset =
    SKY_PRESETS[skyTheme] || SKY_PRESETS.midnight_library;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons
            name="color-palette-outline"
            size={18}
            color={colors.accent}
          />
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.sectionTitle}
          >
            Background &amp; Fonts
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.sectionSubtitle}
        >
          Tap a sky to wear it. Choose your typography and accent.
        </Typography>
      </View>

      <Card style={styles.card} variant="outlined">
        {/* Theme Mode Segmented Row */}
        <Typography
          variant="label"
          color={colors.textPrimary}
          style={styles.cardSubheading}
        >
          Theme Appearance
        </Typography>
        <View
          style={[
            styles.modeSegmentRow,
            { backgroundColor: colors.bgSecondary },
          ]}
        >
          {(["light", "dark", "system"] as ThemeMode[]).map((m) => {
            const isSelected = mode === m;
            const modeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
              light: "sunny-outline",
              dark: "moon-outline",
              system: "settings-outline",
            };
            const modeLabels: Record<string, string> = {
              light: "Light",
              dark: "Dark",
              system: "System",
            };

            return (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={[
                  styles.modeSegmentBtn,
                  isSelected && { backgroundColor: colors.accent },
                ]}
              >
                <Ionicons
                  name={modeIcons[m]}
                  size={14}
                  color={isSelected ? colors.bgPrimary : colors.textSecondary}
                  style={{ marginRight: 4 }}
                />
                <Typography
                  variant="caption"
                  color={isSelected ? colors.bgPrimary : colors.textSecondary}
                  style={
                    isSelected ? styles.activeModeText : styles.inactiveModeText
                  }
                >
                  {modeLabels[m]}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {/* 8 Celestial Skies: Modal Preview Trigger */}
        {isDark && (
          <>
            <View
              style={[styles.divider, { backgroundColor: colors.divider }]}
            />
            <Typography
              variant="label"
              color={colors.textPrimary}
              style={styles.cardSubheading}
            >
              Active Celestial Sky
            </Typography>

            <Pressable
              onPress={() => setIsSkyModalOpen(true)}
              style={[
                styles.skyPreviewCard,
                {
                  backgroundColor: currentSkyPreset.bgPrimary,
                  borderColor: colors.accent,
                },
              ]}
            >
              <View style={styles.skyPreviewLeft}>
                <View
                  style={[
                    styles.skyDot,
                    { backgroundColor: currentSkyPreset.borderStrong },
                  ]}
                />
                <View>
                  <Typography
                    variant="label"
                    color={colors.accent}
                    style={styles.skyPreviewTitle}
                  >
                    {currentSkyPreset.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#C8C4BA"
                    style={styles.skyPreviewSub}
                  >
                    {currentSkyPreset.subtitle}
                  </Typography>
                </View>
              </View>

              <View
                style={[
                  styles.browseSkiesPill,
                  { backgroundColor: "rgba(229, 193, 88, 0.15)" },
                ]}
              >
                <Typography
                  variant="caption"
                  color={colors.accent}
                  style={styles.browseSkiesText}
                >
                  Browse 8 Skies →
                </Typography>
              </View>
            </Pressable>
          </>
        )}

        {/* Accent Color Highlight */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <Typography
          variant="label"
          color={colors.textPrimary}
          style={styles.cardSubheading}
        >
          Primary Accent Highlight
        </Typography>
        <View style={styles.accentChoiceRow}>
          {(["gold", "blue"] as AccentChoice[]).map((acc) => {
            const isSelected = accentColor === acc;
            const hex = acc === "gold" ? "#E5C158" : "#3B82F6";

            return (
              <Pressable
                key={acc}
                onPress={() => setAccentColor(acc)}
                style={[
                  styles.accentChoiceBtn,
                  {
                    backgroundColor: isSelected
                      ? `${hex}18`
                      : colors.bgSecondary,
                    borderColor: isSelected ? hex : colors.border,
                  },
                ]}
              >
                <View style={[styles.accentSwatch, { backgroundColor: hex }]} />
                <Typography
                  variant="body"
                  color={isSelected ? hex : colors.textPrimary}
                  style={styles.accentChoiceLabel}
                >
                  {acc === "gold" ? "Celestial Gold" : "Celestial Blue"}
                </Typography>
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color={hex} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Typography Choice */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <Typography
          variant="label"
          color={colors.textPrimary}
          style={styles.cardSubheading}
        >
          Reading Typography Style
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
                    backgroundColor: isSelected
                      ? `${colors.accent}18`
                      : colors.bgSecondary,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
              >
                <Typography
                  variant="title"
                  color={isSelected ? colors.accent : colors.textPrimary}
                  style={opt.isItalic ? styles.italicSample : undefined}
                >
                  {opt.sample}
                </Typography>
                <Typography
                  variant="caption"
                  color={isSelected ? colors.accent : colors.textSecondary}
                  style={styles.typoName}
                >
                  {opt.name}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* 8 Skies Modal */}
      <SkyPresetsModal
        visible={isSkyModalOpen}
        onClose={() => setIsSkyModalOpen(false)}
        activeSky={skyTheme}
        onSelectSky={setSkyTheme}
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
  cardSubheading: {
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing["2"],
  },
  modeSegmentRow: {
    flexDirection: "row",
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing["1"],
  },
  modeSegmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: Radius.sm,
  },
  activeModeText: {
    fontWeight: "700",
  },
  inactiveModeText: {
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginVertical: Spacing["4"],
  },
  skyPreviewCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing["3"],
    borderRadius: Radius.md,
    borderWidth: 2,
  },
  skyPreviewLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["3"],
  },
  skyDot: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
  },
  skyPreviewTitle: {
    fontWeight: "700",
    fontSize: 14,
  },
  skyPreviewSub: {
    fontSize: 11,
    marginTop: 1,
  },
  browseSkiesPill: {
    paddingHorizontal: Spacing["3"],
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  browseSkiesText: {
    fontWeight: "700",
    fontSize: 11,
  },
  accentChoiceRow: {
    flexDirection: "row",
    gap: Spacing["3"],
  },
  accentChoiceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing["3"],
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: Spacing["2"],
  },
  accentSwatch: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
  },
  accentChoiceLabel: {
    fontWeight: "600",
    flex: 1,
    fontSize: 13,
  },
  typoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
  },
  typoCard: {
    width: "48%",
    padding: Spacing["3"],
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  italicSample: {
    fontStyle: "italic",
  },
  typoName: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
  },
});

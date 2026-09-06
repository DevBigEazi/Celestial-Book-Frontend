import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SKY_PRESETS, SkyThemeKey } from "../../constants/colors";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Typography } from "../ui/Typography";

interface SkyPresetsModalProps {
  visible: boolean;
  onClose: () => void;
  activeSky: SkyThemeKey;
  onSelectSky: (sky: SkyThemeKey) => void;
}

export function SkyPresetsModal({
  visible,
  onClose,
  activeSky,
  onSelectSky,
}: SkyPresetsModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.bgCard, borderColor: colors.border },
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Ionicons name="moon-outline" size={20} color={colors.accent} />
              <Typography
                variant="title"
                color={colors.textPrimary}
                style={styles.title}
              >
                8 Celestial Skies
              </Typography>
            </View>
            <Pressable onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.modalSub}
          >
            Tap a sky to wear it. Each palette imbues your nighttime sanctuary
            with distinct atmospheric resonance.
          </Typography>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.skyGrid}>
              {Object.keys(SKY_PRESETS).map((key) => {
                const preset = SKY_PRESETS[key as SkyThemeKey];
                const isSelected = activeSky === preset.id;

                return (
                  <Pressable
                    key={preset.id}
                    onPress={() => {
                      onSelectSky(preset.id);
                      onClose();
                    }}
                    style={[
                      styles.skyCard,
                      {
                        backgroundColor: preset.bgPrimary,
                        borderColor: isSelected ? colors.accent : colors.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={styles.skyCardHeader}>
                      <View
                        style={[
                          styles.skyDot,
                          { backgroundColor: preset.borderStrong },
                        ]}
                      />
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={colors.accent}
                        />
                      )}
                    </View>
                    <Typography
                      variant="label"
                      color={isSelected ? colors.accent : "#FFFDF7"}
                      style={styles.skyName}
                      numberOfLines={1}
                    >
                      {preset.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="#94877A"
                      style={styles.skySub}
                      numberOfLines={1}
                    >
                      {preset.subtitle}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
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
    padding: Spacing["5"],
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing["5"],
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["1"],
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontWeight: "700",
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSub: {
    marginBottom: Spacing["4"],
    lineHeight: 18,
  },
  modalScroll: {
    maxHeight: 440,
  },
  skyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["3"],
    justifyContent: "space-between",
  },
  skyCard: {
    width: "48%",
    padding: Spacing["3"],
    borderRadius: Radius.md,
    marginBottom: Spacing["1"],
  },
  skyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2"],
  },
  skyDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
  skyName: {
    fontWeight: "700",
    fontSize: 13,
  },
  skySub: {
    fontSize: 11,
    marginTop: 2,
  },
});

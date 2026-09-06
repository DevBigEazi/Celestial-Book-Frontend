import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Typography } from "../ui/Typography";

export interface NativeLanguage {
  id: string;
  native: string;
  region: string;
}

export const PRD_NATIVE_LANGUAGES: NativeLanguage[] = [
  { id: "en", native: "English", region: "Global" },
  { id: "de", native: "Deutsch", region: "Deutschland / Österreich" },
  { id: "es", native: "Español", region: "España / Latinoamérica" },
  { id: "fr", native: "Français", region: "France / Francophonie" },
  { id: "it", native: "Italiano", region: "Italia" },
  { id: "pt", native: "Português", region: "Portugal / Brasil" },
  { id: "nl", native: "Nederlands", region: "Nederland / België" },
  { id: "ar", native: "العربية", region: "العالم العربي" },
  { id: "ko", native: "한국어", region: "대한민국" },
  { id: "zh", native: "中文", region: "华语" },
  { id: "ja", native: "日本語", region: "日本" },
  { id: "tr", native: "Türkçe", region: "Türkiye" },
  { id: "sq", native: "Shqip", region: "Shqipëri / Kosovë" },
];

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (languageNative: string) => void;
}

export function LanguageModal({
  visible,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}: LanguageModalProps) {
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
              <Ionicons name="globe-outline" size={20} color={colors.accent} />
              <Typography
                variant="title"
                color={colors.textPrimary}
                style={styles.title}
              >
                Choose Tongue
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
            Select your native script. Library titles and translations will
            adapt.
          </Typography>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {PRD_NATIVE_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.native;
              return (
                <Pressable
                  key={lang.id}
                  onPress={() => {
                    onSelectLanguage(lang.native);
                    onClose();
                  }}
                  style={[
                    styles.langModalItem,
                    {
                      backgroundColor: isSelected
                        ? `${colors.accent}18`
                        : colors.bgSecondary,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <View>
                    <Typography
                      variant="body"
                      color={isSelected ? colors.accent : colors.textPrimary}
                      style={styles.langModalNative}
                    >
                      {lang.native}
                    </Typography>
                    <Typography variant="caption" color={colors.textMuted}>
                      {lang.region}
                    </Typography>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.accent}
                    />
                  )}
                </Pressable>
              );
            })}
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
    maxWidth: 420,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing["5"],
    maxHeight: "80%",
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
  },
  modalScroll: {
    maxHeight: 380,
  },
  langModalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing["3"],
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginBottom: Spacing["2"],
  },
  langModalNative: {
    fontWeight: "700",
  },
});

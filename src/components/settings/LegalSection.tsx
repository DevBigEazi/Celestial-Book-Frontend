import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

export function LegalSection() {
  const { colors } = useTheme();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={colors.accent}
          />
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.sectionTitle}
          >
            Sanctuary Legal &amp; About
          </Typography>
        </View>
      </View>

      <Card style={styles.card} variant="outlined">
        <View style={styles.legalRow}>
          <Typography variant="body" color={colors.textPrimary}>
            Application Version
          </Typography>
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.monoVersion}
          >
            v1.0.0 (Expo SDK 57)
          </Typography>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <Pressable
          onPress={() => setShowTermsModal(true)}
          style={styles.legalActionRow}
        >
          <Typography variant="body" color={colors.textPrimary}>
            Terms of Sanctuary
          </Typography>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <Pressable
          onPress={() => setShowPrivacyModal(true)}
          style={styles.legalActionRow}
        >
          <Typography variant="body" color={colors.textPrimary}>
            Privacy Veil
          </Typography>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <View style={styles.mottoContainer}>
          <Ionicons
            name="moon-outline"
            size={16}
            color={colors.accent}
            style={{ marginBottom: 4 }}
          />
          <Typography
            variant="caption"
            color={colors.textMuted}
            align="center"
            style={styles.mottoText}
          >
            Crafted with reverence for readers of the stars.
          </Typography>
        </View>
      </Card>

      {/* Terms of Sanctuary Modal */}
      <Modal visible={showTermsModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalHeader}>
              <Typography variant="title" color={colors.textPrimary}>
                Terms of Sanctuary
              </Typography>
              <Pressable
                onPress={() => setShowTermsModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Typography
                variant="body"
                color={colors.textSecondary}
                style={styles.legalModalBody}
              >
                Welcome to Celestial Book. By entering this sanctuary, you agree
                to respect kindred readers, honor thoughtful discussions in
                circles, and maintain a safe, welcoming atmosphere.
                {"\n\n"}
                Celestial Book does not sell your personal reading habits to
                advertisers. Your swipes and reader persona exist solely to
                illuminate books you will love.
              </Typography>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy Veil Modal */}
      <Modal visible={showPrivacyModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalHeader}>
              <Typography variant="title" color={colors.textPrimary}>
                Privacy Veil
              </Typography>
              <Pressable
                onPress={() => setShowPrivacyModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Typography
                variant="body"
                color={colors.textSecondary}
                style={styles.legalModalBody}
              >
                Your reading sanctuary is private. All reader persona
                preferences, TBR constellations, and emotional reaction tags are
                encrypted in your celestial orbit.
                {"\n\n"}
                You may purge your entire presence at any time using the Cancel
                Account control.
              </Typography>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  card: {
    padding: Spacing["4"],
  },
  legalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monoVersion: {
    fontFamily: "GeistMono_500Medium",
  },
  legalActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing["3"],
  },
  mottoContainer: {
    alignItems: "center",
    paddingTop: Spacing["1"],
  },
  mottoText: {
    fontStyle: "italic",
  },
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
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2"],
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: 280,
  },
  legalModalBody: {
    lineHeight: 22,
  },
});

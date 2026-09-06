import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { CancelAccountModal } from "./CancelAccountModal";

interface AccountActionsSectionProps {
  onLogout: () => void;
  onCancelAccount: () => Promise<void>;
}

export function AccountActionsSection({
  onLogout,
  onCancelAccount,
}: AccountActionsSectionProps) {
  const { colors } = useTheme();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="key-outline" size={18} color={colors.accent} />
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.sectionTitle}
          >
            Session &amp; Account
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.sectionSubtitle}
        >
          Manage your active orbit session or depart.
        </Typography>
      </View>

      <Card style={styles.card} variant="outlined">
        {/* Sign Out Action */}
        <Pressable
          onPress={onLogout}
          style={[
            styles.signOutBtn,
            { backgroundColor: colors.bgSecondary, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.signOutText}
          >
            Sign Out of Sanctuary
          </Typography>
        </Pressable>

        {/* Danger Zone: Cancel Account */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <View style={styles.dangerZone}>
          <View style={styles.dangerHeader}>
            <Ionicons name="warning-outline" size={16} color={colors.error} />
            <Typography
              variant="label"
              color={colors.error}
              style={styles.dangerTitle}
            >
              Danger Zone
            </Typography>
          </View>
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.dangerDesc}
          >
            Permanently remove your library, reading history, and saved
            constellation. This cannot be undone.
          </Typography>
          <Pressable
            onPress={() => setIsCancelModalOpen(true)}
            style={[
              styles.cancelBtn,
              {
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                borderColor: "rgba(239, 68, 68, 0.3)",
              },
            ]}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Typography
              variant="caption"
              color={colors.error}
              style={styles.cancelText}
            >
              Cancel Account
            </Typography>
          </Pressable>
        </View>
      </Card>

      {/* Cancel Account Confirmation Modal */}
      <CancelAccountModal
        visible={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={async () => {
          setIsCancelModalOpen(false);
          await onCancelAccount();
        }}
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
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing["2"],
    paddingVertical: Spacing["3"],
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  signOutText: {
    fontWeight: "600",
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: Spacing["4"],
  },
  dangerZone: {
    paddingTop: 2,
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  dangerTitle: {
    fontWeight: "700",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dangerDesc: {
    lineHeight: 18,
    marginBottom: Spacing["3"],
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: Spacing["2"],
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing["4"],
  },
  cancelText: {
    fontWeight: "700",
    fontSize: 12,
  },
});

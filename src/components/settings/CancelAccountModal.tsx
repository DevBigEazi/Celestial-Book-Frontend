import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface CancelAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
}

export function CancelAccountModal({
  visible,
  onClose,
  onConfirmCancel,
}: CancelAccountModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.bgCard, borderColor: colors.error },
          ]}
        >
          <View style={styles.cancelWarningIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={38}
              color={colors.error}
            />
          </View>
          <Typography
            variant="title"
            color={colors.error}
            align="center"
            style={styles.cancelTitle}
          >
            Cancel Sanctuary Orbit?
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            align="center"
            style={styles.cancelBody}
          >
            This will quietly remove your library, history, reading circle
            memberships, and to-be-read constellation. It cannot be undone.
          </Typography>

          <View style={styles.cancelModalActions}>
            <Button
              variant="outline"
              label="Cancel"
              onPress={onClose}
              style={styles.cancelModalBtn}
            />
            <Button
              variant="danger"
              label="Delete"
              onPress={onConfirmCancel}
              style={styles.cancelModalBtn}
            />
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
    padding: Spacing["5"],
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing["5"],
  },
  cancelWarningIcon: {
    alignItems: "center",
    marginBottom: Spacing["2"],
  },
  cancelTitle: {
    fontWeight: "800",
    marginBottom: Spacing["2"],
  },
  cancelBody: {
    lineHeight: 20,
    marginBottom: Spacing["5"],
  },
  cancelModalActions: {
    flexDirection: "row",
    gap: Spacing["3"],
  },
  cancelModalBtn: {
    flex: 1,
  },
});

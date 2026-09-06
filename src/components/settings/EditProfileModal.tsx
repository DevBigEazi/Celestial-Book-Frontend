import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  currentEmail: string;
  onSave: (newName: string, newEmail: string) => Promise<void>;
}

export function EditProfileModal({
  visible,
  onClose,
  currentName,
  currentEmail,
  onSave,
}: EditProfileModalProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => {
    setName(currentName);
    setEmail(currentEmail);
    setErrorMsg("");
    onClose();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMsg("Display name cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(name.trim(), email.trim());
      onClose();
    } catch {
      setErrorMsg("Could not update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.bgCard, borderColor: colors.border },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="person-outline" size={20} color={colors.accent} />
              <Typography
                variant="title"
                color={colors.textPrimary}
                style={styles.title}
              >
                Edit Sanctuary Profile
              </Typography>
            </View>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.subtitle}
          >
            Update the name and identity fellow stargazers see.
          </Typography>

          {errorMsg ? (
            <View
              style={[
                styles.errorBanner,
                {
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderColor: colors.error,
                },
              ]}
            >
              <Typography variant="caption" color={colors.error}>
                {errorMsg}
              </Typography>
            </View>
          ) : null}

          <View style={styles.formGroup}>
            <Typography
              variant="caption"
              color={colors.textMuted}
              style={styles.inputLabel}
            >
              Display Name
            </Typography>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrorMsg("");
              }}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textInput,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border,
                },
              ]}
            />
          </View>

          <View style={styles.formGroup}>
            <Typography
              variant="caption"
              color={colors.textMuted}
              style={styles.inputLabel}
            >
              Email Address
            </Typography>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@celestial.book"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.textInput,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border,
                },
              ]}
            />
          </View>

          <View style={styles.buttonRow}>
            <Button
              variant="outline"
              label="Cancel"
              onPress={handleClose}
              style={styles.actionBtn}
            />
            <Button
              variant="primary"
              label={isSaving ? "Saving..." : "Save Profile"}
              onPress={handleSave}
              disabled={isSaving || !name.trim()}
              style={styles.actionBtn}
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
    maxWidth: 420,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing["5"],
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2"],
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    marginBottom: Spacing["4"],
  },
  errorBanner: {
    padding: Spacing["2"],
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginBottom: Spacing["3"],
  },
  formGroup: {
    marginBottom: Spacing["3"],
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing["3"],
    paddingVertical: Spacing["2"],
    fontSize: 13,
    ...(Platform.OS === "web"
      ? ({
          outlineStyle: "none",
          outlineWidth: 0,
        } as unknown as Record<string, unknown>)
      : {}),
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing["3"],
    marginTop: Spacing["2"],
  },
  actionBtn: {
    flex: 1,
  },
});

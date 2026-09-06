import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Platform, StyleSheet, TextInput, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

interface ContactSectionProps {
  initialName?: string;
  initialEmail?: string;
}

export function ContactSection({
  initialName = "Stargazer",
  initialEmail = "wanderer@celestial.book",
}: ContactSectionProps) {
  const { colors } = useTheme();

  const [contactName, setContactName] = useState(initialName);
  const [contactEmail, setContactEmail] = useState(initialEmail);
  const [contactMessage, setContactMessage] = useState("");
  const [signalSent, setSignalSent] = useState(false);

  const handleSendSignal = () => {
    if (!contactMessage.trim()) return;
    setSignalSent(true);
    setTimeout(() => {
      setContactMessage("");
      setSignalSent(false);
      Alert.alert(
        "Signal Transmitted",
        "Your quiet message has reached the Celestial team.",
      );
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="send-outline" size={18} color={colors.accent} />
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.sectionTitle}
          >
            Contact Sanctuary
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.sectionSubtitle}
        >
          Send a signal across the stars.
        </Typography>
      </View>

      <Card style={styles.card} variant="outlined">
        <View style={styles.formGroup}>
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.inputLabel}
          >
            Your Name
          </Typography>
          <TextInput
            value={contactName}
            onChangeText={setContactName}
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
            Your Email
          </Typography>
          <TextInput
            value={contactEmail}
            onChangeText={setContactEmail}
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

        <View style={styles.formGroup}>
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.inputLabel}
          >
            Message
          </Typography>
          <TextInput
            value={contactMessage}
            onChangeText={setContactMessage}
            placeholder="Tell us what you're thinking, a book that moved you, or an issue you encountered..."
            placeholderTextColor={colors.textMuted}
            multiline
            style={[
              styles.messageInput,
              {
                color: colors.textPrimary,
                backgroundColor: colors.bgSecondary,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        <Button
          variant="primary"
          size="sm"
          label={signalSent ? "Transmitting Signal..." : "Submit Signal"}
          onPress={handleSendSignal}
          disabled={!contactMessage.trim() || signalSent}
          style={styles.submitSignalBtn}
        />
      </Card>
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
  messageInput: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing["3"],
    paddingVertical: Spacing["2"],
    fontSize: 13,
    minHeight: 80,
    textAlignVertical: "top",
    ...(Platform.OS === "web"
      ? ({
          outlineStyle: "none",
          outlineWidth: 0,
        } as unknown as Record<string, unknown>)
      : {}),
  },
  submitSignalBtn: {
    alignSelf: "flex-start",
    marginTop: Spacing["1"],
  },
});

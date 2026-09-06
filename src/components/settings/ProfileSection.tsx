import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Radius, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { User } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileSectionProps {
  user: User | null;
  onUpdateProfile: (updates: Partial<User>) => Promise<void>;
}

export function ProfileSection({ user, onUpdateProfile }: ProfileSectionProps) {
  const { colors } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveProfile = async (newName: string) => {
    await onUpdateProfile({ name: newName });
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons
            name="person-circle-outline"
            size={18}
            color={colors.accent}
          />
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.sectionTitle}
          >
            Profile &amp; Account
          </Typography>
        </View>
        <Typography
          variant="caption"
          color={colors.textMuted}
          style={styles.sectionSubtitle}
        >
          The reader behind the swipes.
        </Typography>
      </View>

      <Card style={styles.card} variant="outlined">
        {/* Profile Hero */}
        <View style={styles.profileHeroRow}>
          <Image
            source={{
              uri: user?.avatarUrl || "https://i.pravatar.cc/150?u=celestial",
            }}
            style={[styles.avatar, { borderColor: colors.accent }]}
          />
          <View style={styles.profileHeroInfo}>
            <View style={styles.statusBadge}>
              <View
                style={[styles.statusDot, { backgroundColor: colors.accent }]}
              />
              <Typography
                variant="caption"
                color={colors.accent}
                style={styles.statusText}
              >
                Orbit Member · Active
              </Typography>
            </View>
            <Typography
              variant="title"
              color={colors.textPrimary}
              style={styles.profileHeroName}
            >
              {user?.name || "Stargazer"}
            </Typography>
            <Typography
              variant="caption"
              color={colors.textMuted}
              style={styles.profileHeroUsername}
            >
              @{user?.username || "stargazer"}
            </Typography>
          </View>
          <Button
            variant="outline"
            size="sm"
            label="Edit"
            onPress={() => setIsEditModalOpen(true)}
            style={styles.editBtn}
          />
        </View>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentName={user?.name || "Stargazer"}
        currentEmail={
          user?.username
            ? `${user.username}@celestial.book`
            : "wanderer@celestial.book"
        }
        onSave={handleSaveProfile}
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
  profileHeroRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: Radius.full,
    borderWidth: 2,
  },
  profileHeroInfo: {
    flex: 1,
    marginLeft: Spacing["3"],
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileHeroName: {
    fontWeight: "700",
  },
  profileHeroUsername: {
    fontFamily: "GeistMono_400Regular",
    fontSize: 11,
  },
  editBtn: {
    paddingHorizontal: Spacing["3"],
  },
});

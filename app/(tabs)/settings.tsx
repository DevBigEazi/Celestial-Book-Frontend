import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import {
  AccountActionsSection,
  AppearanceSection,
  ContactSection,
  FaqSection,
  LanguageSection,
  LegalSection,
  PersonaSection,
  ProfileSection,
} from "../../src/components/settings";
import { Typography } from "../../src/components/ui/Typography";
import { Radius, Spacing } from "../../src/constants/theme";
import { useTheme } from "../../src/context/ThemeContext";
import { useAuth } from "../../src/hooks/useAuth";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    user,
    readerPersona,
    updateProfile,
    completeOnboarding,
    logout,
    cancelAccount,
  } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleLogout = () => {
    Alert.alert("Depart Sanctuary", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  const handleCancelAccount = async () => {
    await cancelAccount();
    router.replace("/(auth)/welcome");
  };

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Typography
            variant="heading"
            color={colors.textPrimary}
            style={styles.headerTitle}
          >
            YOUR ORBIT
          </Typography>
          <Typography
            variant="caption"
            color={colors.accent}
            style={styles.headerSubtitle}
          >
            SETTINGS &amp; SANCTUARY CONTROLS
          </Typography>
        </View>
        <View
          style={[
            styles.orbitIconWrap,
            { backgroundColor: colors.bgSecondary },
          ]}
        >
          <Ionicons name="planet-outline" size={22} color={colors.accent} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Profile & Account */}
        <ProfileSection user={user} onUpdateProfile={updateProfile} />

        {/* Section 2: Reader Persona */}
        <PersonaSection
          readerPersona={readerPersona}
          onCompleteQuiz={completeOnboarding}
        />

        {/* Section 3: Language */}
        <LanguageSection
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />

        {/* Section 4: Background & Fonts */}
        <AppearanceSection />

        {/* Section 5: Contact */}
        <ContactSection
          initialName={user?.name || "Stargazer"}
          initialEmail={
            user?.username
              ? `${user.username}@celestial.book`
              : "wanderer@celestial.book"
          }
        />

        {/* Section 6: Help & FAQs */}
        <FaqSection />

        {/* Section 7: App Metadata & Legal */}
        <LegalSection />

        {/* Section 8: Account & Session (Safely at bottom) */}
        <AccountActionsSection
          onLogout={handleLogout}
          onCancelAccount={handleCancelAccount}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing["6"],
    paddingTop: Spacing["4"],
    paddingBottom: Spacing["3"],
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  orbitIconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing["5"],
    paddingTop: Spacing["4"],
    paddingBottom: Spacing["12"],
  },
});

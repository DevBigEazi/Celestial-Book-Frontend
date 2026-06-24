import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { mockUsers } from '../../src/mock/users';
import { mockClubs } from '../../src/mock/clubs';
import { Spacing, Radius, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface UserProfile {
  name: string;
  username: string;
  bio: string;
}

export default function Profile() {
  const router = useRouter();
  const { colors } = useTheme();

  const defaultUser = mockUsers[0]; // Jane Doe

  const [profile, setProfile] = useState<UserProfile>({
    name: defaultUser.name,
    username: defaultUser.username,
    bio: defaultUser.bio,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const savedProfileStr = await AsyncStorage.getItem('@mock_user_profile');
        if (savedProfileStr) {
          const parsed = JSON.parse(savedProfileStr);
          setProfile({
            name: parsed.name || defaultUser.name,
            username: parsed.username || defaultUser.username,
            bio: parsed.bio || defaultUser.bio,
          });
        }
      } catch (e) {
        // Fallback to default
      }
    }
    loadProfile();
  }, []);

  const handleSettingsPress = () => {
    router.push('/(stack)/settings');
  };

  return (
    <ScreenWrapper scrollEnabled={true} style={styles.container}>
      {/* Header with settings button */}
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          Profile
        </Typography>
        <Pressable onPress={handleSettingsPress} style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* User Stats Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: colors.bgSecondary }]}>
            <Typography variant="display">👤</Typography>
          </View>
          <View style={styles.userInfo}>
            <Typography variant="title" color={colors.textPrimary}>
              {profile.name}
            </Typography>
            <Typography variant="label" color={colors.textMuted}>
              @{profile.username}
            </Typography>
          </View>
        </View>

        <Typography variant="body" color={colors.textSecondary} style={styles.bio}>
          {profile.bio}
        </Typography>

        {/* Stats Row */}
        <View style={[styles.statsRow, { borderTopColor: colors.divider }]}>
          <View style={styles.statBox}>
            <Typography variant="subtitle" color={colors.textPrimary} style={styles.statNumber}>
              {defaultUser.booksRead}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Books Read
            </Typography>
          </View>
          <View style={styles.statBox}>
            <Typography variant="subtitle" color={colors.textPrimary} style={styles.statNumber}>
              {defaultUser.followers}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Followers
            </Typography>
          </View>
          <View style={styles.statBox}>
            <Typography variant="subtitle" color={colors.textPrimary} style={styles.statNumber}>
              {defaultUser.following}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Following
            </Typography>
          </View>
        </View>
      </View>

      {/* My Clubs Section */}
      <View style={styles.section}>
        <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
          My Clubs
        </Typography>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.clubsList}>
          {mockClubs.map((club) => (
            <View key={club.id} style={[styles.clubCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <Typography variant="label" color={colors.textPrimary} numberOfLines={1} style={styles.clubName}>
                {club.name}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {club.memberCount} members
              </Typography>
              {club.isTemporary && (
                <View style={[styles.tempBadge, { backgroundColor: colors.bgSecondary }]}>
                  <Typography variant="caption" color={colors.warning} style={styles.tempBadgeText}>
                    TEMP
                  </Typography>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Favorite Genres Section */}
      <View style={styles.section}>
        <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
          Favorite Genres
        </Typography>
        <View style={styles.genresList}>
          {defaultUser.favoriteGenres.map((genre) => (
            <View key={genre} style={[styles.genreChip, { backgroundColor: colors.bgSecondary }]}>
              <Typography variant="caption" color={colors.textAccent} style={styles.genreText}>
                {genre}
              </Typography>
            </View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['4'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing['4'],
    marginBottom: Spacing['6'],
  },
  settingsBtn: {
    padding: Spacing['1'],
  },
  profileCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing['5'],
    marginBottom: Spacing['6'],
    ...Shadow.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing['4'],
  },
  userInfo: {
    justifyContent: 'center',
  },
  bio: {
    marginTop: Spacing['4'],
    marginBottom: Spacing['4'],
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing['4'],
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontFamily: 'GeistMono_500Medium',
  },
  section: {
    marginBottom: Spacing['6'],
  },
  sectionTitle: {
    marginBottom: Spacing['3'],
    fontWeight: '600',
  },
  clubsList: {
    gap: Spacing['3'],
    paddingRight: Spacing['6'],
  },
  clubCard: {
    width: 140,
    padding: Spacing['4'],
    borderRadius: Radius.md,
    borderWidth: 1,
    ...Shadow.sm,
  },
  clubName: {
    fontWeight: '600',
    marginBottom: Spacing['1'],
  },
  tempBadge: {
    alignSelf: 'flex-start',
    marginTop: Spacing['2'],
    paddingHorizontal: Spacing['2'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.sm,
  },
  tempBadgeText: {
    fontWeight: 'bold',
    fontFamily: 'GeistMono_500Medium',
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
  },
  genreChip: {
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
  },
  genreText: {
    fontWeight: '600',
  },
});

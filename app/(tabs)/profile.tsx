import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Avatar } from '../../src/components/ui/Avatar';
import { mockClubs } from '../../src/mock/clubs';
import { getReaderPersona } from '../../src/services/ai';
import { ReaderPersona } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, quizResult, library, saved } = useAuth();

  const [persona, setPersona] = useState<ReaderPersona | null>(null);
  const [personaLoading, setPersonaLoading] = useState(false);

  useEffect(() => {
    async function loadPersona() {
      setPersonaLoading(true);
      try {
        const cachedPersona = await AsyncStorage.getItem('@cb/reader_persona');
        if (cachedPersona) {
          setPersona(JSON.parse(cachedPersona));
        } else if (quizResult) {
          const generated = await getReaderPersona(quizResult);
          await AsyncStorage.setItem('@cb/reader_persona', JSON.stringify(generated));
          setPersona(generated);
        }
      } catch (e) {
        console.error('Failed to load reader persona:', e);
      } finally {
        setPersonaLoading(false);
      }
    }
    loadPersona();
  }, [quizResult]);

  const handleSettingsPress = () => {
    router.push('/(stack)/settings');
  };

  const joinedClubs = mockClubs.filter(club => club.isJoined);
  const userFavoriteGenres = quizResult?.genres || [];

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
      <Card style={styles.profileCard} variant="elevated">
        <View style={styles.avatarRow}>
          <Avatar url={user?.avatarUrl} name={user?.name || 'Reader'} size="lg" />
          <View style={styles.userInfo}>
            <Typography variant="title" color={colors.textPrimary}>
              {user?.name || 'Guest Reader'}
            </Typography>
            <Typography variant="label" color={colors.textMuted}>
              @{user?.username || 'reader'}
            </Typography>
          </View>
        </View>

        <Typography variant="body" color={colors.textSecondary} style={styles.bio}>
          {user?.bio || 'Avid reader and celestial books community member.'}
        </Typography>

        {/* Stats Row */}
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <View style={styles.statBox}>
            <Typography variant="subtitle" color={colors.textPrimary} style={styles.statNumber}>
              {library.length}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Library
            </Typography>
          </View>
          <View style={styles.statBox}>
            <Typography variant="subtitle" color={colors.textPrimary} style={styles.statNumber}>
              {saved.length}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Saved
            </Typography>
          </View>
          <View style={styles.statBox}>
            <Typography variant="subtitle" color={colors.textPrimary} style={styles.statNumber}>
              {joinedClubs.length}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Clubs
            </Typography>
          </View>
        </View>
      </Card>

      {/* AI Reader Persona Card */}
      <View style={styles.section}>
        <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
          AI Reader Persona
        </Typography>
        {personaLoading ? (
          <Card style={styles.personaCard} variant="outlined">
            <ActivityIndicator size="small" color={colors.accent} style={styles.skeletonSpinner} />
            <Typography variant="caption" color={colors.textSecondary} align="center">
              Analyzing your library and tastes...
            </Typography>
          </Card>
        ) : persona ? (
          <Card style={[styles.personaCard, { borderColor: colors.accent, borderWidth: 1 }]} variant="elevated">
            <Typography variant="subtitle" color={colors.accent} style={styles.personaLabel}>
              ✨ {persona.name}
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.personaDesc}>
              {persona.description}
            </Typography>
          </Card>
        ) : (
          <Card style={styles.personaCard} variant="outlined">
            <Typography variant="body" color={colors.textSecondary} align="center" style={styles.noPersonaText}>
              Complete the onboarding quiz to generate your AI reader persona.
            </Typography>
            <Button
              variant="outline"
              size="sm"
              label="Take Onboarding Quiz"
              onPress={() => router.push('/(auth)/onboarding')}
            />
          </Card>
        )}
      </View>

      {/* My Clubs Section */}
      <View style={styles.section}>
        <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
          My Clubs
        </Typography>
        {joinedClubs.length > 0 ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.clubsList}>
            {joinedClubs.map((club) => (
              <Pressable key={club.id} onPress={() => router.push(`/(stack)/club/${club.id}`)}>
                <Card style={styles.clubCard} variant="outlined">
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
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <Typography variant="body" color={colors.textMuted} style={styles.noClubsText}>
            {"You haven't joined any book clubs yet. Search for clubs to join!"}
          </Typography>
        )}
      </View>

      {/* Favorite Genres Section */}
      <View style={styles.section}>
        <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
          Favorite Genres
        </Typography>
        {userFavoriteGenres.length > 0 ? (
          <View style={styles.genresList}>
            {userFavoriteGenres.map((genre) => (
              <Badge key={genre} label={genre} variant="secondary" />
            ))}
          </View>
        ) : (
          <Typography variant="body" color={colors.textMuted}>
            No favorite genres saved. Update your profile by retaking the quiz.
          </Typography>
        )}
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
    padding: Spacing['5'],
    marginBottom: Spacing['6'],
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    justifyContent: 'center',
    marginLeft: Spacing['4'],
  },
  bio: {
    marginTop: Spacing['4'],
    marginBottom: Spacing['4'],
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing['4'],
    marginTop: Spacing['2'],
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
  personaCard: {
    padding: Spacing['4'],
    borderRadius: Radius.md,
  },
  personaLabel: {
    fontWeight: 'bold',
    marginBottom: Spacing['2'],
  },
  personaDesc: {
    lineHeight: 20,
  },
  skeletonSpinner: {
    marginBottom: Spacing['2'],
  },
  noPersonaText: {
    marginBottom: Spacing['3'],
  },
  noClubsText: {
    fontStyle: 'italic',
  },
});

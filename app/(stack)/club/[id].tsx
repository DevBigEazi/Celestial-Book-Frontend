import React, { useState } from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { ScreenWrapper } from '../../../src/components/layout/ScreenWrapper';
import { mockClubs } from '../../../src/mock/clubs';
import { Spacing, Radius } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function BookClubDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const club = mockClubs.find((c) => c.id === id);
  const [isJoined, setIsJoined] = useState(club?.isJoined || false);

  if (!club) {
    return (
      <ScreenWrapper scrollEnabled={false} style={styles.center}>
        <Typography variant="title" color={colors.error}>Club not found</Typography>
        <Button variant="primary" label="Go Back" onPress={() => router.back()} style={styles.backBtn} />
      </ScreenWrapper>
    );
  }

  const handleJoinToggle = () => {
    setIsJoined((prev) => !prev);
  };

  return (
    <ScreenWrapper scrollEnabled={true} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Typography variant="heading" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
          {club.name}
        </Typography>
      </View>

      {/* Hero section */}
      <View style={styles.hero}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.bgSecondary }]}>
          <Typography variant="display">👥</Typography>
        </View>
        <Typography variant="title" color={colors.textPrimary} style={styles.clubName}>
          {club.name}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary} style={styles.members}>
          {club.memberCount} members • {club.isTemporary ? 'Temporary Club' : 'Permanent Club'}
        </Typography>

        <Button
          variant={isJoined ? 'outline' : 'primary'}
          label={isJoined ? 'Leave Club' : 'Join Club'}
          onPress={handleJoinToggle}
          style={styles.joinBtn}
        />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Typography variant="body" color={colors.textPrimary}>
          {club.description}
        </Typography>
      </View>

      {/* Current Book section */}
      {club.currentBook && (
        <View style={[styles.section, styles.currentBookSection]}>
          <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
            Current Book
          </Typography>
          <View style={[styles.bookCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={[styles.bookCover, { backgroundColor: colors.bgSecondary }]}>
              <Typography variant="title">📖</Typography>
            </View>
            <View style={styles.bookDetails}>
              <Typography variant="label" color={colors.textPrimary}>
                {club.currentBook.title}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                by {club.currentBook.author}
              </Typography>
              <Typography variant="caption" color={colors.accent}>
                ★ {club.currentBook.rating}
              </Typography>
            </View>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['4'],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['6'],
  },
  backBtn: {
    marginTop: Spacing['4'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing['4'],
    marginBottom: Spacing['6'],
  },
  headerTitle: {
    marginLeft: Spacing['4'],
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing['6'],
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['4'],
  },
  clubName: {
    fontWeight: 'bold',
  },
  members: {
    marginTop: Spacing['1'],
    marginBottom: Spacing['4'],
  },
  joinBtn: {
    width: 140,
  },
  section: {
    marginBottom: Spacing['6'],
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Spacing['3'],
  },
  currentBookSection: {
    marginTop: Spacing['2'],
  },
  bookCard: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing['3'],
  },
  bookCover: {
    width: 50,
    height: 70,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing['4'],
  },
  bookDetails: {
    justifyContent: 'center',
    flex: 1,
  },
});

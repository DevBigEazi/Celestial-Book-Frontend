import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { BookCard } from '../../src/components/book/BookCard';
import { mockBooks } from '../../src/mock/books';
import { mockClubs } from '../../src/mock/clubs';
import { Spacing, Radius } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export type DiscoveryMode = 'comfort' | 'exploration' | 'surprise';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { readerPersona } = useAuth();
  const [activeMode, setActiveMode] = useState<DiscoveryMode>('comfort');

  const displayPersona = readerPersona || {
    name: 'The Midnight Romancer',
    tagline: 'Romantic · Atmospheric · Slow Burn',
    description: 'Stories that linger like candlelight.',
  };

  const indieBooks = mockBooks.filter((b) => b.isNicheOrIndie);
  const recommendedBooks = mockBooks.slice(0, 6);

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header: Brand & Persona */}
        <View style={styles.header}>
          <View>
            <Typography variant="heading" color={colors.textPrimary}>
              CELESTIAL
            </Typography>
            <Typography variant="caption" color={colors.accent} style={styles.subtitle}>
              YOUR NEXT WORLD
            </Typography>
          </View>

          <View
            style={[
              styles.personaBadge,
              { backgroundColor: colors.accentMuted, borderColor: colors.accent },
            ]}
          >
            <Ionicons name="star" size={13} color={colors.accent} style={styles.badgeIcon} />
            <Typography variant="caption" color={colors.accent} style={styles.personaText}>
              {displayPersona.name.toUpperCase()}
            </Typography>
          </View>
        </View>

        {/* Swipe Your Stars Portal Card */}
        <Pressable
          onPress={() => router.push('/(stack)/swipe')}
          style={[
            styles.swipePortalCard,
            { backgroundColor: colors.bgCard, borderColor: colors.accent },
          ]}
        >
          <View style={styles.portalContent}>
            <View style={[styles.portalIconBox, { backgroundColor: colors.accentMuted }]}>
              <Ionicons name="telescope-outline" size={24} color={colors.accent} />
            </View>
            <View style={styles.portalTextCol}>
              <Typography variant="title" color={colors.textPrimary}>
                Swipe Your Stars
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Full-screen intuitive discovery based on your mood
              </Typography>
            </View>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color={colors.accent} />
        </Pressable>

        {/* Mode Selector */}
        <View style={styles.modeSection}>
          <View style={[styles.modeTabsRow, { backgroundColor: colors.bgSecondary }]}>
            {(['comfort', 'exploration', 'surprise'] as DiscoveryMode[]).map((mode) => {
              const isSelected = activeMode === mode;
              const modeLabels: Record<DiscoveryMode, string> = {
                comfort: 'Comfort',
                exploration: 'Exploration',
                surprise: 'Surprise Me',
              };

              return (
                <Pressable
                  key={mode}
                  onPress={() => setActiveMode(mode)}
                  style={[
                    styles.modeTabButton,
                    isSelected && {
                      backgroundColor: colors.accent,
                    },
                  ]}
                >
                  <Typography
                    variant="caption"
                    color={isSelected ? colors.accentText : colors.textSecondary}
                    style={[styles.modeTabText, isSelected && styles.modeTabTextActive]}
                  >
                    {modeLabels[mode]}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Carousel 1: Recommended For You */}
        <View style={styles.sectionHeader}>
          <Typography variant="title" color={colors.textPrimary}>
            Recommended For You
          </Typography>
          <Typography variant="caption" color={colors.accent}>
            {displayPersona.tagline}
          </Typography>
        </View>

        <FlatList
          horizontal
          data={recommendedBooks}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <View style={styles.bookCardWrap}>
              <BookCard
                book={item}
                onPress={() => router.push(`/(stack)/book/${item.id}`)}
              />
              {item.atmosphere && (
                <View style={[styles.atmosphereTag, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                  <Typography variant="caption" color={colors.textSecondary} style={styles.atmosphereText}>
                    {item.atmosphere}
                  </Typography>
                </View>
              )}
            </View>
          )}
        />

        {/* Carousel 2: Niche & Indie Gems */}
        {indieBooks.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: Spacing['6'] }]}>
              <Typography variant="title" color={colors.textPrimary}>
                Niche & Indie Gems
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Hidden treasures beyond the bestseller charts
              </Typography>
            </View>

            <FlatList
              horizontal
              data={indieBooks}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <View style={styles.bookCardWrap}>
                  <BookCard
                    book={item}
                    onPress={() => router.push(`/(stack)/book/${item.id}`)}
                  />
                  <View style={[styles.atmosphereTag, { backgroundColor: colors.accentMuted, borderColor: colors.accent }]}>
                    <Typography variant="caption" color={colors.accent} style={styles.atmosphereText}>
                      INDIE SPOTLIGHT
                    </Typography>
                  </View>
                </View>
              )}
            />
          </>
        )}

        {/* Carousel 3: Active Book Circles */}
        <View style={[styles.sectionHeader, { marginTop: Spacing['6'] }]}>
          <Typography variant="title" color={colors.textPrimary}>
            Active Book Circles
          </Typography>
          <Pressable onPress={() => router.push('/(tabs)/club')}>
            <Typography variant="caption" color={colors.accent}>
              View All
            </Typography>
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={mockClubs}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(stack)/club/${item.id}`)}
              style={[
                styles.circleCard,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
              ]}
            >
              <Image
                source={{ uri: item.coverUrl }}
                style={styles.circleCover}
                contentFit="cover"
              />
              <View style={styles.circleInfo}>
                <Typography variant="subtitle" color={colors.textPrimary} numberOfLines={1}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color={colors.accent}>
                  {item.tagline}
                </Typography>
                <Typography variant="caption" color={colors.textMuted} style={styles.memberCount}>
                  {item.memberCount} readers in orbit
                </Typography>
              </View>
            </Pressable>
          )}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing['6'],
    paddingTop: Spacing['6'],
    paddingBottom: Spacing['12'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['6'],
  },
  subtitle: {
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 2,
  },
  personaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  badgeIcon: {
    marginRight: 4,
  },
  personaText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
  },
  swipePortalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing['6'],
  },
  portalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  portalIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing['3'],
  },
  portalTextCol: {
    flex: 1,
  },
  modeSection: {
    marginBottom: Spacing['6'],
  },
  modeTabsRow: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 4,
  },
  modeTabButton: {
    flex: 1,
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  modeTabText: {
    fontWeight: '500',
  },
  modeTabTextActive: {
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: Spacing['3'],
  },
  horizontalList: {
    gap: Spacing['4'],
    paddingRight: Spacing['4'],
  },
  bookCardWrap: {
    width: 148,
  },
  atmosphereTag: {
    marginTop: Spacing['2'],
    paddingHorizontal: Spacing['2'],
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  atmosphereText: {
    fontSize: 10,
    fontWeight: '600',
  },
  circleCard: {
    width: 220,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  circleCover: {
    width: '100%',
    height: 90,
  },
  circleInfo: {
    padding: Spacing['3'],
  },
  memberCount: {
    marginTop: 4,
  },
});

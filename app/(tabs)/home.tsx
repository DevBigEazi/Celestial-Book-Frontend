import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { BookCard } from '../../src/components/book/BookCard';
import { mockBooks } from '../../src/mock/books';
import { mockClubs } from '../../src/mock/clubs';
import { Book } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export type DiscoveryMode = 'comfort' | 'exploration' | 'surprise';

const MODE_DESCRIPTIONS: Record<DiscoveryMode, string> = {
  comfort: 'Worlds matching your familiar sanctuary and deepest tropes.',
  exploration: 'Venturing into uncharted horizons and adjacent genres.',
  surprise: 'An unexpected celestial gem handpicked for your orbit.',
};

function getRationaleBadge(book: Book): string {
  if (book.atmosphere) {
    return `BECAUSE: ${book.atmosphere.toUpperCase()}`;
  }
  if (book.tropes && book.tropes.length > 0) {
    return `BECAUSE: ${book.tropes.slice(0, 2).join(' · ').toUpperCase()}`;
  }
  return 'BECAUSE: CURATED FOR YOU';
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { readerPersona, saved } = useAuth();
  const [activeMode, setActiveMode] = useState<DiscoveryMode>('comfort');

  const displayPersona = readerPersona || {
    name: 'The Midnight Romancer',
    tagline: 'Romantic · Atmospheric · Slow Burn',
    description: 'Stories that linger like candlelight.',
  };

  // Curate recommended books based on active mode
  const recommendedBooks = useMemo(() => {
    if (activeMode === 'comfort') {
      return mockBooks
        .filter((b) =>
          b.tropes.some((t) =>
            ['Slow Burn', 'Forbidden Love', 'Yearning', 'Found Family', 'Magical Realism'].includes(t)
          )
        )
        .slice(0, 6);
    }
    if (activeMode === 'exploration') {
      return mockBooks
        .filter((b) =>
          b.genres.some((g) => ['Dark Academia', 'Sci-Fi', 'Mystery', 'Historical'].includes(g))
        )
        .slice(0, 6);
    }
    // Surprise me: unique, indie, and unconventional perspectives
    return [...mockBooks]
      .sort((a, b) => b.publishedYear - a.publishedYear)
      .slice(0, 6);
  }, [activeMode]);

  // TBR Quick Access (currently reading & next up)
  const tbrBooks = useMemo(() => {
    const userSaved = mockBooks.filter((b) => saved.includes(b.id));
    if (userSaved.length > 0) {
      return userSaved.slice(0, 6);
    }
    return mockBooks.filter((b) => b.isInLibrary || b.isSaved).slice(0, 6);
  }, [saved]);

  const indieBooks = useMemo(() => mockBooks.filter((b) => b.isNicheOrIndie), []);

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

          <Pressable
            onPress={() => router.push('/(tabs)/settings')}
            style={[
              styles.personaBadge,
              { backgroundColor: colors.accentMuted, borderColor: colors.accent },
            ]}
          >
            <Ionicons name="star" size={13} color={colors.accent} style={styles.badgeIcon} />
            <Typography variant="caption" color={colors.accent} style={styles.personaText}>
              {displayPersona.name.toUpperCase()}
            </Typography>
          </Pressable>
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
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.modeDescription}
          >
            {MODE_DESCRIPTIONS[activeMode]}
          </Typography>
        </View>

        {/* Carousel 1: Recommended For You */}
        <View style={styles.sectionHeader}>
          <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
            Recommended For You
          </Typography>
          <Typography variant="caption" color={colors.accent} style={styles.sectionSubtitle}>
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
              <View
                style={[
                  styles.rationaleTag,
                  { backgroundColor: colors.bgSecondary, borderColor: colors.border },
                ]}
              >
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.rationaleText}
                  numberOfLines={1}
                >
                  {getRationaleBadge(item)}
                </Typography>
              </View>
            </View>
          )}
        />

        {/* Carousel 2: TBR Quick Access (currently reading & next up) */}
        <View style={[styles.sectionHeaderRow, { marginTop: Spacing['6'] }]}>
          <View style={styles.sectionHeaderLeft}>
            <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
              Your Reading Orbit
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={styles.sectionSubtitle}>
              Currently reading & next in your universe
            </Typography>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/tbr')} hitSlop={8}>
            <Typography variant="caption" color={colors.accent} style={styles.headerActionText}>
              Open TBR
            </Typography>
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={tbrBooks}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item, index }) => (
            <View style={styles.bookCardWrap}>
              <BookCard
                book={item}
                onPress={() => router.push(`/(stack)/book/${item.id}`)}
              />
              <View
                style={[
                  styles.rationaleTag,
                  {
                    backgroundColor: index === 0 ? colors.accentMuted : colors.bgSecondary,
                    borderColor: index === 0 ? colors.accent : colors.border,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={index === 0 ? colors.accent : colors.textSecondary}
                  style={styles.rationaleText}
                  numberOfLines={1}
                >
                  {index === 0 ? 'CURRENTLY READING' : 'UP NEXT IN ORBIT'}
                </Typography>
              </View>
            </View>
          )}
        />

        {/* Carousel 3: Niche & Indie Gems */}
        {indieBooks.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: Spacing['6'] }]}>
              <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
                Niche & Indie Gems
              </Typography>
              <Typography variant="caption" color={colors.textSecondary} style={styles.sectionSubtitle}>
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
                  <View
                    style={[
                      styles.rationaleTag,
                      { backgroundColor: colors.accentMuted, borderColor: colors.accent },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      color={colors.accent}
                      style={styles.rationaleText}
                    >
                      INDIE SPOTLIGHT
                    </Typography>
                  </View>
                </View>
              )}
            />
          </>
        )}

        {/* Carousel 4: Active Book Circles */}
        <View style={[styles.sectionHeaderRow, { marginTop: Spacing['6'] }]}>
          <View style={styles.sectionHeaderLeft}>
            <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
              Active Book Circles
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={styles.sectionSubtitle}>
              Where stories live on with kindred readers
            </Typography>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/club')} hitSlop={8}>
            <Typography variant="caption" color={colors.accent} style={styles.headerActionText}>
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
                <Typography variant="caption" color={colors.accent} numberOfLines={1}>
                  {item.tagline}
                </Typography>
                <View style={styles.circleMetaRow}>
                  <Typography
                    variant="caption"
                    color={colors.textMuted}
                    numberOfLines={1}
                    style={styles.readingBookText}
                  >
                    Reading: {item.currentBook?.title || item.readingBook?.title || 'Current Selection'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={colors.textSecondary}
                    style={styles.memberCount}
                  >
                    {item.memberCount} in orbit
                  </Typography>
                </View>
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
  modeDescription: {
    marginTop: Spacing['2'],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionHeader: {
    marginBottom: Spacing['3'],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing['3'],
  },
  sectionHeaderLeft: {
    flex: 1,
    marginRight: Spacing['3'],
  },
  sectionTitle: {
    marginBottom: 2,
  },
  sectionSubtitle: {
    letterSpacing: 0.3,
  },
  headerActionText: {
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingTop: 2,
  },
  horizontalList: {
    gap: Spacing['4'],
    paddingRight: Spacing['4'],
  },
  bookCardWrap: {
    width: 148,
  },
  rationaleTag: {
    marginTop: Spacing['2'],
    paddingHorizontal: Spacing['2'],
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  rationaleText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  circleCard: {
    width: 230,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  circleCover: {
    width: '100%',
    height: 96,
  },
  circleInfo: {
    padding: Spacing['3'],
  },
  circleMetaRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingBookText: {
    flex: 1,
    fontSize: 11,
    fontStyle: 'italic',
    marginRight: 4,
  },
  memberCount: {
    fontSize: 10,
    fontWeight: '600',
  },
});


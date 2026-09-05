import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { mockBooks } from '../../src/mock/books';
import { Book, TBRStatus } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

type MainSegment = 'tbr' | 'library';

export default function TBRScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { saved, library, toggleSaveBook, toggleLibraryBook } = useAuth();
  const [mainSegment, setMainSegment] = useState<MainSegment>('tbr');
  const [tbrStatusFilter, setTbrStatusFilter] = useState<TBRStatus>('want_to_read');

  // Filtered books
  const savedBooks = mockBooks.filter((b) => saved.includes(b.id));
  const libraryBooks = mockBooks.filter((b) => library.includes(b.id));
  const displayBooks = mainSegment === 'tbr' ? savedBooks : libraryBooks;

  const handleOpenGooglePlay = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Typography variant="heading" color={colors.textPrimary}>
        {mainSegment === 'tbr' ? 'SAVED WORLDS' : 'YOUR LIBRARY'}
      </Typography>
      <Typography variant="caption" color={colors.accent} style={styles.headerSub}>
        {mainSegment === 'tbr' ? 'TO BE READ · YOUR PERSONAL HORIZON' : 'CONNECTED BOOKSHELVES'}
      </Typography>

      {/* Main Segment Switcher (TBR vs LIBRARY) */}
      <View style={[styles.mainSegmentRow, { backgroundColor: colors.bgSecondary }]}>
        <Pressable
          onPress={() => setMainSegment('tbr')}
          style={[
            styles.mainSegmentBtn,
            mainSegment === 'tbr' && { backgroundColor: colors.accent },
          ]}
        >
          <Typography
            variant="caption"
            color={mainSegment === 'tbr' ? colors.accentText : colors.textSecondary}
            style={[styles.segmentBtnText, mainSegment === 'tbr' && styles.activeSegmentText]}
          >
            TO BE READ ({savedBooks.length})
          </Typography>
        </Pressable>

        <Pressable
          onPress={() => setMainSegment('library')}
          style={[
            styles.mainSegmentBtn,
            mainSegment === 'library' && { backgroundColor: colors.accent },
          ]}
        >
          <Typography
            variant="caption"
            color={mainSegment === 'library' ? colors.accentText : colors.textSecondary}
            style={[styles.segmentBtnText, mainSegment === 'library' && styles.activeSegmentText]}
          >
            OWNED LIBRARY ({libraryBooks.length})
          </Typography>
        </Pressable>
      </View>

      {/* Reading Status Filter Sub-bar (for TBR) */}
      {mainSegment === 'tbr' && (
        <View style={styles.subFilterRow}>
          {(
            [
              { id: 'want_to_read', label: 'Want to Read' },
              { id: 'currently_reading', label: 'Reading Now' },
              { id: 'finished', label: 'Finished' },
            ] as { id: TBRStatus; label: string }[]
          ).map((filter) => {
            const isSelected = tbrStatusFilter === filter.id;
            return (
              <Pressable
                key={filter.id}
                onPress={() => setTbrStatusFilter(filter.id)}
                style={[
                  styles.subFilterPill,
                  {
                    backgroundColor: isSelected ? colors.accentMuted : colors.bgCard,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={isSelected ? colors.accent : colors.textSecondary}
                  style={isSelected ? styles.activeSubFilterText : undefined}
                >
                  {filter.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyWrap}>
      <Ionicons
        name={mainSegment === 'tbr' ? 'bookmark-outline' : 'library-outline'}
        size={48}
        color={colors.textMuted}
        style={styles.emptyIcon}
      />
      <Typography variant="title" color={colors.textPrimary} align="center">
        {mainSegment === 'tbr' ? 'Your horizon is empty' : 'No books in your library'}
      </Typography>
      <Typography
        variant="body"
        color={colors.textSecondary}
        align="center"
        style={styles.emptySub}
      >
        {mainSegment === 'tbr'
          ? 'Wander the constellations and heart books during discovery to save them here.'
          : 'Add your owned books or connect your Google Play / Amazon accounts.'}
      </Typography>
      <Pressable
        onPress={() => router.push('/(stack)/swipe')}
        style={[styles.discoverBtn, { backgroundColor: colors.accent }]}
      >
        <Typography variant="caption" color={colors.accentText} style={styles.discoverBtnText}>
          DISCOVER BOOKS
        </Typography>
      </Pressable>
    </View>
  );

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      <FlatList
        data={displayBooks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          displayBooks.length === 0 && styles.emptyListContent,
        ]}
        renderItem={({ item }: { item: Book }) => (
          <Pressable
            onPress={() => router.push(`/(stack)/book/${item.id}`)}
            style={[
              styles.bookRowCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
            ]}
          >
            <Image
              source={{ uri: item.coverUrl }}
              style={styles.bookCover}
              contentFit="cover"
            />
            <View style={styles.bookDetails}>
              <View style={styles.bookTopRow}>
                <Typography variant="subtitle" color={colors.textPrimary} numberOfLines={1}>
                  {item.title}
                </Typography>
                <Pressable
                  onPress={() =>
                    mainSegment === 'tbr'
                      ? toggleSaveBook(item.id)
                      : toggleLibraryBook(item.id)
                  }
                  hitSlop={8}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>

              <Typography variant="caption" color={colors.textSecondary}>
                {item.author}
              </Typography>

              {item.atmosphere && (
                <View style={[styles.atmBadge, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                  <Typography variant="caption" color={colors.accent} style={styles.atmText}>
                    {item.atmosphere}
                  </Typography>
                </View>
              )}

              {/* Google Play / Purchase Actions */}
              <View style={styles.actionsRow}>
                {item.googlePlayUrl && (
                  <Pressable
                    onPress={() => handleOpenGooglePlay(item.googlePlayUrl)}
                    style={[styles.retailerBadge, { backgroundColor: colors.accentMuted, borderColor: colors.accent }]}>
                    <Ionicons name="logo-google-playstore" size={12} color={colors.accent} />
                    <Typography variant="caption" color={colors.accent} style={styles.retailerText}>
                      Google Play
                    </Typography>
                  </Pressable>
                )}

                {item.purchaseUrl && (
                  <Pressable
                    onPress={() => Linking.openURL(item.purchaseUrl)}
                    style={[styles.retailerBadge, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                    <Ionicons name="cart-outline" size={12} color={colors.textSecondary} />
                    <Typography variant="caption" color={colors.textSecondary} style={styles.retailerText}>
                      Amazon
                    </Typography>
                  </Pressable>
                )}
              </View>
            </View>
          </Pressable>
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing['6'],
    paddingTop: Spacing['6'],
    paddingBottom: Spacing['3'],
  },
  headerSub: {
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: Spacing['4'],
  },
  mainSegmentRow: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: Spacing['3'],
  },
  mainSegmentBtn: {
    flex: 1,
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  segmentBtnText: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeSegmentText: {
    fontWeight: '700',
  },
  subFilterRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    marginTop: Spacing['1'],
  },
  subFilterPill: {
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  activeSubFilterText: {
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing['6'],
    paddingBottom: Spacing['6'],
    gap: Spacing['3'],
  },
  emptyListContent: {
    flexGrow: 1,
  },
  bookRowCard: {
    flexDirection: 'row',
    padding: Spacing['3'],
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing['3'],
  },
  bookCover: {
    width: 64,
    height: 94,
    borderRadius: Radius.sm,
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  atmBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginVertical: 4,
  },
  atmText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
  },
  retailerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  retailerText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['6'],
  },
  emptyIcon: {
    marginBottom: Spacing['3'],
  },
  emptySub: {
    marginTop: Spacing['2'],
    marginBottom: Spacing['6'],
  },
  discoverBtn: {
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['3'],
    borderRadius: Radius.full,
  },
  discoverBtnText: {
    fontWeight: '700',
  },
});

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Linking,
  TextInput,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
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
type TBRFilterOption = 'all' | TBRStatus;
type LibraryFilterOption = 'all' | 'google_play' | 'amazon' | 'physical';

interface StatusConfig {
  label: string;
  sublabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const STATUS_CONFIGS: Record<TBRStatus, StatusConfig> = {
  want_to_read: {
    label: 'Want to Read',
    sublabel: 'Waiting at the edge of your night',
    icon: 'time-outline',
    color: '#E5C158',
  },
  currently_reading: {
    label: 'Reading Now',
    sublabel: 'Immersed in this story right now',
    icon: 'book',
    color: '#3B82F6',
  },
  finished: {
    label: 'Finished',
    sublabel: 'Journey completed & preserved',
    icon: 'checkmark-circle',
    color: '#10B981',
  },
};

export default function TBRScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { saved, library, tbrStatuses, toggleSaveBook, toggleLibraryBook, updateBookStatus } =
    useAuth();

  const [mainSegment, setMainSegment] = useState<MainSegment>('tbr');
  const [tbrFilter, setTbrFilter] = useState<TBRFilterOption>('all');
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedBookForStatus, setSelectedBookForStatus] = useState<Book | null>(null);

  // Track physical ownership locally
  const [physicalCopies, setPhysicalCopies] = useState<Record<string, boolean>>({
    'book-001': true,
    'book-005': true,
  });

  const togglePhysicalCopy = (bookId: string) => {
    setPhysicalCopies((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  // Base collections
  const savedBooks = useMemo(
    () => mockBooks.filter((b) => saved.includes(b.id)),
    [saved]
  );
  const libraryBooks = useMemo(
    () => mockBooks.filter((b) => library.includes(b.id)),
    [library]
  );

  // Status counts for TBR
  const wantCount = useMemo(
    () => savedBooks.filter((b) => (tbrStatuses[b.id] || 'want_to_read') === 'want_to_read').length,
    [savedBooks, tbrStatuses]
  );
  const readingCount = useMemo(
    () => savedBooks.filter((b) => tbrStatuses[b.id] === 'currently_reading').length,
    [savedBooks, tbrStatuses]
  );
  const finishedCount = useMemo(
    () => savedBooks.filter((b) => tbrStatuses[b.id] === 'finished').length,
    [savedBooks, tbrStatuses]
  );

  // Format counts for Library
  const gpCount = useMemo(
    () => libraryBooks.filter((b) => !!b.googlePlayUrl).length,
    [libraryBooks]
  );
  const amzCount = useMemo(
    () => libraryBooks.filter((b) => !!b.purchaseUrl).length,
    [libraryBooks]
  );
  const physCount = useMemo(
    () => libraryBooks.filter((b) => !!physicalCopies[b.id]).length,
    [libraryBooks, physicalCopies]
  );

  // Filtered display books
  const displayBooks = useMemo(() => {
    let list = mainSegment === 'tbr' ? savedBooks : libraryBooks;

    // Apply segment-specific sub-filter
    if (mainSegment === 'tbr') {
      if (tbrFilter !== 'all') {
        list = list.filter(
          (b) => (tbrStatuses[b.id] || 'want_to_read') === tbrFilter
        );
      }
    } else {
      if (libraryFilter === 'google_play') {
        list = list.filter((b) => !!b.googlePlayUrl);
      } else if (libraryFilter === 'amazon') {
        list = list.filter((b) => !!b.purchaseUrl);
      } else if (libraryFilter === 'physical') {
        list = list.filter((b) => !!physicalCopies[b.id]);
      }
    }

    // Apply search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        const titleMatch = b.title.toLowerCase().includes(q);
        const authorMatch = b.author.toLowerCase().includes(q);
        const atmMatch = b.atmosphere?.toLowerCase().includes(q);
        const tropesMatch = b.tropes.some((t) => t.toLowerCase().includes(q));
        return titleMatch || authorMatch || atmMatch || tropesMatch;
      });
    }

    return list;
  }, [
    mainSegment,
    savedBooks,
    libraryBooks,
    tbrFilter,
    libraryFilter,
    tbrStatuses,
    physicalCopies,
    searchQuery,
  ]);

  const handleOpenUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleStatusSelect = (status: TBRStatus) => {
    if (selectedBookForStatus) {
      updateBookStatus(selectedBookForStatus.id, status);
      setSelectedBookForStatus(null);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Title & Subtitle per PRD Visual References 6 & 7 */}
      <Typography variant="heading" color={colors.textPrimary}>
        {mainSegment === 'tbr' ? 'SAVED WORLDS' : 'YOUR LIBRARY'}
      </Typography>
      <Typography variant="caption" color={colors.accent} style={styles.headerSub}>
        {mainSegment === 'tbr'
          ? 'WORLDS WAITING AT THE EDGE OF YOUR NIGHT'
          : 'CONNECTED READING & OWNED STORIES'}
      </Typography>

      {/* Main Segment Switcher */}
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

      {/* Search Input Bar */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.bgCard,
            borderColor: isSearchFocused ? colors.accent : colors.border,
            borderWidth: 1.5,
            boxShadow: isSearchFocused ? `0 0 0 3px ${colors.accent}33` : undefined,
            ...(Platform.OS === 'web'
              ? ({
                  outlineStyle: 'none',
                  outlineWidth: 0,
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                } as any)
              : {}),
          },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={isSearchFocused ? colors.accent : colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder={
            mainSegment === 'tbr'
              ? 'Search saved books, authors, tropes...'
              : 'Search your owned library...'
          }
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          style={[
            styles.searchInput,
            {
              color: colors.textPrimary,
              ...(Platform.OS === 'web'
                ? ({
                    outlineStyle: 'none',
                    outlineWidth: 0,
                    boxShadow: 'none',
                  } as any)
                : {}),
            },
          ]}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* TBR Reading Status Sub-Filters */}
      {mainSegment === 'tbr' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subFilterScroll}
        >
          {[
            { id: 'all' as const, label: `All (${savedBooks.length})` },
            { id: 'want_to_read' as const, label: `Want to Read (${wantCount})` },
            { id: 'currently_reading' as const, label: `Reading Now (${readingCount})` },
            { id: 'finished' as const, label: `Finished (${finishedCount})` },
          ].map((item) => {
            const isSelected = tbrFilter === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setTbrFilter(item.id)}
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
                  {item.label}
                </Typography>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        /* Library Format Sub-Filters */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subFilterScroll}
        >
          {[
            { id: 'all' as const, label: `All (${libraryBooks.length})` },
            { id: 'google_play' as const, label: `Google Play (${gpCount})` },
            { id: 'amazon' as const, label: `Amazon Kindle (${amzCount})` },
            { id: 'physical' as const, label: `Physical (${physCount})` },
          ].map((item) => {
            const isSelected = libraryFilter === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setLibraryFilter(item.id)}
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
                  {item.label}
                </Typography>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  const renderEmptyState = () => {
    const isFiltered =
      searchQuery.trim().length > 0 ||
      (mainSegment === 'tbr' ? tbrFilter !== 'all' : libraryFilter !== 'all');

    if (isFiltered) {
      return (
        <View style={styles.emptyWrap}>
          <Ionicons name="search-outline" size={44} color={colors.textMuted} style={styles.emptyIcon} />
          <Typography variant="title" color={colors.textPrimary} align="center">
            No matching books found
          </Typography>
          <Typography variant="body" color={colors.textSecondary} align="center" style={styles.emptySub}>
            Try clearing your search query or switching filters.
          </Typography>
          <Pressable
            onPress={() => {
              setSearchQuery('');
              if (mainSegment === 'tbr') setTbrFilter('all');
              else setLibraryFilter('all');
            }}
            style={[styles.actionCtaBtn, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
          >
            <Typography variant="caption" color={colors.accent} style={styles.actionCtaText}>
              RESET FILTERS
            </Typography>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.emptyWrap}>
        <Ionicons
          name={mainSegment === 'tbr' ? 'bookmark-outline' : 'library-outline'}
          size={52}
          color={colors.textMuted}
          style={styles.emptyIcon}
        />
        <Typography variant="title" color={colors.textPrimary} align="center">
          {mainSegment === 'tbr' ? 'Your horizon is empty' : 'No books in your library'}
        </Typography>
        <Typography variant="body" color={colors.textSecondary} align="center" style={styles.emptySub}>
          {mainSegment === 'tbr'
            ? 'Wander the constellations and heart books during discovery to save them to your horizon.'
            : 'Connect your owned stories or purchase books directly via Google Play & Amazon.'}
        </Typography>
        <Pressable
          onPress={() => router.push('/(stack)/swipe')}
          style={[styles.actionCtaBtn, { backgroundColor: colors.accent }]}
        >
          <Typography variant="caption" color={colors.accentText} style={styles.actionCtaText}>
            SWIPE YOUR STARS
          </Typography>
        </Pressable>
      </View>
    );
  };

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {renderHeader()}

      <FlatList
        data={displayBooks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={[
          styles.listContent,
          displayBooks.length === 0 && styles.emptyListContent,
        ]}
        renderItem={({ item }: { item: Book }) => {
          const currentStatus: TBRStatus = tbrStatuses[item.id] || 'want_to_read';
          const statusCfg = STATUS_CONFIGS[currentStatus];
          const isPhysical = !!physicalCopies[item.id];

          return (
            <Pressable
              onPress={() => router.push(`/(stack)/book/${item.id}`)}
              style={[
                styles.bookRowCard,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
              ]}
            >
              {/* Book Cover */}
              <Image
                source={{ uri: item.coverUrl }}
                style={styles.bookCover}
                contentFit="cover"
              />

              {/* Book Info & Actions */}
              <View style={styles.bookDetails}>
                {/* Header Row: Title & Remove Action */}
                <View style={styles.bookTopRow}>
                  <Typography
                    variant="subtitle"
                    color={colors.textPrimary}
                    numberOfLines={1}
                    style={styles.bookTitle}
                  >
                    {item.title}
                  </Typography>
                  <Pressable
                    onPress={() =>
                      mainSegment === 'tbr'
                        ? toggleSaveBook(item.id)
                        : toggleLibraryBook(item.id)
                    }
                    hitSlop={10}
                    accessibilityLabel="Remove book"
                    style={styles.trashBtn}
                  >
                    <Ionicons name="trash-outline" size={17} color={colors.textMuted} />
                  </Pressable>
                </View>

                {/* Author & Page Count */}
                <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
                  {item.author} {item.pageCount ? `· ${item.pageCount} pages` : ''}
                </Typography>

                {/* Atmosphere Tag */}
                {item.atmosphere && (
                  <View
                    style={[
                      styles.atmBadge,
                      { backgroundColor: colors.bgSecondary, borderColor: colors.border },
                    ]}
                  >
                    <Ionicons name="sparkles-outline" size={10} color={colors.accent} style={{ marginRight: 3 }} />
                    <Typography variant="caption" color={colors.accent} style={styles.atmText} numberOfLines={1}>
                      {item.atmosphere}
                    </Typography>
                  </View>
                )}

                {/* Controls depending on Main Segment */}
                {mainSegment === 'tbr' ? (
                  /* TBR View: Interactive Status Selector Pill */
                  <View style={styles.tbrControlRow}>
                    <Pressable
                      onPress={() => setSelectedBookForStatus(item)}
                      style={[
                        styles.statusPickerBtn,
                        {
                          backgroundColor: colors.bgSecondary,
                          borderColor: statusCfg.color,
                        },
                      ]}
                    >
                      <Ionicons name={statusCfg.icon} size={12} color={statusCfg.color} />
                      <Typography
                        variant="caption"
                        color={statusCfg.color}
                        style={styles.statusPickerText}
                      >
                        {statusCfg.label}
                      </Typography>
                      <Ionicons name="chevron-down" size={12} color={statusCfg.color} />
                    </Pressable>
                  </View>
                ) : (
                  /* Library View: Retailer & Ownership Actions */
                  <View style={styles.actionsRow}>
                    {item.googlePlayUrl && (
                      <Pressable
                        onPress={() => handleOpenUrl(item.googlePlayUrl)}
                        style={[
                          styles.retailerBadge,
                          { backgroundColor: colors.accentMuted, borderColor: colors.accent },
                        ]}
                      >
                        <Ionicons name="logo-google-playstore" size={11} color={colors.accent} />
                        <Typography variant="caption" color={colors.accent} style={styles.retailerText}>
                          Play Books
                        </Typography>
                      </Pressable>
                    )}

                    {item.purchaseUrl && (
                      <Pressable
                        onPress={() => handleOpenUrl(item.purchaseUrl)}
                        style={[
                          styles.retailerBadge,
                          { backgroundColor: colors.bgSecondary, borderColor: colors.border },
                        ]}
                      >
                        <Ionicons name="cart-outline" size={11} color={colors.textSecondary} />
                        <Typography variant="caption" color={colors.textSecondary} style={styles.retailerText}>
                          Amazon
                        </Typography>
                      </Pressable>
                    )}

                    {/* Physical Copy Toggle Badge */}
                    <Pressable
                      onPress={() => togglePhysicalCopy(item.id)}
                      style={[
                        styles.retailerBadge,
                        {
                          backgroundColor: isPhysical ? `${colors.accent}20` : colors.bgSecondary,
                          borderColor: isPhysical ? colors.accent : colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name={isPhysical ? 'bookmark' : 'bookmark-outline'}
                        size={11}
                        color={isPhysical ? colors.accent : colors.textMuted}
                      />
                      <Typography
                        variant="caption"
                        color={isPhysical ? colors.accent : colors.textMuted}
                        style={styles.retailerText}
                      >
                        {isPhysical ? 'Physical Copy' : '+ Physical'}
                      </Typography>
                    </Pressable>
                  </View>
                )}
              </View>
            </Pressable>
          );
        }}
      />

      {/* Status Picker Modal */}
      <Modal
        visible={!!selectedBookForStatus}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBookForStatus(null)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalDismiss} onPress={() => setSelectedBookForStatus(null)} />
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderInfo}>
                <Typography variant="caption" color={colors.accent} style={styles.modalEyebrow}>
                  UPDATE READING STATUS
                </Typography>
                <Typography variant="subtitle" color={colors.textPrimary} numberOfLines={1}>
                  {selectedBookForStatus?.title}
                </Typography>
              </View>
              <Pressable onPress={() => setSelectedBookForStatus(null)} hitSlop={10}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Status Options */}
            <View style={styles.modalOptions}>
              {(
                [
                  { id: 'want_to_read' as const, label: 'Want to Read' },
                  { id: 'currently_reading' as const, label: 'Currently Reading' },
                  { id: 'finished' as const, label: 'Finished' },
                ] as const
              ).map((opt) => {
                const isCurrent =
                  selectedBookForStatus &&
                  (tbrStatuses[selectedBookForStatus.id] || 'want_to_read') === opt.id;
                const cfg = STATUS_CONFIGS[opt.id];

                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => handleStatusSelect(opt.id)}
                    style={[
                      styles.statusOptionRow,
                      {
                        backgroundColor: isCurrent ? colors.bgSecondary : 'transparent',
                        borderColor: isCurrent ? cfg.color : colors.border,
                      },
                    ]}
                  >
                    <View style={[styles.statusOptionIconWrap, { backgroundColor: `${cfg.color}18` }]}>
                      <Ionicons name={cfg.icon} size={18} color={cfg.color} />
                    </View>
                    <View style={styles.statusOptionTextWrap}>
                      <Typography variant="body" color={colors.textPrimary} style={styles.statusOptionTitle}>
                        {cfg.label}
                      </Typography>
                      <Typography variant="caption" color={colors.textSecondary}>
                        {cfg.sublabel}
                      </Typography>
                    </View>
                    {isCurrent && (
                      <Ionicons name="checkmark" size={18} color={cfg.color} style={{ marginLeft: 'auto' }} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
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
    letterSpacing: 1.5,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing['4'],
    height: 44,
    marginBottom: Spacing['3'],
  },
  searchIcon: {
    marginRight: Spacing['2'],
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    padding: 0,
  },
  subFilterScroll: {
    gap: Spacing['2'],
    paddingVertical: Spacing['1'],
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
    width: 68,
    height: 102,
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
  bookTitle: {
    flex: 1,
    marginRight: Spacing['2'],
  },
  trashBtn: {
    padding: 2,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  atmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginVertical: 4,
    maxWidth: '90%',
  },
  atmText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tbrControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing['2'],
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  statusPickerText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
    marginTop: 4,
  },
  retailerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing['2'],
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
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
    paddingVertical: Spacing['10'],
  },
  emptyIcon: {
    marginBottom: Spacing['3'],
  },
  emptySub: {
    marginTop: Spacing['2'],
    marginBottom: Spacing['6'],
    maxWidth: 300,
  },
  actionCtaBtn: {
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['3'],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'transparent',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  actionCtaText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['6'],
  },
  modalDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing['5'],
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing['4'],
  },
  modalHeaderInfo: {
    flex: 1,
    marginRight: Spacing['3'],
  },
  modalEyebrow: {
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  modalOptions: {
    gap: Spacing['3'],
  },
  statusOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing['3'],
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing['3'],
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  statusOptionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOptionTextWrap: {
    flex: 1,
  },
  statusOptionTitle: {
    fontWeight: '600',
    marginBottom: 1,
  },
});

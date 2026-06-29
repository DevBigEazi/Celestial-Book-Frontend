import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Card } from '../../src/components/ui/Card';
import { mockBooks } from '../../src/mock/books';
import { Spacing, Radius, Shadow } from '../../src/constants/theme';
import { Image } from 'expo-image';

type LibraryTab = 'reading' | 'saved' | 'purchased';

export default function Library() {
  const router = useRouter();
  const { colors } = useTheme();
  const { library, saved } = useAuth();
  const [activeTab, setActiveTab] = useState<LibraryTab>('reading');

  const readingBooks = mockBooks.filter((b) => library.includes(b.id));
  const savedBooks = mockBooks.filter((b) => saved.includes(b.id));
  const purchasedBooks = mockBooks.filter((b) => b.genres.includes('Non-Fiction') || b.genres.includes('Biography')); 

  const activeBooks =
    activeTab === 'reading'
      ? readingBooks
      : activeTab === 'saved'
      ? savedBooks
      : purchasedBooks;

  const getEmptyStateProps = () => {
    switch (activeTab) {
      case 'reading':
        return {
          icon: 'book-open',
          title: 'No books reading now',
          message: 'Find a book you like on the Discover tab and add it here to start reading!',
          actionLabel: 'Discover books',
          onAction: () => router.push('/(tabs)/discover')
        };
      case 'saved':
        return {
          icon: 'heart',
          title: 'No saved books',
          message: 'Heart books during discovery to save them for later reading!',
          actionLabel: 'Discover books',
          onAction: () => router.push('/(tabs)/discover')
        };
      case 'purchased':
        return {
          icon: 'shopping-bag',
          title: 'No purchases yet',
          message: 'Buy books from their details screens to add them to your collection.',
          actionLabel: 'Search books',
          onAction: () => router.push('/(tabs)/search')
        };
    }
  };

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          My Library
        </Typography>
      </View>

      {/* Segmented control tabs */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {(['reading', 'saved', 'purchased'] as LibraryTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === 'reading' ? 'Reading Now' : tab === 'saved' ? 'Saved' : 'Purchased';
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabItem,
                isActive && { borderBottomColor: colors.accent, borderBottomWidth: 2 },
              ]}
            >
              <Typography
                variant="label"
                color={isActive ? colors.textAccent : colors.textSecondary}
                style={styles.tabLabel}
              >
                {label}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      {/* Grid of Books */}
      <View style={styles.gridContainer}>
        <FlatList
          data={activeBooks}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <Card
              onPress={() => router.push(`/(stack)/book/${item.id}`)}
              style={styles.bookCard}
              variant="outlined"
            >
              <View style={[styles.coverContainer, { backgroundColor: colors.bgSecondary }]}>
                {item.coverUrl ? (
                  <Image
                    source={{ uri: item.coverUrl }}
                    style={styles.coverImage}
                    contentFit="contain"
                    transition={200}
                  />
                ) : (
                  <Typography variant="title">📖</Typography>
                )}
              </View>
              <View style={styles.details}>
                <Typography variant="label" color={colors.textPrimary} numberOfLines={1} style={styles.titleText}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
                  {item.author}
                </Typography>
                <View style={[styles.badge, { backgroundColor: colors.bgSecondary }]}>
                  <Typography variant="caption" color={colors.textAccent} style={styles.badgeText}>
                    ★ {item.rating}
                  </Typography>
                </View>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <EmptyState {...getEmptyStateProps()} />
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
    paddingTop: Spacing['4'],
  },
  header: {
    marginBottom: Spacing['4'],
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: Spacing['4'],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing['3'],
  },
  tabLabel: {
    fontWeight: 'bold',
  },
  gridContainer: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing['4'],
  },
  bookCard: {
    width: '48%',
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  coverContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  details: {
    padding: Spacing['3'],
  },
  titleText: {
    fontWeight: '600',
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: Spacing['2'],
    paddingHorizontal: Spacing['2'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontWeight: 'bold',
    fontFamily: 'GeistMono_500Medium',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing['12'],
  },
});

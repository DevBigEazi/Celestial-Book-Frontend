import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { Input } from '../../src/components/ui/Input';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { mockBooks } from '../../src/mock/books';
import { mockCommunities } from '../../src/mock/communities';
import { mockClubs } from '../../src/mock/clubs';
import { Spacing, Radius } from '../../src/constants/theme';

type SearchTab = 'books' | 'communities' | 'clubs';

export default function Search() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<SearchTab>('books');
  const [query, setQuery] = useState('');

  const filteredBooks = mockBooks.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCommunities = mockCommunities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.genre.toLowerCase().includes(query.toLowerCase())
  );

  const filteredClubs = mockClubs.filter((club) =>
    club.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Sticky Search bar */}
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary} style={styles.title}>
          Search
        </Typography>
        <Input
          label=""
          placeholder="Search books, clubs, communities..."
          value={query}
          onChangeText={setQuery}
          containerStyle={styles.searchBar}
        />
      </View>

      {/* Segmented controls */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {(['books', 'communities', 'clubs'] as SearchTab[]).map((tab) => {
          const isActive = activeTab === tab;
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
                {tab.toUpperCase()}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      {/* Results List */}
      <View style={styles.resultsContainer}>
        {activeTab === 'books' && (
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.resultItem, { borderBottomColor: colors.divider }]}>
                <Typography variant="body" color={colors.textPrimary}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  by {item.author} • ★ {item.rating}
                </Typography>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Typography variant="body" color={colors.textMuted} align="center">
                  No books found
                </Typography>
              </View>
            }
          />
        )}

        {activeTab === 'communities' && (
          <FlatList
            data={filteredCommunities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.resultItem, { borderBottomColor: colors.divider }]}>
                <Typography variant="body" color={colors.textPrimary}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {item.genre} Community • {item.memberCount} members
                </Typography>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Typography variant="body" color={colors.textMuted} align="center">
                  No communities found
                </Typography>
              </View>
            }
          />
        )}

        {activeTab === 'clubs' && (
          <FlatList
            data={filteredClubs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.resultItem, { borderBottomColor: colors.divider }]}>
                <Typography variant="body" color={colors.textPrimary}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {item.isTemporary ? 'Temporary Club' : 'Permanent Club'} • {item.memberCount} members
                </Typography>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Typography variant="body" color={colors.textMuted} align="center">
                  No clubs found
                </Typography>
              </View>
            }
          />
        )}
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
    marginBottom: Spacing['3'],
  },
  title: {
    marginBottom: Spacing['2'],
  },
  searchBar: {
    marginVertical: 0,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: Spacing['3'],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing['3'],
  },
  tabLabel: {
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    paddingVertical: Spacing['4'],
    borderBottomWidth: 1,
  },
  empty: {
    paddingTop: Spacing['10'],
  },
});

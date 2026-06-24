import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { mockBooks } from '../../src/mock/books';
import { Spacing, Radius, Shadow } from '../../src/constants/theme';

export default function Discover() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<'comfort' | 'explorer'>('comfort');
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBook = mockBooks[currentIndex % mockBooks.length];

  const handleNextCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          For You
        </Typography>
        <View style={[styles.toggleContainer, { backgroundColor: colors.bgSecondary }]}>
          <Button
            variant={mode === 'comfort' ? 'primary' : 'ghost'}
            size="sm"
            label="Comfort"
            onPress={() => setMode('comfort')}
            style={styles.toggleBtn}
          />
          <Button
            variant={mode === 'explorer' ? 'primary' : 'ghost'}
            size="sm"
            label="Explorer"
            onPress={() => setMode('explorer')}
            style={styles.toggleBtn}
          />
        </View>
      </View>

      {/* Swipe Stack Mock Card */}
      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.coverPlaceholder}>
            {/* Displaying cover text as fallback for now, in real component we render cover image */}
            <Typography variant="title" color={colors.textPrimary} align="center">
              📚
            </Typography>
            <Typography variant="body" color={colors.textPrimary} align="center" style={styles.coverTitle}>
              {activeBook.title}
            </Typography>
          </View>

          <View style={styles.cardDetails}>
            <Typography variant="title" color={colors.textPrimary}>
              {activeBook.title}
            </Typography>
            <Typography variant="subtitle" color={colors.textSecondary} style={styles.author}>
              {activeBook.author}
            </Typography>
            <Typography variant="label" color={colors.accent} style={styles.rating}>
              ★ {activeBook.rating} ({activeBook.reviewCount} reviews)
            </Typography>

            <View style={styles.chipsContainer}>
              {activeBook.genres.map((genre) => (
                <View key={genre} style={[styles.chip, { backgroundColor: colors.bgSecondary }]}>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {genre}
                  </Typography>
                </View>
              ))}
            </View>

            <Typography variant="body" color={colors.textSecondary} numberOfLines={3} style={styles.description}>
              {activeBook.description}
            </Typography>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          variant="outline"
          label="✕ Skip"
          onPress={handleNextCard}
          style={styles.actionBtn}
        />
        <Button
          variant="secondary"
          label="♥ Save"
          onPress={handleNextCard}
          style={styles.actionBtn}
        />
        <Button
          variant="primary"
          label="✓ Library"
          onPress={handleNextCard}
          style={styles.actionBtn}
        />
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
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: Spacing['1'],
  },
  toggleBtn: {
    borderRadius: Radius.full,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['6'],
  },
  card: {
    width: '100%',
    height: '90%',
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadow.md,
  },
  coverPlaceholder: {
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['4'],
    opacity: 0.85,
  },
  coverTitle: {
    marginTop: Spacing['2'],
    fontWeight: 'bold',
  },
  cardDetails: {
    padding: Spacing['5'],
    flex: 1,
  },
  author: {
    marginTop: Spacing['1'],
  },
  rating: {
    marginTop: Spacing['2'],
    fontFamily: 'GeistMono_500Medium',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
    marginVertical: Spacing['3'],
  },
  chip: {
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.full,
  },
  description: {
    marginTop: Spacing['2'],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing['3'],
    paddingBottom: Spacing['6'],
  },
  actionBtn: {
    flex: 1,
  },
});

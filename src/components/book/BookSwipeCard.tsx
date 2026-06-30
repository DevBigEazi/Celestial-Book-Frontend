import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Book } from '../../types';
import { Spacing, Radius } from '../../constants/theme';

export interface BookSwipeCardProps {
  book: Book;
  whyBlurb?: string;
  whyLoading?: boolean;
}

export function BookSwipeCard({ book, whyBlurb, whyLoading }: BookSwipeCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} variant="elevated">
      <View style={[styles.coverContainer, { backgroundColor: colors.bgSecondary }]}>
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.coverImage}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <Typography variant="display">📚</Typography>
        )}
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.titleRow}>
          <Typography variant="title" color={colors.textPrimary} style={styles.titleText}>
            {book.title}
          </Typography>
          <Typography variant="subtitle" color={colors.textSecondary}>
            by {book.author}
          </Typography>
        </View>

        <View style={styles.metaRow}>
          <Typography variant="mono" color={colors.accent}>
            ★ {book.rating}
          </Typography>
          <Typography variant="caption" color={colors.textMuted}>
            {book.pageCount} pages • {book.publishedYear}
          </Typography>
        </View>

        <View style={styles.genresRow}>
          {book.genres.map(genre => (
            <Badge key={genre} label={genre} variant="secondary" />
          ))}
        </View>

        <Typography variant="body" color={colors.textSecondary} numberOfLines={3} style={styles.description}>
          {book.description}
        </Typography>

        <View style={[styles.aiSection, { backgroundColor: colors.bgPrimary, borderColor: colors.border }]}>
          <View style={styles.aiHeader}>
            <Typography variant="caption" color={colors.accent} style={styles.aiLabel}>
              ✨ WHY THIS MATCHES YOUR PERSONA
            </Typography>
          </View>
          {whyLoading && !whyBlurb ? (
            <View style={styles.aiLoading}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : (
            <Typography variant="caption" color={colors.textPrimary} style={styles.aiContent}>
              {whyBlurb || `Based on your reader profile, this ${book.genres[0]} book is a perfect fit.`}
            </Typography>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: Spacing['5'],
    padding: 0,
  },
  coverContainer: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  cardDetails: {
    padding: Spacing['5'],
  },
  titleRow: {
    marginBottom: Spacing['1'],
  },
  titleText: {
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    marginBottom: Spacing['3'],
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
    marginBottom: Spacing['3'],
  },
  description: {
    marginBottom: Spacing['4'],
    lineHeight: 20,
  },
  aiSection: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing['3'],
    marginTop: Spacing['2'],
  },
  aiHeader: {
    flexDirection: 'row',
    marginBottom: Spacing['1'],
  },
  aiLabel: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  aiLoading: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  aiContent: {
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

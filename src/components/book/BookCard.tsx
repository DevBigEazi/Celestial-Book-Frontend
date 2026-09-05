import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { Book } from '../../types';
import { Spacing, Radius, Shadow } from '../../constants/theme';

export interface BookCardProps {
  book: Book;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function BookCard({ book, onPress, style }: BookCardProps) {
  const { colors } = useTheme();

  return (
    <Card
      onPress={onPress}
      style={[styles.bookCard, { backgroundColor: colors.bgCard, borderColor: colors.border }, style]}
      variant="outlined"
    >
      <View style={[styles.coverContainer, { backgroundColor: colors.bgSecondary }]}>
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.fallbackCover}>
            <Typography variant="title">📖</Typography>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Typography
          variant="label"
          color={colors.textPrimary}
          numberOfLines={1}
          style={styles.titleText}
        >
          {book.title}
        </Typography>

        <Typography
          variant="caption"
          color={colors.textSecondary}
          numberOfLines={1}
          style={styles.authorText}
        >
          {book.author}
        </Typography>

        <View style={styles.bottomMeta}>
          <View style={[styles.badge, { backgroundColor: colors.accentMuted }]}>
            <Typography variant="caption" color={colors.accent} style={styles.badgeText}>
              ★ {book.rating}
            </Typography>
          </View>
          {book.genres?.[0] && (
            <Typography variant="caption" color={colors.textMuted} numberOfLines={1} style={styles.genreText}>
              {book.genres[0]}
            </Typography>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    width: '100%',
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 0,
    ...Shadow.sm,
  },
  coverContainer: {
    width: '100%',
    height: 195,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  fallbackCover: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    padding: Spacing['3'],
  },
  titleText: {
    fontWeight: '600',
    fontSize: 13,
  },
  authorText: {
    marginTop: 2,
    fontSize: 11,
  },
  bottomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing['2'],
  },
  badge: {
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
  },
  genreText: {
    fontSize: 10,
    maxWidth: 70,
  },
});

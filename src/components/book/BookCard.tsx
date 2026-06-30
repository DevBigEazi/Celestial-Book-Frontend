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
      style={[styles.bookCard, style]}
      variant="outlined"
    >
      <View style={[styles.coverContainer, { backgroundColor: colors.bgSecondary }]}>
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
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
          {book.title}
        </Typography>
        <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
          {book.author}
        </Typography>
        <View style={[styles.badge, { backgroundColor: colors.bgSecondary }]}>
          <Typography variant="caption" color={colors.textAccent} style={styles.badgeText}>
            ★ {book.rating}
          </Typography>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    width: '48%',
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 0,
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
});

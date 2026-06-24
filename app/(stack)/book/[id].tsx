import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { ScreenWrapper } from '../../../src/components/layout/ScreenWrapper';
import { mockBooks } from '../../../src/mock/books';
import { Spacing, Radius } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function BookDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const book = mockBooks.find((b) => b.id === id);

  if (!book) {
    return (
      <ScreenWrapper scrollEnabled={false} style={styles.center}>
        <Typography variant="title" color={colors.error}>Book not found</Typography>
        <Button variant="primary" label="Go Back" onPress={() => router.back()} style={styles.backBtn} />
      </ScreenWrapper>
    );
  }

  const handleBuyBook = () => {
    Linking.openURL(book.purchaseUrl);
  };

  return (
    <ScreenWrapper scrollEnabled={true} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Typography variant="heading" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
          {book.title}
        </Typography>
      </View>

      <View style={styles.bookInfo}>
        <View style={[styles.coverPlaceholder, { backgroundColor: colors.bgSecondary }]}>
          <Typography variant="display">📖</Typography>
        </View>

        <Typography variant="title" color={colors.textPrimary} align="center" style={styles.title}>
          {book.title}
        </Typography>
        <Typography variant="subtitle" color={colors.textSecondary} align="center">
          {book.author}
        </Typography>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Typography variant="label" color={colors.textPrimary}>★ {book.rating}</Typography>
            <Typography variant="caption" color={colors.textSecondary}>Rating</Typography>
          </View>
          <View style={styles.stat}>
            <Typography variant="label" color={colors.textPrimary}>{book.pageCount}</Typography>
            <Typography variant="caption" color={colors.textSecondary}>Pages</Typography>
          </View>
          <View style={styles.stat}>
            <Typography variant="label" color={colors.textPrimary}>{book.publishedYear}</Typography>
            <Typography variant="caption" color={colors.textSecondary}>Year</Typography>
          </View>
        </View>

        <Typography variant="body" color={colors.textPrimary} style={styles.description}>
          {book.description}
        </Typography>
      </View>

      <View style={styles.footerActions}>
        <Button variant="outline" label="Save to Reading List" onPress={() => {}} style={styles.footerBtn} />
        <Button variant="primary" label="Buy Book" onPress={handleBuyBook} style={styles.footerBtn} />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['6'],
  },
  backBtn: {
    marginTop: Spacing['4'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing['4'],
    marginBottom: Spacing['6'],
  },
  headerTitle: {
    marginLeft: Spacing['4'],
    flex: 1,
  },
  bookInfo: {
    alignItems: 'center',
    flex: 1,
  },
  coverPlaceholder: {
    width: 140,
    height: 200,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['5'],
  },
  title: {
    fontWeight: 'bold',
    marginBottom: Spacing['1'],
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: Spacing['5'],
    paddingVertical: Spacing['3'],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0ded6', // default soft border
  },
  stat: {
    alignItems: 'center',
  },
  description: {
    lineHeight: 22,
    marginBottom: Spacing['8'],
  },
  footerActions: {
    flexDirection: 'row',
    gap: Spacing['3'],
    paddingBottom: Spacing['6'],
  },
  footerBtn: {
    flex: 1,
  },
});

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { mockBooks } from '../../src/mock/books';
import { getRecommendations, getWhyThisBook, getReaderPersona } from '../../src/services/ai';
import { ReaderPersona, Book } from '../../src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spacing, Radius } from '../../src/constants/theme';
import { Image } from 'expo-image';

export default function Discover() {
  const { colors } = useTheme();
  const { quizResult, saved, library, toggleSaveBook, toggleLibraryBook } = useAuth();
  
  const [mode, setMode] = useState<'comfort' | 'explorer'>('comfort');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [persona, setPersona] = useState<ReaderPersona | null>(null);
  
  const [whyBlurbs, setWhyBlurbs] = useState<Record<string, string>>({});
  const [whyLoading, setWhyLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let activePersona: ReaderPersona | null = null;
        const cachedPersona = await AsyncStorage.getItem('@cb/reader_persona');
        if (cachedPersona) {
          activePersona = JSON.parse(cachedPersona);
          setPersona(activePersona);
        } else if (quizResult) {
          const generated = await getReaderPersona(quizResult);
          await AsyncStorage.setItem('@cb/reader_persona', JSON.stringify(generated));
          activePersona = generated;
          setPersona(generated);
        }

        if (quizResult) {
          if (mode === 'comfort') {
            const recs = await getRecommendations(quizResult, saved);
            const sorted = recs
              .map(r => mockBooks.find(b => b.id === r.bookId))
              .filter((b): b is Book => !!b);
            
            const remaining = mockBooks.filter(b => !sorted.some(s => s.id === b.id));
            setRecommendedBooks([...sorted, ...remaining]);
            
            const initialReasons: Record<string, string> = {};
            recs.forEach(r => {
              initialReasons[r.bookId] = r.reason;
            });
            setWhyBlurbs(prev => ({ ...prev, ...initialReasons }));
          } else {
            const nonFavoriteBooks = mockBooks.filter(
              book => !book.genres.some(genre => quizResult.genres.includes(genre))
            );
            
            const sorted = [...nonFavoriteBooks].sort((a, b) => b.rating - a.rating);
            setRecommendedBooks(sorted.length > 0 ? sorted : mockBooks);
          }
        } else {
          setRecommendedBooks(mockBooks);
        }
      } catch (error) {
        console.error('Discover loadData failed:', error);
        setRecommendedBooks(mockBooks);
      } finally {
        setLoading(false);
        setCurrentIndex(0);
      }
    }
    loadData();
  }, [mode, quizResult, saved]);

  const activeBook = recommendedBooks[currentIndex];

  useEffect(() => {
    if (!activeBook || !persona || whyBlurbs[activeBook.id]) return;

    async function loadWhyBlurb() {
      setWhyLoading(true);
      try {
        const blurb = await getWhyThisBook(persona!, activeBook);
        setWhyBlurbs(prev => ({ ...prev, [activeBook.id]: blurb }));
      } catch (error) {
        console.error('Failed to load why blurb:', error);
      } finally {
        setWhyLoading(false);
      }
    }
    loadWhyBlurb();
  }, [activeBook, persona, whyBlurbs]);

  const handleNextCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSave = async () => {
    if (activeBook) {
      await toggleSaveBook(activeBook.id);
    }
    handleNextCard();
  };

  const handleLibrary = async () => {
    if (activeBook) {
      await toggleLibraryBook(activeBook.id);
    }
    handleNextCard();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bgPrimary }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Typography variant="body" color={colors.textSecondary} style={styles.loadingText}>
          Curating your personalized shelf...
        </Typography>
      </View>
    );
  }

  if (!activeBook || currentIndex >= recommendedBooks.length) {
    return (
      <ScreenWrapper scrollEnabled={false} style={styles.container}>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="compass"
            title="End of the Shelf"
            message={
              mode === 'comfort'
                ? "You've caught up with all comfort recommendations. Try Explorer mode for some fresh genres!"
                : "You've explored all books outside your typical style! Head back to comfort mode to see your favorites."
            }
            actionLabel="Reset Shelf"
            onAction={() => setCurrentIndex(0)}
          />
        </View>
      </ScreenWrapper>
    );
  }

  const isSaved = saved.includes(activeBook.id);
  const isInLibrary = library.includes(activeBook.id);
  const currentWhyBlurb = whyBlurbs[activeBook.id];

  return (
    <ScreenWrapper scrollEnabled={true} style={styles.container}>
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          Discover
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

      <Card style={styles.card} variant="elevated">
        <View style={[styles.coverContainer, { backgroundColor: colors.bgSecondary }]}>
          {activeBook.coverUrl ? (
            <Image
              source={{ uri: activeBook.coverUrl }}
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
              {activeBook.title}
            </Typography>
            <Typography variant="subtitle" color={colors.textSecondary}>
              by {activeBook.author}
            </Typography>
          </View>

          <View style={styles.metaRow}>
            <Typography variant="mono" color={colors.accent}>
              ★ {activeBook.rating}
            </Typography>
            <Typography variant="caption" color={colors.textMuted}>
              {activeBook.pageCount} pages • {activeBook.publishedYear}
            </Typography>
          </View>

          <View style={styles.genresRow}>
            {activeBook.genres.map(genre => (
              <Badge key={genre} label={genre} variant="secondary" />
            ))}
          </View>

          <Typography variant="body" color={colors.textSecondary} numberOfLines={3} style={styles.description}>
            {activeBook.description}
          </Typography>

          <View style={[styles.aiSection, { backgroundColor: colors.bgPrimary, borderColor: colors.border }]}>
            <View style={styles.aiHeader}>
              <Typography variant="caption" color={colors.accent} style={styles.aiLabel}>
                ✨ WHY THIS MATCHES YOUR PERSONA
              </Typography>
            </View>
            {whyLoading && !currentWhyBlurb ? (
              <View style={styles.aiLoading}>
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : (
              <Typography variant="caption" color={colors.textPrimary} style={styles.aiContent}>
                {currentWhyBlurb || `Based on your reader profile, this ${activeBook.genres[0]} book is a perfect fit.`}
              </Typography>
            )}
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          variant="outline"
          label="Skip"
          onPress={handleNextCard}
          style={styles.actionBtn}
        />
        <Button
          variant={isSaved ? 'primary' : 'outline'}
          label={isSaved ? 'Saved' : 'Save'}
          onPress={handleSave}
          style={styles.actionBtn}
        />
        <Button
          variant={isInLibrary ? 'secondary' : 'primary'}
          label={isInLibrary ? 'In Library' : '+ Library'}
          onPress={handleLibrary}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing['4'],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing['4'],
    marginBottom: Spacing['5'],
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: Spacing['1'],
  },
  toggleBtn: {
    borderRadius: Radius.full,
  },
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

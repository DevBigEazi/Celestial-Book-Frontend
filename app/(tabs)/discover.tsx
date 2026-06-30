import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { BookSwipeCard } from '../../src/components/book';
import { mockBooks } from '../../src/mock/books';
import { getRecommendations, getWhyThisBook, getReaderPersona } from '../../src/services/ai';
import { ReaderPersona, Book } from '../../src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spacing, Radius } from '../../src/constants/theme';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, useReducedMotion } from 'react-native-reanimated';

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

  const reducedMotion = useReducedMotion();

  // Reanimated shared values for swipe gesture
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

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
        translateX.value = 0;
        translateY.value = 0;
      }
    }
    loadData();
  }, [mode, quizResult, saved, translateX, translateY]);

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
    translateX.value = 0;
    translateY.value = 0;
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

  // Animated swipe triggers from buttons
  const animateSwipeLeft = () => {
    if (reducedMotion) {
      handleNextCard();
      return;
    }
    translateX.value = withSpring(-600, { damping: 15 }, (finished) => {
      if (finished) {
        runOnJS(handleNextCard)();
      }
    });
  };

  const animateSwipeRight = (action: 'save' | 'library') => {
    if (reducedMotion) {
      if (action === 'save') {
        handleSave();
      } else {
        handleLibrary();
      }
      return;
    }
    translateX.value = withSpring(600, { damping: 15 }, (finished) => {
      if (finished) {
        if (action === 'save') {
          runOnJS(handleSave)();
        } else {
          runOnJS(handleLibrary)();
        }
      }
    });
  };

  // Pan gesture definition
  const panGesture = Gesture.Pan()
    .enabled(!reducedMotion)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationX > 120) {
        // Swipe Right triggers Save (toggle heart)
        translateX.value = withSpring(600, { velocity: event.velocityX }, (finished) => {
          if (finished) {
            runOnJS(handleSave)();
          }
        });
      } else if (event.translationX < -120) {
        // Swipe Left triggers Skip
        translateX.value = withSpring(-600, { velocity: event.velocityX }, (finished) => {
          if (finished) {
            runOnJS(handleNextCard)();
          }
        });
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // Front card animated style
  const animatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {};
    }
    const rotate = `${translateX.value / 15}deg`;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: rotate },
      ],
    };
  });

  // Background card animated scale/opacity style
  const bgAnimatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: 0.8, transform: [{ scale: 0.95 }, { translateY: 10 }] };
    }
    // Calculate progress based on translation (clamped between 0 and 1)
    const progress = Math.min(Math.abs(translateX.value) / 150, 1);
    const scale = 0.95 + progress * 0.05;
    const opacity = 0.8 + progress * 0.2;
    const translateYVal = 10 - progress * 10;
    return {
      opacity,
      transform: [{ scale }, { translateY: translateYVal }],
    };
  });

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
    <GestureHandlerRootView style={styles.root}>
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

        <View style={styles.cardStack}>
          {/* Background Card */}
          {currentIndex + 1 < recommendedBooks.length && (
            <Animated.View style={[StyleSheet.absoluteFillObject, bgAnimatedStyle]}>
              <BookSwipeCard
                book={recommendedBooks[currentIndex + 1]}
                whyBlurb={whyBlurbs[recommendedBooks[currentIndex + 1].id]}
                whyLoading={false}
              />
            </Animated.View>
          )}

          {/* Front Card */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.frontCard, animatedStyle]}>
              <BookSwipeCard
                book={activeBook}
                whyBlurb={currentWhyBlurb}
                whyLoading={whyLoading}
              />
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.actions}>
          <Button
            variant="outline"
            label="Skip"
            onPress={animateSwipeLeft}
            style={styles.actionBtn}
          />
          <Button
            variant={isSaved ? 'primary' : 'outline'}
            label={isSaved ? 'Saved' : 'Save'}
            onPress={() => animateSwipeRight('save')}
            style={styles.actionBtn}
          />
          <Button
            variant={isInLibrary ? 'secondary' : 'primary'}
            label={isInLibrary ? 'In Library' : '+ Library'}
            onPress={() => animateSwipeRight('library')}
            style={styles.actionBtn}
          />
        </View>
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  cardStack: {
    flex: 1,
    position: 'relative',
    minHeight: 520,
    marginBottom: Spacing['5'],
  },
  frontCard: {
    flex: 1,
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

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { mockBooks } from '../../src/mock/books';
import { Book } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useReducedMotion,
  interpolate,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function SwipeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { saved, toggleSaveBook } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const books: Book[] = mockBooks;
  const reducedMotion = useReducedMotion();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const activeBook = books[currentIndex];

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (!activeBook) return;
    if (direction === 'right') {
      toggleSaveBook(activeBook.id);
    }
    translateX.value = 0;
    translateY.value = 0;
    setCurrentIndex((prev) => (prev + 1 < books.length ? prev + 1 : 0));
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.4;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(handleSwipeComplete)('right');
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(handleSwipeComplete)('left');
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
      };
    }
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10]
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [20, SWIPE_THRESHOLD], [0, 1]),
  }));

  const rejectStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, -20], [1, 0]),
  }));

  if (!activeBook) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.emptyContainer}>
          <Typography variant="title" color={colors.textPrimary} align="center">
            You have explored all stars
          </Typography>
          <Typography variant="body" color={colors.textSecondary} align="center" style={styles.emptySub}>
            Check your TBR list or refresh to wander again.
          </Typography>
          <Pressable
            onPress={() => setCurrentIndex(0)}
            style={[styles.resetButton, { backgroundColor: colors.accent }]}
          >
            <Typography variant="body" color={colors.accentText} style={styles.resetButtonText}>
              Start Over
            </Typography>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  const isSaved = saved.includes(activeBook.id);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenWrapper style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginRight: Spacing['3'] }}>
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </Pressable>
            <View>
              <Typography variant="title" color={colors.textPrimary}>
                SWIPE YOUR STARS
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Right to save · Left to pass
              </Typography>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/(tabs)/tbr')}
            style={[styles.tbrLinkBadge, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
          >
            <Ionicons name="bookmark" size={14} color={colors.accent} />
            <Typography variant="caption" color={colors.accent} style={styles.tbrCountText}>
              {saved.length}
            </Typography>
          </Pressable>
        </View>

        {/* Card Stack Area */}
        <View style={styles.cardArea}>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.card,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
                cardAnimatedStyle,
              ]}
            >
              {/* Like/Reject Stamped Badges */}
              <Animated.View style={[styles.stamp, styles.likeStamp, likeStampStyle]}>
                <Typography variant="title" color="#10B981" style={styles.stampText}>
                  SAVE TO TBR
                </Typography>
              </Animated.View>

              <Animated.View style={[styles.stamp, styles.rejectStamp, rejectStampStyle]}>
                <Typography variant="title" color="#EF4444" style={styles.stampText}>
                  PASS
                </Typography>
              </Animated.View>

              {/* Cover Image */}
              <View style={[styles.coverWrap, { backgroundColor: colors.bgSecondary }]}>
                <Image
                  source={{ uri: activeBook.coverUrl }}
                  style={styles.coverImage}
                  contentFit="cover"
                />
              </View>

              {/* Book Info */}
              <View style={styles.infoWrap}>
                <View style={styles.tagsRow}>
                  {activeBook.atmosphere && (
                    <View style={[styles.atmosphereBadge, { backgroundColor: colors.accentMuted, borderColor: colors.accent }]}>
                      <Typography variant="caption" color={colors.accent} style={styles.atmosphereText}>
                        {activeBook.atmosphere.toUpperCase()}
                      </Typography>
                    </View>
                  )}
                  {activeBook.isNicheOrIndie && (
                    <View style={[styles.atmosphereBadge, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                      <Typography variant="caption" color={colors.textSecondary} style={styles.atmosphereText}>
                        INDIE GEM
                      </Typography>
                    </View>
                  )}
                </View>

                <Typography variant="title" color={colors.textPrimary} numberOfLines={1}>
                  {activeBook.title}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary} style={styles.author}>
                  by {activeBook.author}
                </Typography>

                {/* Tropes */}
                <View style={styles.tropesRow}>
                  {activeBook.tropes?.slice(0, 3).map((trope) => (
                    <View key={trope} style={[styles.tropeChip, { backgroundColor: colors.bgSecondary }]}>
                      <Typography variant="caption" color={colors.textSecondary}>
                        {trope}
                      </Typography>
                    </View>
                  ))}
                </View>

                {activeBook.whyBlurb && (
                  <Typography variant="caption" color={colors.accent} style={styles.blurbText}>
                    &ldquo;{activeBook.whyBlurb}&rdquo;
                  </Typography>
                )}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Floating Actions */}
        <View style={styles.actionsBar}>
          <Pressable
            onPress={() => handleSwipeComplete('left')}
            style={[styles.actionCircle, styles.rejectCircle, { backgroundColor: colors.bgCard, borderColor: '#EF4444' }]}
          >
            <Ionicons name="close" size={26} color="#EF4444" />
          </Pressable>

          <Pressable
            onPress={() => router.push(`/(stack)/book/${activeBook.id}`)}
            style={[styles.actionCircle, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
          >
            <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={() => handleSwipeComplete('right')}
            style={[
              styles.actionCircle,
              styles.likeCircle,
              { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
          >
            <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={26} color={colors.accentText} />
          </Pressable>
        </View>
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing['6'],
    paddingBottom: Spacing['4'],
  },
  tbrLinkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  tbrCountText: {
    fontWeight: '700',
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing['2'],
  },
  card: {
    width: SCREEN_WIDTH - Spacing['6'] * 2,
    height: '92%',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  coverWrap: {
    width: '100%',
    height: '62%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  infoWrap: {
    padding: Spacing['4'],
    flex: 1,
    justifyContent: 'space-between',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    marginBottom: Spacing['1'],
  },
  atmosphereBadge: {
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  atmosphereText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  author: {
    marginBottom: Spacing['2'],
  },
  tropesRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    flexWrap: 'wrap',
    marginBottom: Spacing['2'],
  },
  tropeChip: {
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  blurbText: {
    fontStyle: 'italic',
    lineHeight: 16,
  },
  stamp: {
    position: 'absolute',
    top: 40,
    zIndex: 10,
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.md,
    borderWidth: 2,
  },
  likeStamp: {
    left: 20,
    borderColor: '#10B981',
    transform: [{ rotate: '-15deg' }],
  },
  rejectStamp: {
    right: 20,
    borderColor: '#EF4444',
    transform: [{ rotate: '15deg' }],
  },
  stampText: {
    fontWeight: '800',
    letterSpacing: 2,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing['6'],
    paddingVertical: Spacing['4'],
  },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  rejectCircle: {
    width: 48,
    height: 48,
  },
  likeCircle: {
    width: 58,
    height: 58,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['6'],
  },
  emptySub: {
    marginTop: Spacing['2'],
    marginBottom: Spacing['6'],
  },
  resetButton: {
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['3'],
    borderRadius: Radius.full,
  },
  resetButtonText: {
    fontWeight: '700',
  },
});

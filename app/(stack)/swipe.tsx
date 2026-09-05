import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { Typography } from "../../src/components/ui/Typography";
import { ColorTokens } from "../../src/constants/colors";
import { Radius, Spacing } from "../../src/constants/theme";
import { useTheme } from "../../src/context/ThemeContext";
import { useAuth } from "../../src/hooks/useAuth";
import { mockBooks } from "../../src/mock/books";
import { Book } from "../../src/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const SWIPE_OUT_DURATION = 180;

function BookCardBody({ book, colors }: { book: Book; colors: ColorTokens }) {
  return (
    <>
      {/* Cover Image */}
      <View style={[styles.coverWrap, { backgroundColor: colors.bgSecondary }]}>
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.coverImage}
          contentFit="cover"
          priority="high"
          cachePolicy="memory-disk"
        />
      </View>

      {/* Book Info */}
      <View style={styles.infoWrap}>
        <View style={styles.tagsRow}>
          {book.atmosphere && (
            <View
              style={[
                styles.atmosphereBadge,
                {
                  backgroundColor: colors.accentMuted,
                  borderColor: colors.accent,
                },
              ]}
            >
              <Typography
                variant="caption"
                color={colors.accent}
                style={styles.atmosphereText}
              >
                {book.atmosphere.toUpperCase()}
              </Typography>
            </View>
          )}
          {book.isNicheOrIndie && (
            <View
              style={[
                styles.atmosphereBadge,
                {
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Typography
                variant="caption"
                color={colors.textSecondary}
                style={styles.atmosphereText}
              >
                INDIE GEM
              </Typography>
            </View>
          )}
        </View>

        <Typography
          variant="title"
          color={colors.textPrimary}
          numberOfLines={1}
        >
          {book.title}
        </Typography>
        <Typography
          variant="caption"
          color={colors.textSecondary}
          style={styles.author}
        >
          by {book.author}
        </Typography>

        {/* Tropes */}
        <View style={styles.tropesRow}>
          {book.tropes?.slice(0, 3).map((trope) => (
            <View
              key={trope}
              style={[
                styles.tropeChip,
                { backgroundColor: colors.bgSecondary },
              ]}
            >
              <Typography variant="caption" color={colors.textSecondary}>
                {trope}
              </Typography>
            </View>
          ))}
        </View>

        {book.whyBlurb && (
          <Typography
            variant="caption"
            color={colors.accent}
            style={styles.blurbText}
            numberOfLines={2}
          >
            &ldquo;{book.whyBlurb}&rdquo;
          </Typography>
        )}
      </View>
    </>
  );
}

export default function SwipeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { saved, toggleSaveBook } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const books: Book[] = mockBooks;
  const reducedMotion = useReducedMotion();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardOpacity = useSharedValue(1);

  const activeBook = books[currentIndex];
  const nextBook = books[currentIndex + 1];

  // Restore opacity when the new active book renders
  useEffect(() => {
    cardOpacity.value = 1;
  }, [currentIndex, cardOpacity]);

  // Preload upcoming book covers
  useEffect(() => {
    for (let i = 1; i <= 3; i++) {
      const upcoming = books[currentIndex + i];
      if (upcoming?.coverUrl) {
        Image.prefetch(upcoming.coverUrl);
      }
    }
  }, [currentIndex, books]);

  const onSwipeComplete = (direction: "left" | "right") => {
    if (!activeBook) return;
    if (direction === "right") {
      toggleSaveBook(activeBook.id);
    }
    setCurrentIndex((prev) => (prev + 1 < books.length ? prev + 1 : 0));
  };

  const triggerSwipe = (direction: "left" | "right") => {
    if (!activeBook) return;
    const toValue =
      direction === "right" ? SCREEN_WIDTH * 1.4 : -SCREEN_WIDTH * 1.4;
    translateX.value = withTiming(
      toValue,
      { duration: SWIPE_OUT_DURATION },
      () => {
        cardOpacity.value = 0;
        translateX.value = 0;
        translateY.value = 0;
        runOnJS(onSwipeComplete)(direction);
      },
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.35;
    })
    .onEnd((e) => {
      const isFastFlickRight = e.velocityX > 450;
      const isFastFlickLeft = e.velocityX < -450;
      const isPastRight = translateX.value > SWIPE_THRESHOLD;
      const isPastLeft = translateX.value < -SWIPE_THRESHOLD;

      if (isFastFlickRight || isPastRight) {
        translateX.value = withTiming(
          SCREEN_WIDTH * 1.4,
          { duration: SWIPE_OUT_DURATION },
          () => {
            cardOpacity.value = 0;
            translateX.value = 0;
            translateY.value = 0;
            runOnJS(onSwipeComplete)("right");
          },
        );
      } else if (isFastFlickLeft || isPastLeft) {
        translateX.value = withTiming(
          -SCREEN_WIDTH * 1.4,
          { duration: SWIPE_OUT_DURATION },
          () => {
            cardOpacity.value = 0;
            translateX.value = 0;
            translateY.value = 0;
            runOnJS(onSwipeComplete)("left");
          },
        );
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
        opacity: cardOpacity.value,
      };
    }
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-9, 0, 9],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity: cardOpacity.value,
    };
  });

  const likeStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [20, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const rejectStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -20],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  if (!activeBook) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.emptyContainer}>
          <Typography variant="title" color={colors.textPrimary} align="center">
            You have explored all stars
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            align="center"
            style={styles.emptySub}
          >
            Check your TBR list or refresh to wander again.
          </Typography>
          <Pressable
            onPress={() => setCurrentIndex(0)}
            style={[styles.resetButton, { backgroundColor: colors.accent }]}
          >
            <Typography
              variant="body"
              color={colors.accentText}
              style={styles.resetButtonText}
            >
              Start Over
            </Typography>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  const isSaved = saved.includes(activeBook.id);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <ScreenWrapper style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={colors.textPrimary}
              />
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
            onPress={() => router.push("/(tabs)/tbr")}
            style={[
              styles.tbrLinkBadge,
              {
                backgroundColor: colors.bgSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="bookmark" size={14} color={colors.accent} />
            <Typography
              variant="caption"
              color={colors.accent}
              style={styles.tbrCountText}
            >
              {saved.length}
            </Typography>
          </Pressable>
        </View>

        {/* Card Stack Area */}
        <View style={styles.cardArea}>
          {/* Pre-rendered Next Card sitting directly underneath at 1.0 scale */}
          {nextBook && (
            <View
              style={[
                styles.card,
                styles.underneathCard,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
              ]}
            >
              <BookCardBody book={nextBook} colors={colors} />
            </View>
          )}

          {/* Active Foreground Card */}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.card,
                styles.topCard,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
                cardAnimatedStyle,
              ]}
            >
              {/* Like/Reject Stamped Badges */}
              <Animated.View
                style={[styles.stamp, styles.likeStamp, likeStampStyle]}
              >
                <Typography
                  variant="title"
                  color="#10B981"
                  style={styles.stampText}
                >
                  SAVE TO TBR
                </Typography>
              </Animated.View>

              <Animated.View
                style={[styles.stamp, styles.rejectStamp, rejectStampStyle]}
              >
                <Typography
                  variant="title"
                  color="#EF4444"
                  style={styles.stampText}
                >
                  PASS
                </Typography>
              </Animated.View>

              <Pressable
                onPress={() => router.push(`/(stack)/book/${activeBook.id}`)}
                style={styles.cardPressable}
              >
                <BookCardBody book={activeBook} colors={colors} />
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Floating Actions: Two Dedicated Buttons for Pass and Save */}
        <View style={styles.actionsBar}>
          <Pressable
            onPress={() => triggerSwipe("left")}
            hitSlop={8}
            style={[
              styles.actionCircle,
              styles.passButton,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
            ]}
          >
            <Ionicons name="close" size={28} color="#EF4444" />
          </Pressable>

          <Pressable
            onPress={() => triggerSwipe("right")}
            hitSlop={8}
            style={[
              styles.actionCircle,
              styles.saveButton,
              { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={30}
              color={colors.accentText}
            />
          </Pressable>
        </View>
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing["4"],
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing["4"],
    paddingBottom: Spacing["2"],
    width: "100%",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: Spacing["3"],
  },
  tbrLinkBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["3"],
    paddingVertical: Spacing["1"],
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  tbrCountText: {
    fontWeight: "700",
  },
  cardArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: Spacing["2"],
    position: "relative",
    minHeight: 460,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    height: "100%",
    maxHeight: 560,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    overflow: "hidden",
    position: "absolute",
    alignSelf: "center",
  },
  topCard: {
    zIndex: 2,
    elevation: 4,
  },
  underneathCard: {
    zIndex: 1,
    elevation: 1,
  },
  cardPressable: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  coverWrap: {
    width: "100%",
    height: "56%",
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  infoWrap: {
    padding: Spacing["3"],
    flex: 1,
    justifyContent: "space-between",
  },
  tagsRow: {
    flexDirection: "row",
    gap: Spacing["2"],
    marginBottom: 2,
  },
  atmosphereBadge: {
    paddingHorizontal: Spacing["2"],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  atmosphereText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  author: {
    marginBottom: 2,
  },
  tropesRow: {
    flexDirection: "row",
    gap: Spacing["2"],
    flexWrap: "wrap",
    marginBottom: 4,
  },
  tropeChip: {
    paddingHorizontal: Spacing["2"],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  blurbText: {
    fontStyle: "italic",
    lineHeight: 16,
  },
  stamp: {
    position: "absolute",
    top: 30,
    zIndex: 10,
    paddingHorizontal: Spacing["4"],
    paddingVertical: Spacing["2"],
    borderRadius: Radius.md,
    borderWidth: 2,
  },
  likeStamp: {
    left: 20,
    borderColor: "#10B981",
    transform: [{ rotate: "-15deg" }],
  },
  rejectStamp: {
    right: 20,
    borderColor: "#EF4444",
    transform: [{ rotate: "15deg" }],
  },
  stampText: {
    fontWeight: "800",
    letterSpacing: 2,
  },
  actionsBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing["8"],
    paddingVertical: Spacing["3"],
    width: "100%",
  },
  actionCircle: {
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  passButton: {
    width: 60,
    height: 60,
  },
  saveButton: {
    width: 66,
    height: 66,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["6"],
  },
  emptySub: {
    marginTop: Spacing["2"],
    marginBottom: Spacing["6"],
  },
  resetButton: {
    paddingHorizontal: Spacing["6"],
    paddingVertical: Spacing["3"],
    borderRadius: Radius.full,
  },
  resetButtonText: {
    fontWeight: "700",
  },
});

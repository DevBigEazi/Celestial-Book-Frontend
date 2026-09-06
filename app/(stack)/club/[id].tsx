import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ScreenWrapper } from "../../../src/components/layout/ScreenWrapper";
import { Avatar } from "../../../src/components/ui/Avatar";
import { Button } from "../../../src/components/ui/Button";
import { Card } from "../../../src/components/ui/Card";
import { Typography } from "../../../src/components/ui/Typography";
import { Radius, Spacing } from "../../../src/constants/theme";
import { useCommentSheet } from "../../../src/context/CommentSheetContext";
import { useTheme } from "../../../src/context/ThemeContext";
import { mockClubs } from "../../../src/mock/clubs";
import { mockComments } from "../../../src/mock/comments";
import { mockCirclePosts } from "../../../src/mock/posts";
import { mockUsers } from "../../../src/mock/users";
import { CirclePost, EmotionType } from "../../../src/types/comment";

const EMOTION_MAP: Record<
  EmotionType,
  {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    prompt: string;
  }
> = {
  yearning: {
    label: "Yearning",
    icon: "moon",
    color: "#E5C158",
    prompt: "What line or moment made you yearn?",
  },
  invested: {
    label: "Invested",
    icon: "flame",
    color: "#3B82F6",
    prompt: "What scene had you completely on edge?",
  },
  surprised: {
    label: "Surprised",
    icon: "flash",
    color: "#F59E0B",
    prompt: "Which plot twist knocked the air out of you?",
  },
  angry: {
    label: "Angry",
    icon: "thunderstorm",
    color: "#EF4444",
    prompt: "Which character decision infuriated you?",
  },
  happy: {
    label: "Happy",
    icon: "sunny",
    color: "#10B981",
    prompt: "What quiet joy or bond warmed your spirit?",
  },
  sad: {
    label: "Sad",
    icon: "rainy",
    color: "#8B5CF6",
    prompt: "Which passage broke your heart into pieces?",
  },
};

const TOPICS = [
  "All",
  "Character Motives",
  "Plot Twists",
  "Theories",
  "Favorite Quotes",
  "World-building",
] as const;

export default function BookClubDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { openComments } = useCommentSheet();

  const club = mockClubs.find((c) => c.id === id);
  const [isJoined, setIsJoined] = useState(club?.isJoined ?? false);
  const [memberCount, setMemberCount] = useState(club?.memberCount ?? 0);

  // Circle Posts for this club
  const [circlePosts, setCirclePosts] = useState<CirclePost[]>(() =>
    mockCirclePosts.filter((p) => p.clubId === id),
  );

  // Active filters
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedEmotionFilter, setSelectedEmotionFilter] =
    useState<EmotionType | null>(null);

  // New post state
  const [postEmotion, setPostEmotion] = useState<EmotionType>("invested");
  const [postTopic, setPostTopic] = useState<string>("Character Motives");
  const [chapterRef, setChapterRef] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Likes and comments tracking
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    circlePosts.forEach((p) => {
      map[p.id] = p.isLiked;
    });
    return map;
  });

  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    circlePosts.forEach((p) => {
      map[p.id] = p.likes;
    });
    return map;
  });

  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    () => {
      const map: Record<string, number> = {};
      circlePosts.forEach((p) => {
        map[p.id] = p.commentCount;
      });
      return map;
    },
  );

  const filteredPosts = useMemo(() => {
    return circlePosts.filter((post) => {
      const matchTopic =
        selectedTopic === "All" || post.topicTag === selectedTopic;
      const matchEmotion =
        !selectedEmotionFilter || post.emotion === selectedEmotionFilter;
      return matchTopic && matchEmotion;
    });
  }, [circlePosts, selectedTopic, selectedEmotionFilter]);

  const handleJoinToggle = () => {
    setIsJoined((prev) => {
      const next = !prev;
      setMemberCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  };

  const handleShareCircle = async () => {
    if (!club) return;
    try {
      await Share.share({
        message: `Join our reading circle "${club.name}" on Celestial Book! Reading ${club.currentBook?.title || "together"}.`,
        title: club.name,
      });
    } catch {
      // Ignored
    }
  };

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const current = !prev[postId];
      setLikeCounts((counts) => ({
        ...counts,
        [postId]: (counts[postId] ?? 0) + (current ? 1 : -1),
      }));
      return { ...prev, [postId]: current };
    });
  };

  const handleOpenComments = (post: CirclePost) => {
    const postComments = mockComments.filter((c) => c.postId === post.id);
    openComments(post.id, postComments, () => {
      setCommentCounts((counts) => ({
        ...counts,
        [post.id]: (counts[post.id] ?? post.commentCount) + 1,
      }));
    });
  };

  const handleCreatePost = () => {
    if (!postContent.trim() || !club) return;

    const newPost: CirclePost = {
      id: `circle-post-${Date.now()}`,
      clubId: club.id,
      author: mockUsers[0],
      emotion: postEmotion,
      topicTag: postTopic,
      bookTitle: club.currentBook?.title,
      chapterOrPageRef: chapterRef.trim() || undefined,
      content: postContent.trim(),
      likes: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
    };

    setCirclePosts((prev) => [newPost, ...prev]);
    setPostContent("");
    setChapterRef("");
  };

  if (!club) {
    return (
      <ScreenWrapper scrollEnabled={false} style={styles.center}>
        <Typography variant="title" color={colors.error}>
          Circle not found
        </Typography>
        <Button
          variant="primary"
          label="Back to Circles"
          onPress={() => router.back()}
          style={styles.backBtn}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>

        <Typography
          variant="label"
          color={colors.textPrimary}
          style={styles.topBarTitle}
          numberOfLines={1}
        >
          {club.name}
        </Typography>

        <Pressable onPress={handleShareCircle} style={styles.shareButton}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <Card style={styles.heroCard} variant="outlined">
          <View style={styles.heroTop}>
            {club.coverUrl ? (
              <Image
                source={{ uri: club.coverUrl }}
                style={styles.heroCover}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View
                style={[
                  styles.heroCoverPlaceholder,
                  { backgroundColor: colors.bgSecondary },
                ]}
              >
                <Ionicons name="people" size={32} color={colors.accent} />
              </View>
            )}

            <View style={styles.heroInfo}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badgePill,
                    {
                      backgroundColor: club.isPrivate
                        ? "rgba(239, 68, 68, 0.12)"
                        : "rgba(16, 185, 129, 0.12)",
                      borderColor: club.isPrivate
                        ? "rgba(239, 68, 68, 0.3)"
                        : "rgba(16, 185, 129, 0.3)",
                    },
                  ]}
                >
                  <Ionicons
                    name={club.isPrivate ? "lock-closed" : "earth"}
                    size={11}
                    color={club.isPrivate ? colors.error : colors.accent}
                    style={styles.badgeIcon}
                  />
                  <Typography
                    variant="caption"
                    color={club.isPrivate ? colors.error : colors.accent}
                    style={styles.badgeText}
                  >
                    {club.isPrivate ? "Private Circle" : "Open Circle"}
                  </Typography>
                </View>

                <View
                  style={[
                    styles.badgePill,
                    {
                      backgroundColor: "rgba(229, 193, 88, 0.12)",
                      borderColor: "rgba(229, 193, 88, 0.3)",
                    },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={11}
                    color={colors.accent}
                    style={styles.badgeIcon}
                  />
                  <Typography
                    variant="caption"
                    color={colors.accent}
                    style={styles.badgeText}
                  >
                    {club.isTemporary ? "Sprint Club" : "Ongoing"}
                  </Typography>
                </View>
              </View>

              <Typography
                variant="title"
                color={colors.textPrimary}
                style={styles.heroTitle}
              >
                {club.name}
              </Typography>

              {club.tagline ? (
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.heroTagline}
                >
                  &ldquo;{club.tagline}&rdquo;
                </Typography>
              ) : null}

              <View style={styles.metaRow}>
                <Ionicons
                  name="people-outline"
                  size={13}
                  color={colors.textMuted}
                />
                <Typography
                  variant="caption"
                  color={colors.textMuted}
                  style={styles.metaText}
                >
                  {memberCount} members
                </Typography>
              </View>
            </View>
          </View>

          {/* Milestone Banner */}
          <View
            style={[
              styles.milestoneBanner,
              {
                backgroundColor: colors.bgSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.milestoneHeader}>
              <Ionicons name="flag-outline" size={15} color={colors.accent} />
              <Typography
                variant="label"
                color={colors.accent}
                style={styles.milestoneLabel}
              >
                Reading Milestone
              </Typography>
            </View>
            <Typography
              variant="body"
              color={colors.textPrimary}
              style={styles.milestoneText}
            >
              {club.readingMilestone ||
                "Currently on Chapter 14 · 65% Complete"}
            </Typography>
            {/* Progress bar line */}
            <View
              style={[
                styles.progressBarBg,
                { backgroundColor: colors.divider },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: colors.accent,
                    width: "65%",
                  },
                ]}
              />
            </View>
          </View>

          {/* Description */}
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.heroDescription}
          >
            {club.description}
          </Typography>

          {/* Action Button */}
          <Button
            variant={isJoined ? "outline" : "primary"}
            label={isJoined ? "Joined Sanctuary ✓" : "Join Circle"}
            onPress={handleJoinToggle}
            style={styles.joinButton}
          />
        </Card>

        {/* Current Book Selection */}
        {club.currentBook && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="book-outline" size={18} color={colors.accent} />
              <Typography
                variant="subtitle"
                color={colors.textPrimary}
                style={styles.sectionHeading}
              >
                Current Book Selection
              </Typography>
            </View>

            <Card
              onPress={() =>
                router.push(`/(stack)/book/${club.currentBook!.id}`)
              }
              style={styles.bookCard}
              variant="outlined"
            >
              {club.currentBook.coverUrl ? (
                <Image
                  source={{ uri: club.currentBook.coverUrl }}
                  style={styles.bookCover}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View
                  style={[
                    styles.bookCoverPlaceholder,
                    { backgroundColor: colors.bgSecondary },
                  ]}
                >
                  <Ionicons name="book" size={24} color={colors.textMuted} />
                </View>
              )}

              <View style={styles.bookDetails}>
                <Typography
                  variant="label"
                  color={colors.textPrimary}
                  style={styles.bookTitle}
                  numberOfLines={2}
                >
                  {club.currentBook.title}
                </Typography>
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.bookAuthor}
                >
                  by {club.currentBook.author}
                </Typography>
                <View style={styles.bookMeta}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={colors.accent} />
                    <Typography
                      variant="caption"
                      color={colors.accent}
                      style={styles.ratingText}
                    >
                      {club.currentBook.rating.toFixed(1)}
                    </Typography>
                  </View>
                  <Typography
                    variant="caption"
                    color={colors.textMuted}
                    style={styles.viewBookLink}
                  >
                    Tap to view details →
                  </Typography>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Emotional Reactions Prompt Bar */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="heart-circle-outline"
              size={20}
              color={colors.accent}
            />
            <Typography
              variant="subtitle"
              color={colors.textPrimary}
              style={styles.sectionHeading}
            >
              Circle Emotional Spectrum
            </Typography>
          </View>
          <Typography
            variant="caption"
            color={colors.textMuted}
            style={styles.sectionSub}
          >
            Tap an emotion to filter circle thoughts, or set your mood for a new
            post
          </Typography>

          <View style={styles.emotionPromptGrid}>
            {(Object.keys(EMOTION_MAP) as EmotionType[]).map((emKey) => {
              const em = EMOTION_MAP[emKey];
              const isFilterActive = selectedEmotionFilter === emKey;
              const isPostSelected = postEmotion === emKey;

              return (
                <Pressable
                  key={emKey}
                  onPress={() => {
                    if (selectedEmotionFilter === emKey) {
                      setSelectedEmotionFilter(null);
                    } else {
                      setSelectedEmotionFilter(emKey);
                      setPostEmotion(emKey);
                    }
                  }}
                  style={[
                    styles.emotionChip,
                    {
                      backgroundColor: isFilterActive
                        ? `${em.color}22`
                        : colors.bgSecondary,
                      borderColor:
                        isFilterActive || isPostSelected
                          ? em.color
                          : colors.border,
                    },
                  ]}
                >
                  <Ionicons name={em.icon} size={16} color={em.color} />
                  <Typography
                    variant="caption"
                    color={
                      isFilterActive || isPostSelected
                        ? em.color
                        : colors.textPrimary
                    }
                    style={styles.emotionChipText}
                  >
                    {em.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Post Creation Box */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons
              name="chatbubbles-outline"
              size={18}
              color={colors.accent}
            />
            <Typography
              variant="subtitle"
              color={colors.textPrimary}
              style={styles.sectionHeading}
            >
              Post to Discussion Forum
            </Typography>
          </View>

          {isJoined ? (
            <Card style={styles.createPostCard} variant="outlined">
              {/* Prompt banner for selected emotion */}
              <View
                style={[
                  styles.selectedEmotionPrompt,
                  {
                    backgroundColor: `${EMOTION_MAP[postEmotion].color}15`,
                    borderColor: `${EMOTION_MAP[postEmotion].color}40`,
                  },
                ]}
              >
                <Ionicons
                  name={EMOTION_MAP[postEmotion].icon}
                  size={16}
                  color={EMOTION_MAP[postEmotion].color}
                />
                <Typography
                  variant="caption"
                  color={EMOTION_MAP[postEmotion].color}
                  style={styles.promptBannerText}
                >
                  {EMOTION_MAP[postEmotion].prompt}
                </Typography>
              </View>

              {/* Topic & Chapter selection row */}
              <View style={styles.formRow}>
                <View style={styles.formFieldHalf}>
                  <Typography
                    variant="caption"
                    color={colors.textMuted}
                    style={styles.fieldLabel}
                  >
                    Topic Focus
                  </Typography>
                  <View style={styles.topicSelectRow}>
                    {(
                      [
                        "Character Motives",
                        "Plot Twists",
                        "Theories",
                        "Favorite Quotes",
                      ] as const
                    ).map((t) => {
                      const isChosen = postTopic === t;
                      return (
                        <Pressable
                          key={t}
                          onPress={() => setPostTopic(t)}
                          style={[
                            styles.topicChoiceChip,
                            {
                              backgroundColor: isChosen
                                ? colors.accent
                                : colors.bgSecondary,
                              borderColor: isChosen
                                ? colors.accent
                                : colors.border,
                            },
                          ]}
                        >
                          <Typography
                            variant="caption"
                            color={
                              isChosen ? colors.bgPrimary : colors.textSecondary
                            }
                            style={styles.topicChoiceText}
                            numberOfLines={1}
                          >
                            {t}
                          </Typography>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.formFieldHalf}>
                  <Typography
                    variant="caption"
                    color={colors.textMuted}
                    style={styles.fieldLabel}
                  >
                    Chapter / Page (Optional)
                  </Typography>
                  <TextInput
                    placeholder="e.g. Chapter 14 or Page 182"
                    placeholderTextColor={colors.textMuted}
                    value={chapterRef}
                    onChangeText={setChapterRef}
                    style={[
                      styles.chapterInput,
                      {
                        color: colors.textPrimary,
                        backgroundColor: colors.bgSecondary,
                        borderColor: colors.border,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Post text input */}
              <TextInput
                placeholder="Express your theories, grief, or reverence..."
                placeholderTextColor={colors.textMuted}
                value={postContent}
                onChangeText={setPostContent}
                multiline
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                style={[
                  styles.postInput,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bgSecondary,
                    borderColor: isInputFocused ? colors.accent : colors.border,
                  },
                ]}
              />

              <View style={styles.postCardFooter}>
                <View style={styles.postingAsRow}>
                  <Avatar
                    url={mockUsers[0].avatarUrl}
                    name={mockUsers[0].name}
                    size="sm"
                  />
                  <Typography
                    variant="caption"
                    color={colors.textMuted}
                    style={styles.postingAsText}
                  >
                    Posting as @{mockUsers[0].username}
                  </Typography>
                </View>

                <Button
                  variant="primary"
                  size="sm"
                  label="Post Thought"
                  onPress={handleCreatePost}
                  disabled={!postContent.trim()}
                  style={styles.submitPostBtn}
                />
              </View>
            </Card>
          ) : (
            <Card style={styles.joinPromptCard} variant="outlined">
              <Ionicons
                name="planet-outline"
                size={26}
                color={colors.accent}
                style={styles.promptIcon}
              />
              <Typography
                variant="body"
                color={colors.textPrimary}
                align="center"
                style={styles.promptTitle}
              >
                Join {club.name}
              </Typography>
              <Typography
                variant="caption"
                color={colors.textSecondary}
                align="center"
                style={styles.promptSub}
              >
                Become a member to share your emotional reactions, chapter
                reflections, and discussion threads.
              </Typography>
              <Button
                variant="primary"
                size="sm"
                label="Join Sanctuary to Participate"
                onPress={handleJoinToggle}
                style={styles.joinPromptBtn}
              />
            </Card>
          )}
        </View>

        {/* Discussion Forum Filter Bar */}
        <View style={styles.forumHeaderRow}>
          <Typography
            variant="subtitle"
            color={colors.textPrimary}
            style={styles.forumTitle}
          >
            Discussions ({filteredPosts.length})
          </Typography>

          {selectedEmotionFilter && (
            <Pressable
              onPress={() => setSelectedEmotionFilter(null)}
              style={[
                styles.clearFilterPill,
                {
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Typography variant="caption" color={colors.accent}>
                Showing: {EMOTION_MAP[selectedEmotionFilter].label} ✕
              </Typography>
            </Pressable>
          )}
        </View>

        {/* Topic Filter Pills */}
        <View style={styles.topicFilterContainer}>
          {TOPICS.map((topic) => {
            const isActive = selectedTopic === topic;
            return (
              <Pressable
                key={topic}
                onPress={() => setSelectedTopic(topic)}
                style={[
                  styles.topicFilterPill,
                  {
                    backgroundColor: isActive
                      ? colors.accent
                      : colors.bgSecondary,
                    borderColor: isActive ? colors.accent : colors.border,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={isActive ? colors.bgPrimary : colors.textSecondary}
                  style={styles.topicFilterText}
                >
                  {topic}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {/* Discussion Post Cards */}
        {filteredPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="moon-outline"
              size={36}
              color={colors.textMuted}
              style={styles.emptyIcon}
            />
            <Typography
              variant="label"
              color={colors.textPrimary}
              align="center"
            >
              No discussions found
            </Typography>
            <Typography
              variant="caption"
              color={colors.textMuted}
              align="center"
              style={styles.emptySub}
            >
              {selectedEmotionFilter || selectedTopic !== "All"
                ? "Try changing your emotion or topic filter to see more thoughts."
                : "Be the first to share an atmospheric reflection with the circle!"}
            </Typography>
          </View>
        ) : (
          filteredPosts.map((item) => {
            const emotionConfig =
              EMOTION_MAP[item.emotion] || EMOTION_MAP.invested;
            const isPostLiked = !!likedPosts[item.id];
            const postLikes = likeCounts[item.id] ?? item.likes;
            const postComments = commentCounts[item.id] ?? item.commentCount;

            return (
              <Card key={item.id} style={styles.postCard} variant="outlined">
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <Avatar
                    url={item.author.avatarUrl}
                    name={item.author.name}
                    size="sm"
                  />
                  <View style={styles.postHeaderText}>
                    <Typography
                      variant="label"
                      color={colors.textPrimary}
                      style={styles.postAuthorName}
                    >
                      {item.author.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={colors.textMuted}
                      style={styles.postUsername}
                    >
                      @{item.author.username}
                    </Typography>
                  </View>

                  {/* Emotion Badge */}
                  <View
                    style={[
                      styles.postEmotionBadge,
                      {
                        backgroundColor: `${emotionConfig.color}18`,
                        borderColor: `${emotionConfig.color}40`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={emotionConfig.icon}
                      size={12}
                      color={emotionConfig.color}
                    />
                    <Typography
                      variant="caption"
                      color={emotionConfig.color}
                      style={styles.postEmotionText}
                    >
                      {emotionConfig.label}
                    </Typography>
                  </View>
                </View>

                {/* Tags Row: Topic & Chapter */}
                {(item.topicTag || item.chapterOrPageRef) && (
                  <View style={styles.postTagsRow}>
                    {item.topicTag && (
                      <View
                        style={[
                          styles.tagPill,
                          {
                            backgroundColor: colors.bgSecondary,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name="pricetag-outline"
                          size={10}
                          color={colors.textSecondary}
                        />
                        <Typography
                          variant="caption"
                          color={colors.textSecondary}
                          style={styles.tagPillText}
                        >
                          {item.topicTag}
                        </Typography>
                      </View>
                    )}
                    {item.chapterOrPageRef && (
                      <View
                        style={[
                          styles.tagPill,
                          {
                            backgroundColor: colors.bgSecondary,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name="bookmark-outline"
                          size={10}
                          color={colors.accent}
                        />
                        <Typography
                          variant="caption"
                          color={colors.accent}
                          style={styles.tagPillText}
                        >
                          {item.chapterOrPageRef}
                        </Typography>
                      </View>
                    )}
                  </View>
                )}

                {/* Content */}
                <Typography
                  variant="body"
                  color={colors.textPrimary}
                  style={styles.postBodyText}
                >
                  {item.content}
                </Typography>

                {/* Footer Actions */}
                <View
                  style={[
                    styles.postFooter,
                    { borderTopColor: colors.divider },
                  ]}
                >
                  <Pressable
                    onPress={() => handleToggleLike(item.id)}
                    style={styles.actionBtn}
                  >
                    <Ionicons
                      name={isPostLiked ? "heart" : "heart-outline"}
                      size={18}
                      color={isPostLiked ? colors.error : colors.textSecondary}
                    />
                    <Typography
                      variant="caption"
                      color={isPostLiked ? colors.error : colors.textSecondary}
                      style={styles.actionCount}
                    >
                      {postLikes}
                    </Typography>
                  </Pressable>

                  <Pressable
                    onPress={() => handleOpenComments(item)}
                    style={styles.actionBtn}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={17}
                      color={colors.textSecondary}
                    />
                    <Typography
                      variant="caption"
                      color={colors.textSecondary}
                      style={styles.actionCount}
                    >
                      {postComments}
                    </Typography>
                  </Pressable>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["6"],
  },
  backBtn: {
    marginTop: Spacing["4"],
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["4"],
    paddingVertical: Spacing["3"],
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Spacing["2"],
    marginRight: Spacing["2"],
  },
  topBarTitle: {
    flex: 1,
    fontWeight: "700",
  },
  shareButton: {
    padding: Spacing["2"],
  },
  scrollContent: {
    paddingHorizontal: Spacing["4"],
    paddingTop: Spacing["4"],
    paddingBottom: Spacing["12"],
  },
  heroCard: {
    padding: Spacing["4"],
    marginBottom: Spacing["5"],
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing["3"],
  },
  heroCover: {
    width: 76,
    height: 104,
    borderRadius: Radius.md,
  },
  heroCoverPlaceholder: {
    width: 76,
    height: 104,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  heroInfo: {
    flex: 1,
    marginLeft: Spacing["4"],
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
    marginBottom: Spacing["2"],
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["2"],
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  heroTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  heroTagline: {
    fontStyle: "italic",
    marginBottom: Spacing["2"],
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: "GeistMono_500Medium",
  },
  milestoneBanner: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing["3"],
    marginVertical: Spacing["3"],
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  milestoneLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  milestoneText: {
    fontWeight: "600",
    fontSize: 13,
    marginBottom: Spacing["2"],
  },
  progressBarBg: {
    height: 5,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  heroDescription: {
    lineHeight: 20,
    marginBottom: Spacing["4"],
  },
  joinButton: {
    width: "100%",
  },
  sectionContainer: {
    marginBottom: Spacing["5"],
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["2"],
    marginBottom: Spacing["1"],
  },
  sectionHeading: {
    fontWeight: "700",
  },
  sectionSub: {
    marginBottom: Spacing["3"],
  },
  bookCard: {
    flexDirection: "row",
    padding: Spacing["3"],
    alignItems: "center",
  },
  bookCover: {
    width: 52,
    height: 74,
    borderRadius: Radius.sm,
  },
  bookCoverPlaceholder: {
    width: 52,
    height: 74,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  bookDetails: {
    flex: 1,
    marginLeft: Spacing["3"],
    justifyContent: "center",
  },
  bookTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  bookAuthor: {
    marginBottom: Spacing["2"],
  },
  bookMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontWeight: "700",
    fontFamily: "GeistMono_500Medium",
  },
  viewBookLink: {
    fontStyle: "italic",
  },
  emotionPromptGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
    marginTop: Spacing["2"],
  },
  emotionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["3"],
    paddingVertical: Spacing["2"],
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 6,
  },
  emotionChipText: {
    fontWeight: "600",
  },
  createPostCard: {
    padding: Spacing["3"],
  },
  selectedEmotionPrompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["2"],
    paddingHorizontal: Spacing["3"],
    paddingVertical: Spacing["2"],
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginBottom: Spacing["3"],
  },
  promptBannerText: {
    fontWeight: "600",
    flex: 1,
  },
  formRow: {
    flexDirection: "column",
    gap: Spacing["3"],
    marginBottom: Spacing["3"],
  },
  formFieldHalf: {
    width: "100%",
  },
  fieldLabel: {
    marginBottom: 4,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  topicSelectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
  },
  topicChoiceChip: {
    paddingHorizontal: Spacing["2"],
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  topicChoiceText: {
    fontSize: 11,
    fontWeight: "600",
  },
  chapterInput: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing["3"],
    paddingVertical: Spacing["2"],
    fontSize: 13,
    ...(Platform.OS === "web"
      ? ({
          outlineStyle: "none",
          outlineWidth: 0,
        } as unknown as Record<string, unknown>)
      : {}),
  },
  postInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing["3"],
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: Spacing["3"],
    ...(Platform.OS === "web"
      ? ({
          outlineStyle: "none",
          outlineWidth: 0,
        } as unknown as Record<string, unknown>)
      : {}),
  },
  postCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postingAsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["2"],
  },
  postingAsText: {
    fontSize: 11,
  },
  submitPostBtn: {
    minWidth: 100,
  },
  joinPromptCard: {
    padding: Spacing['5'],
    alignItems: 'center',
  },
  promptIcon: {
    marginBottom: Spacing['2'],
  },
  promptTitle: {
    fontWeight: "700",
    marginBottom: Spacing["1"],
  },
  promptSub: {
    lineHeight: 18,
    marginBottom: Spacing["4"],
    maxWidth: 280,
  },
  joinPromptBtn: {
    minWidth: 200,
  },
  forumHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2"],
  },
  forumTitle: {
    fontWeight: "700",
  },
  clearFilterPill: {
    paddingHorizontal: Spacing["2"],
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  topicFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
    marginBottom: Spacing["4"],
  },
  topicFilterPill: {
    paddingHorizontal: Spacing["3"],
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  topicFilterText: {
    fontWeight: "600",
    fontSize: 12,
  },
  postCard: {
    padding: Spacing["4"],
    marginBottom: Spacing["3"],
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["2"],
  },
  postHeaderText: {
    flex: 1,
    marginLeft: Spacing["3"],
  },
  postAuthorName: {
    fontWeight: "700",
  },
  postUsername: {
    fontFamily: "GeistMono_400Regular",
    fontSize: 11,
  },
  postEmotionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing["2"],
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  postEmotionText: {
    fontSize: 11,
    fontWeight: "700",
  },
  postTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing["2"],
    marginBottom: Spacing["2"],
  },
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing["2"],
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: "600",
  },
  postBodyText: {
    lineHeight: 20,
    marginBottom: Spacing["3"],
  },
  postFooter: {
    flexDirection: "row",
    gap: Spacing["5"],
    paddingTop: Spacing["3"],
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionCount: {
    fontFamily: "GeistMono_500Medium",
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing["8"],
    paddingHorizontal: Spacing["4"],
  },
  emptyIcon: {
    marginBottom: Spacing["3"],
  },
  emptySub: {
    marginTop: Spacing["1"],
    maxWidth: 260,
  },
});

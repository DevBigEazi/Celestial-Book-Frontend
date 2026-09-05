import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useCommentSheet } from '../../src/context/CommentSheetContext';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { mockClubs } from '../../src/mock/clubs';
import { mockCirclePosts } from '../../src/mock/posts';
import { BookClub } from '../../src/types';
import { Spacing, Radius } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

type ClubTab = 'circles' | 'discover';

const EMOTION_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  yearning: { icon: 'moon', color: '#E5C158' },
  surprised: { icon: 'flash', color: '#F59E0B' },
  invested: { icon: 'flame', color: '#3B82F6' },
  angry: { icon: 'thunderstorm', color: '#EF4444' },
  happy: { icon: 'sunny', color: '#10B981' },
  sad: { icon: 'rainy', color: '#8B5CF6' },
};

export default function ClubScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { openComments } = useCommentSheet();
  const [activeTab, setActiveTab] = useState<ClubTab>('circles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    mockCirclePosts.forEach((p) => {
      map[p.id] = p.isLiked;
    });
    return map;
  });
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    mockCirclePosts.forEach((p) => {
      map[p.id] = p.likes;
    });
    return map;
  });

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const current = !!prev[postId];
      const next = !current;
      setLikeCounts((counts) => ({
        ...counts,
        [postId]: (counts[postId] ?? 0) + (next ? 1 : -1),
      }));
      return { ...prev, [postId]: next };
    });
  };

  const filteredClubs = mockClubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.currentBook?.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredPosts = mockCirclePosts.filter((post) => {
    if (selectedEmotion && post.emotion !== selectedEmotion) return false;
    return true;
  });

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          BOOK CLUBS
        </Typography>
        <Typography variant="caption" color={colors.accent} style={styles.subtitle}>
          WHERE BOOKS LIVE ON · CIRCLES
        </Typography>

        {/* Search Bar per PRD Section 15 */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.bgCard,
              borderColor: isSearchFocused ? colors.accent : colors.border,
              borderWidth: 1.5,
              boxShadow: isSearchFocused
                ? `0 0 0 3px ${colors.accent}33`
                : undefined,
              ...(Platform.OS === 'web'
                ? ({
                    outlineStyle: 'none',
                    outlineWidth: 0,
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  } as any)
                : {}),
            },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={isSearchFocused ? colors.accent : colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search by book title, author, circle..."
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            cursorColor={colors.accent}
            style={[
              styles.searchInput,
              {
                color: colors.textPrimary,
                ...(Platform.OS === 'web'
                  ? ({
                      outlineStyle: 'none',
                      outlineWidth: 0,
                      boxShadow: 'none',
                    } as any)
                  : {}),
              },
            ]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabsRow, { backgroundColor: colors.bgSecondary }]}>
          <Pressable
            onPress={() => setActiveTab('circles')}
            style={[styles.tabButton, activeTab === 'circles' && { backgroundColor: colors.accent }]}
          >
            <Typography
              variant="caption"
              color={activeTab === 'circles' ? colors.accentText : colors.textSecondary}
              style={[styles.tabText, activeTab === 'circles' && styles.activeTabText]}
            >
              MY CIRCLES
            </Typography>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('discover')}
            style={[styles.tabButton, activeTab === 'discover' && { backgroundColor: colors.accent }]}
          >
            <Typography
              variant="caption"
              color={activeTab === 'discover' ? colors.accentText : colors.textSecondary}
              style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}
            >
              EXPLORE CIRCLES
            </Typography>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Circles List */}
        <View style={styles.sectionWrap}>
          <Typography variant="title" color={colors.textPrimary} style={styles.sectionTitle}>
            {activeTab === 'circles' ? 'Active Reading Circles' : 'Discover Circles'}
          </Typography>

          <FlatList
            horizontal
            data={filteredClubs}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalClubs}
            renderItem={({ item }: { item: BookClub }) => (
              <Pressable
                onPress={() => router.push(`/(stack)/club/${item.id}`)}
                style={[
                  styles.circleCard,
                  { backgroundColor: colors.bgCard, borderColor: colors.border },
                ]}
              >
                <Image
                  source={{ uri: item.coverUrl }}
                  style={styles.circleImage}
                  contentFit="cover"
                />
                <View style={styles.circleBody}>
                  {item.isPrivate && (
                    <View style={[styles.privateBadge, { backgroundColor: colors.accentMuted }]}>
                      <Ionicons name="lock-closed" size={10} color={colors.accent} />
                      <Typography variant="caption" color={colors.accent} style={styles.privateText}>
                        PRIVATE CIRCLE
                      </Typography>
                    </View>
                  )}

                  <Typography variant="subtitle" color={colors.textPrimary} numberOfLines={1}>
                    {item.name}
                  </Typography>

                  <Typography variant="caption" color={colors.accent} style={styles.circleTagline}>
                    {item.tagline}
                  </Typography>

                  {item.currentBook && (
                    <View style={styles.readingNowRow}>
                      <Ionicons name="book-outline" size={12} color={colors.textSecondary} />
                      <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
                        {item.currentBook.title}
                      </Typography>
                    </View>
                  )}

                  <Typography variant="caption" color={colors.textMuted} style={styles.memberCount}>
                    {item.memberCount} members
                  </Typography>
                </View>
              </Pressable>
            )}
          />
        </View>

        {/* Emotional Reactions Feed Section */}
        <View style={styles.feedSection}>
          <View style={styles.feedHeader}>
            <View>
              <Typography variant="title" color={colors.textPrimary}>
                Emotional Reactions
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                What readers are feeling right now inside circles
              </Typography>
            </View>
          </View>

          {/* Emotion Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emotionScroll}>
            <Pressable
              onPress={() => setSelectedEmotion(null)}
              style={[
                styles.emotionChip,
                {
                  backgroundColor: selectedEmotion === null ? colors.accent : colors.bgCard,
                  borderColor: selectedEmotion === null ? colors.accent : colors.border,
                },
              ]}
            >
              <Typography
                variant="caption"
                color={selectedEmotion === null ? colors.accentText : colors.textPrimary}
              >
                All
              </Typography>
            </Pressable>

            {Object.keys(EMOTION_ICONS).map((emotionKey) => {
              const config = EMOTION_ICONS[emotionKey];
              const isSelected = selectedEmotion === emotionKey;
              return (
                <Pressable
                  key={emotionKey}
                  onPress={() => setSelectedEmotion(isSelected ? null : emotionKey)}
                  style={[
                    styles.emotionChip,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.bgCard,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={config.icon}
                    size={12}
                    color={isSelected ? colors.accentText : config.color}
                    style={{ marginRight: 4 }}
                  />
                  <Typography
                    variant="caption"
                    color={isSelected ? colors.accentText : colors.textPrimary}
                    style={styles.emotionLabel}
                  >
                    {emotionKey.toUpperCase()}
                  </Typography>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Post Items */}
          <View style={styles.postsList}>
            {filteredPosts.map((post) => {
              const emotionCfg = EMOTION_ICONS[post.emotion] || EMOTION_ICONS.yearning;
              const isLiked = !!likedPosts[post.id];
              const likes = likeCounts[post.id] ?? post.likes;
              const commentsCount = commentCounts[post.id] ?? post.commentCount;

              const handleOpenComments = () => {
                openComments(post.id, undefined, () => {
                  setCommentCounts((prev) => ({
                    ...prev,
                    [post.id]: (prev[post.id] ?? post.commentCount) + 1,
                  }));
                });
              };

              return (
                <View
                  key={post.id}
                  style={[
                    styles.postCard,
                    { backgroundColor: colors.bgCard, borderColor: colors.border },
                  ]}
                >
                  {/* Top Author & Emotion */}
                  <View style={styles.postTopRow}>
                    <View style={styles.authorRow}>
                      <Image
                        source={{ uri: post.author.avatarUrl }}
                        style={styles.authorAvatar}
                      />
                      <View>
                        <Typography variant="subtitle" color={colors.textPrimary}>
                          {post.author.name}
                        </Typography>
                        {post.bookTitle && (
                          <Typography variant="caption" color={colors.textSecondary}>
                            {post.bookTitle} · {post.chapterOrPageRef}
                          </Typography>
                        )}
                      </View>
                    </View>

                    {/* Emotion Capsule */}
                    <View
                      style={[
                        styles.emotionCapsule,
                        { backgroundColor: colors.bgSecondary, borderColor: emotionCfg.color },
                      ]}
                    >
                      <Ionicons name={emotionCfg.icon} size={12} color={emotionCfg.color} />
                      <Typography
                        variant="caption"
                        color={emotionCfg.color}
                        style={styles.emotionCapsuleText}
                      >
                        {post.emotion.toUpperCase()}
                      </Typography>
                    </View>
                  </View>

                  {/* Content */}
                  <Typography variant="body" color={colors.textPrimary} style={styles.postBody}>
                    {post.content}
                  </Typography>

                  {/* Footer */}
                  <View style={[styles.postFooter, { borderTopColor: colors.divider }]}>
                    <Pressable
                      onPress={() => handleToggleLike(post.id)}
                      style={styles.postStatBtn}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={15}
                        color={isLiked ? colors.error : colors.accent}
                      />
                      <Typography
                        variant="caption"
                        color={isLiked ? colors.error : colors.textSecondary}
                        style={styles.statLabel}
                      >
                        {likes}
                      </Typography>
                    </Pressable>

                    <Pressable
                      onPress={handleOpenComments}
                      style={styles.postStatBtn}
                      hitSlop={8}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={15}
                        color={colors.textSecondary}
                      />
                      <Typography
                        variant="caption"
                        color={colors.textSecondary}
                        style={styles.statLabel}
                      >
                        {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
                      </Typography>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing['6'],
    paddingTop: Spacing['6'],
    paddingBottom: Spacing['3'],
  },
  subtitle: {
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: Spacing['4'],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['3'],
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing['3'],
  },
  searchIcon: {
    marginRight: Spacing['2'],
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: Spacing['6'],
  },
  sectionWrap: {
    paddingTop: Spacing['3'],
    paddingBottom: Spacing['4'],
  },
  sectionTitle: {
    paddingHorizontal: Spacing['6'],
    marginBottom: Spacing['3'],
  },
  horizontalClubs: {
    paddingHorizontal: Spacing['6'],
    gap: Spacing['3'],
  },
  circleCard: {
    width: 230,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  circleImage: {
    width: '100%',
    height: 105,
  },
  circleBody: {
    padding: Spacing['3'],
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginBottom: 4,
  },
  privateText: {
    fontSize: 9,
    fontWeight: '700',
  },
  circleTagline: {
    marginVertical: 2,
  },
  readingNowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  memberCount: {
    marginTop: 6,
  },
  feedSection: {
    paddingHorizontal: Spacing['6'],
    marginTop: Spacing['2'],
  },
  feedHeader: {
    marginBottom: Spacing['3'],
  },
  emotionScroll: {
    marginBottom: Spacing['4'],
  },
  emotionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.full,
    borderWidth: 1,
    marginRight: Spacing['2'],
  },
  emotionLabel: {
    fontWeight: '600',
    fontSize: 10,
  },
  postsList: {
    gap: Spacing['3'],
  },
  postCard: {
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  postTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing['3'],
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    flex: 1,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
  },
  emotionCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing['2'],
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  emotionCapsuleText: {
    fontSize: 9,
    fontWeight: '700',
  },
  postBody: {
    lineHeight: 22,
    marginBottom: Spacing['3'],
  },
  postFooter: {
    flexDirection: 'row',
    gap: Spacing['5'],
    paddingTop: Spacing['2'],
    borderTopWidth: 1,
  },
  postStatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  statLabel: {
    marginLeft: 2,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ScreenWrapper } from "../../src/components/layout/ScreenWrapper";
import { Typography } from "../../src/components/ui/Typography";
import { Radius, Spacing } from "../../src/constants/theme";
import { useCommentSheet } from "../../src/context/CommentSheetContext";
import { useTheme } from "../../src/context/ThemeContext";
import { mockBooks } from "../../src/mock/books";
import { mockClubs } from "../../src/mock/clubs";
import { mockCirclePosts } from "../../src/mock/posts";
import { BookClub } from "../../src/types";

type ClubTab = "my_circles" | "discover";

const EMOTION_ICONS: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  yearning: { icon: "moon", color: "#E5C158" },
  surprised: { icon: "flash", color: "#F59E0B" },
  invested: { icon: "flame", color: "#3B82F6" },
  angry: { icon: "thunderstorm", color: "#EF4444" },
  happy: { icon: "sunny", color: "#10B981" },
  sad: { icon: "rainy", color: "#8B5CF6" },
};

export default function ClubScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { openComments } = useCommentSheet();

  const [activeTab, setActiveTab] = useState<ClubTab>("my_circles");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const [clubs, setClubs] = useState<BookClub[]>(mockClubs);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleTagline, setNewCircleTagline] = useState("");
  const [newCircleDesc, setNewCircleDesc] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(mockBooks[0].id);
  const [isNewCirclePrivate, setIsNewCirclePrivate] = useState(false);

  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    {},
  );
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

  const handleToggleJoin = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id === clubId) {
          const nextJoined = !c.isJoined;
          return {
            ...c,
            isJoined: nextJoined,
            memberCount: nextJoined ? c.memberCount + 1 : c.memberCount - 1,
          };
        }
        return c;
      }),
    );
  };

  const handleCreateCircle = () => {
    if (!newCircleName.trim() || !newCircleTagline.trim()) return;

    const chosenBook =
      mockBooks.find((b) => b.id === selectedBookId) || mockBooks[0];

    const newClub: BookClub = {
      id: `club-${Date.now()}`,
      name: newCircleName.trim(),
      tagline: newCircleTagline.trim(),
      description:
        newCircleDesc.trim() ||
        `A dedicated sanctuary for readers of ${chosenBook.title} by ${chosenBook.author}.`,
      coverUrl: chosenBook.coverUrl,
      currentBook: {
        id: chosenBook.id,
        title: chosenBook.title,
        author: chosenBook.author,
        coverUrl: chosenBook.coverUrl,
        rating: chosenBook.rating,
        genres: chosenBook.genres,
        tropes: chosenBook.tropes,
        atmosphere: chosenBook.atmosphere,
      },
      memberCount: 1,
      isJoined: true,
      isPrivate: isNewCirclePrivate,
      readingMilestone: "Starting Chapter 1 · Just Begun",
    };

    setClubs((prev) => [newClub, ...prev]);
    setIsCreateModalOpen(false);
    setActiveTab("my_circles");
    setNewCircleName("");
    setNewCircleTagline("");
    setNewCircleDesc("");
  };

  const filteredClubs = useMemo(() => {
    let list = clubs;
    if (activeTab === "my_circles") {
      list = list.filter((c) => c.isJoined);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const taglineMatch = c.tagline.toLowerCase().includes(q);
        const bookTitleMatch = c.currentBook?.title.toLowerCase().includes(q);
        const authorMatch = c.currentBook?.author.toLowerCase().includes(q);
        return nameMatch || taglineMatch || bookTitleMatch || authorMatch;
      });
    }
    return list;
  }, [clubs, activeTab, searchQuery]);

  const filteredPosts = useMemo(() => {
    let list = mockCirclePosts;
    if (selectedEmotion) {
      list = list.filter((p) => p.emotion === selectedEmotion);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const contentMatch = p.content.toLowerCase().includes(q);
        const bookMatch = p.bookTitle?.toLowerCase().includes(q);
        const authorMatch = p.author.name.toLowerCase().includes(q);
        const emotionMatch = p.emotion.toLowerCase().includes(q);
        return contentMatch || bookMatch || authorMatch || emotionMatch;
      });
    }
    return list;
  }, [selectedEmotion, searchQuery]);

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          BOOK CLUBS
        </Typography>
        <Typography
          variant="caption"
          color={colors.accent}
          style={styles.subtitle}
        >
          WHERE BOOKS LIVE ON · CIRCLES
        </Typography>
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.subtext}
        >
          Small circles of readers who feel stories the way you do.
        </Typography>

        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.bgCard,
              borderColor: isSearchFocused ? colors.accent : colors.border,
              borderWidth: 1.5,
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
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </View>

        <View style={[styles.tabsRow, { backgroundColor: colors.bgSecondary }]}>
          <Pressable
            onPress={() => setActiveTab("my_circles")}
            style={[
              styles.tabButton,
              activeTab === "my_circles" && { backgroundColor: colors.accent },
            ]}
          >
            <Typography
              variant="caption"
              color={
                activeTab === "my_circles"
                  ? colors.accentText
                  : colors.textSecondary
              }
              style={[
                styles.tabText,
                activeTab === "my_circles" && styles.activeTabText,
              ]}
            >
              MY CIRCLES ({clubs.filter((c) => c.isJoined).length})
            </Typography>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("discover")}
            style={[
              styles.tabButton,
              activeTab === "discover" && { backgroundColor: colors.accent },
            ]}
          >
            <Typography
              variant="caption"
              color={
                activeTab === "discover"
                  ? colors.accentText
                  : colors.textSecondary
              }
              style={[
                styles.tabText,
                activeTab === "discover" && styles.activeTabText,
              ]}
            >
              DISCOVER ({clubs.length})
            </Typography>
          </Pressable>

          <Pressable
            onPress={() => setIsCreateModalOpen(true)}
            style={[
              styles.tabButton,
              styles.createTabBtn,
              { borderColor: colors.accent },
            ]}
          >
            <Ionicons
              name="add"
              size={14}
              color={colors.accent}
              style={{ marginRight: 2 }}
            />
            <Typography
              variant="caption"
              color={colors.accent}
              style={[styles.tabText, styles.activeTabText]}
            >
              CREATE
            </Typography>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Typography
              variant="title"
              color={colors.textPrimary}
              style={styles.sectionTitle}
            >
              {activeTab === "my_circles"
                ? "Your Active Circles"
                : "Featured Reading Circles"}
            </Typography>
            <Typography variant="caption" color={colors.accent}>
              {filteredClubs.length}{" "}
              {filteredClubs.length === 1 ? "circle" : "circles"}
            </Typography>
          </View>

          {filteredClubs.length === 0 ? (
            <View
              style={[
                styles.emptyCirclesCard,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="planet-outline"
                size={36}
                color={colors.textMuted}
                style={{ marginBottom: Spacing["2"] }}
              />
              <Typography
                variant="subtitle"
                color={colors.textPrimary}
                align="center"
              >
                {activeTab === "my_circles"
                  ? "No circles joined yet"
                  : "No circles found"}
              </Typography>
              <Typography
                variant="caption"
                color={colors.textSecondary}
                align="center"
                style={styles.emptySubtext}
              >
                {activeTab === "my_circles"
                  ? "Join an atmospheric circle or create your own sanctuary for kindred readers."
                  : "Try adjusting your search query."}
              </Typography>
              {activeTab === "my_circles" && (
                <Pressable
                  onPress={() => setActiveTab("discover")}
                  style={[
                    styles.emptyActionBtn,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Typography
                    variant="caption"
                    color={colors.accentText}
                    style={{ fontWeight: "700" }}
                  >
                    DISCOVER CIRCLES
                  </Typography>
                </Pressable>
              )}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalClubs}
            >
              {filteredClubs.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/(stack)/club/${item.id}`)}
                  style={[
                    styles.circleCard,
                    {
                      backgroundColor: colors.bgCard,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: item.coverUrl }}
                    style={styles.circleImage}
                    contentFit="cover"
                  />
                  <View style={styles.circleBody}>
                    <View style={styles.cardBadgeRow}>
                      {item.isPrivate && (
                        <View
                          style={[
                            styles.privateBadge,
                            { backgroundColor: colors.accentMuted },
                          ]}
                        >
                          <Ionicons
                            name="lock-closed"
                            size={9}
                            color={colors.accent}
                          />
                          <Typography
                            variant="caption"
                            color={colors.accent}
                            style={styles.privateText}
                          >
                            PRIVATE
                          </Typography>
                        </View>
                      )}
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation?.();
                          handleToggleJoin(item.id);
                        }}
                        style={[
                          styles.joinPill,
                          {
                            backgroundColor: item.isJoined
                              ? colors.bgSecondary
                              : colors.accent,
                            borderColor: item.isJoined
                              ? colors.border
                              : colors.accent,
                          },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          color={
                            item.isJoined
                              ? colors.textSecondary
                              : colors.accentText
                          }
                          style={styles.joinPillText}
                        >
                          {item.isJoined ? "Joined" : "+ Join"}
                        </Typography>
                      </Pressable>
                    </View>

                    <Typography
                      variant="subtitle"
                      color={colors.textPrimary}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color={colors.accent}
                      style={styles.circleTagline}
                      numberOfLines={1}
                    >
                      {item.tagline}
                    </Typography>

                    {item.readingMilestone && (
                      <View
                        style={[
                          styles.milestoneBadge,
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
                          color={colors.textSecondary}
                          numberOfLines={1}
                          style={styles.milestoneText}
                        >
                          {item.readingMilestone}
                        </Typography>
                      </View>
                    )}

                    {item.currentBook && (
                      <View style={styles.readingNowRow}>
                        <Ionicons
                          name="book-outline"
                          size={11}
                          color={colors.textSecondary}
                        />
                        <Typography
                          variant="caption"
                          color={colors.textSecondary}
                          numberOfLines={1}
                        >
                          {item.currentBook.title}
                        </Typography>
                      </View>
                    )}

                    <Typography
                      variant="caption"
                      color={colors.textMuted}
                      style={styles.memberCount}
                    >
                      {item.memberCount} members
                    </Typography>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.emotionScroll}
          >
            <Pressable
              onPress={() => setSelectedEmotion(null)}
              style={[
                styles.emotionChip,
                {
                  backgroundColor:
                    selectedEmotion === null ? colors.accent : colors.bgCard,
                  borderColor:
                    selectedEmotion === null ? colors.accent : colors.border,
                },
              ]}
            >
              <Typography
                variant="caption"
                color={
                  selectedEmotion === null
                    ? colors.accentText
                    : colors.textPrimary
                }
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
                  onPress={() =>
                    setSelectedEmotion(isSelected ? null : emotionKey)
                  }
                  style={[
                    styles.emotionChip,
                    {
                      backgroundColor: isSelected
                        ? colors.accent
                        : colors.bgCard,
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

          <View style={styles.postsList}>
            {filteredPosts.map((post) => {
              const emotionCfg =
                EMOTION_ICONS[post.emotion] || EMOTION_ICONS.yearning;
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
                    {
                      backgroundColor: colors.bgCard,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.postTopRow}>
                    <View style={styles.authorRow}>
                      <Image
                        source={{ uri: post.author.avatarUrl }}
                        style={styles.authorAvatar}
                      />
                      <View style={{ flex: 1 }}>
                        <Typography
                          variant="subtitle"
                          color={colors.textPrimary}
                        >
                          {post.author.name}
                        </Typography>
                        {post.bookTitle && (
                          <Typography
                            variant="caption"
                            color={colors.textSecondary}
                            numberOfLines={1}
                          >
                            {post.bookTitle} · {post.chapterOrPageRef}
                          </Typography>
                        )}
                      </View>
                    </View>
                    <View
                      style={[
                        styles.emotionCapsule,
                        {
                          backgroundColor: colors.bgSecondary,
                          borderColor: emotionCfg.color,
                        },
                      ]}
                    >
                      <Ionicons
                        name={emotionCfg.icon}
                        size={12}
                        color={emotionCfg.color}
                      />
                      <Typography
                        variant="caption"
                        color={emotionCfg.color}
                        style={styles.emotionCapsuleText}
                      >
                        {post.emotion.toUpperCase()}
                      </Typography>
                    </View>
                  </View>

                  <Typography
                    variant="body"
                    color={colors.textPrimary}
                    style={styles.postBody}
                  >
                    {post.content}
                  </Typography>

                  <View
                    style={[
                      styles.postFooter,
                      { borderTopColor: colors.divider },
                    ]}
                  >
                    <Pressable
                      onPress={() => handleToggleLike(post.id)}
                      style={styles.postStatBtn}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
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
                        {commentsCount}{" "}
                        {commentsCount === 1 ? "comment" : "comments"}
                      </Typography>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isCreateModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCreateModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalDismiss}
            onPress={() => setIsCreateModalOpen(false)}
          />
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Typography
                  variant="caption"
                  color={colors.accent}
                  style={{ fontWeight: "700", letterSpacing: 1 }}
                >
                  NEW SANCTUARY
                </Typography>
                <Typography variant="subtitle" color={colors.textPrimary}>
                  Create a Reading Circle
                </Typography>
              </View>
              <Pressable
                onPress={() => setIsCreateModalOpen(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 420 }}
            >
              <View style={styles.inputGroup}>
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.inputLabel}
                >
                  Circle Name
                </Typography>
                <TextInput
                  value={newCircleName}
                  onChangeText={setNewCircleName}
                  placeholder="e.g. Starlight Scholars"
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.accent}
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.inputLabel}
                >
                  Atmosphere / Tropes Tagline
                </Typography>
                <TextInput
                  value={newCircleTagline}
                  onChangeText={setNewCircleTagline}
                  placeholder="e.g. Slow Burn · Enemies to Lovers"
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.accent}
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.inputLabel}
                >
                  Circle Description
                </Typography>
                <TextInput
                  value={newCircleDesc}
                  onChangeText={setNewCircleDesc}
                  placeholder="What stories will this circle contemplate?"
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.accent}
                  multiline
                  style={[
                    styles.modalTextArea,
                    {
                      backgroundColor: colors.bgSecondary,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={styles.inputLabel}
                >
                  Select Currently Reading Book
                </Typography>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 6 }}
                >
                  {mockBooks.map((b) => {
                    const isSelected = selectedBookId === b.id;
                    return (
                      <Pressable
                        key={b.id}
                        onPress={() => setSelectedBookId(b.id)}
                        style={[
                          styles.bookSelectChip,
                          {
                            backgroundColor: isSelected
                              ? colors.accentMuted
                              : colors.bgSecondary,
                            borderColor: isSelected
                              ? colors.accent
                              : colors.border,
                          },
                        ]}
                      >
                        <Image
                          source={{ uri: b.coverUrl }}
                          style={styles.bookSelectThumb}
                          contentFit="cover"
                        />
                        <Typography
                          variant="caption"
                          color={
                            isSelected ? colors.accent : colors.textPrimary
                          }
                          numberOfLines={1}
                          style={{
                            fontWeight: isSelected ? "700" : "500",
                            maxWidth: 100,
                          }}
                        >
                          {b.title}
                        </Typography>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              <Pressable
                onPress={() => setIsNewCirclePrivate((prev) => !prev)}
                style={[
                  styles.privacyToggleRow,
                  { borderColor: colors.border },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="body"
                    color={colors.textPrimary}
                    style={{ fontWeight: "600" }}
                  >
                    Private Circle
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {isNewCirclePrivate
                      ? "Invite-only sanctuary"
                      : "Open to all celestial readers"}
                  </Typography>
                </View>
                <Ionicons
                  name={isNewCirclePrivate ? "checkbox" : "square-outline"}
                  size={22}
                  color={
                    isNewCirclePrivate ? colors.accent : colors.textSecondary
                  }
                />
              </Pressable>
            </ScrollView>

            <Pressable
              onPress={handleCreateCircle}
              disabled={!newCircleName.trim() || !newCircleTagline.trim()}
              style={[
                styles.createSubmitBtn,
                {
                  backgroundColor:
                    newCircleName.trim() && newCircleTagline.trim()
                      ? colors.accent
                      : colors.bgSecondary,
                },
              ]}
            >
              <Typography
                variant="caption"
                color={
                  newCircleName.trim() && newCircleTagline.trim()
                    ? colors.accentText
                    : colors.textMuted
                }
                style={{ fontWeight: "700", letterSpacing: 0.5 }}
              >
                CREATE CIRCLE
              </Typography>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing["6"],
    paddingTop: Spacing["6"],
    paddingBottom: Spacing["3"],
  },
  subtitle: {
    letterSpacing: 1.5,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 4,
  },
  subtext: {
    fontSize: 13,
    marginBottom: Spacing["3"],
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing["4"],
    height: 44,
    marginBottom: Spacing["3"],
  },
  searchIcon: {
    marginRight: Spacing["2"],
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    padding: 0,
  },
  tabsRow: {
    flexDirection: "row",
    borderRadius: Radius.full,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing["2"],
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  createTabBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  tabText: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  activeTabText: {
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: Spacing["8"],
  },
  sectionWrap: {
    paddingTop: Spacing["2"],
    paddingBottom: Spacing["3"],
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing["6"],
    marginBottom: Spacing["3"],
  },
  sectionTitle: {
    letterSpacing: 0.5,
  },
  horizontalClubs: {
    paddingHorizontal: Spacing["6"],
    gap: Spacing["3"],
  },
  circleCard: {
    width: 240,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  circleImage: {
    width: "100%",
    height: 110,
  },
  circleBody: {
    padding: Spacing["3"],
  },
  cardBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  privateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: Spacing["2"],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  privateText: {
    fontSize: 9,
    fontWeight: "700",
  },
  joinPill: {
    paddingHorizontal: Spacing["2"],
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginLeft: "auto",
  },
  joinPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  circleTagline: {
    marginVertical: 2,
  },
  milestoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginTop: 4,
  },
  milestoneText: {
    fontSize: 10,
  },
  readingNowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  memberCount: {
    marginTop: 6,
  },
  emptyCirclesCard: {
    marginHorizontal: Spacing["6"],
    padding: Spacing["6"],
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: "center",
  },
  emptySubtext: {
    marginTop: 4,
    marginBottom: Spacing["4"],
    maxWidth: 260,
  },
  emptyActionBtn: {
    paddingHorizontal: Spacing["5"],
    paddingVertical: Spacing["2"],
    borderRadius: Radius.full,
  },
  feedSection: {
    paddingHorizontal: Spacing["6"],
    marginTop: Spacing["4"],
  },
  feedHeader: {
    marginBottom: Spacing["3"],
  },
  emotionScroll: {
    marginBottom: Spacing["4"],
  },
  emotionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["3"],
    paddingVertical: Spacing["1"],
    borderRadius: Radius.full,
    borderWidth: 1,
    marginRight: Spacing["2"],
  },
  emotionLabel: {
    fontWeight: "600",
  },
  postsList: {
    gap: Spacing["4"],
  },
  postCard: {
    padding: Spacing["4"],
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  postTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing["3"],
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing["3"],
    flex: 1,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
  },
  emotionCapsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing["2"],
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  emotionCapsuleText: {
    fontSize: 9,
    fontWeight: "700",
  },
  postBody: {
    lineHeight: 22,
    marginBottom: Spacing["3"],
  },
  postFooter: {
    flexDirection: "row",
    gap: Spacing["5"],
    paddingTop: Spacing["2"],
    borderTopWidth: 1,
  },
  postStatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
    ...(Platform.OS === "web" ? { cursor: "pointer" as const } : {}),
  },
  statLabel: {
    marginLeft: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["6"],
  },
  modalDismiss: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing["5"],
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing["4"],
  },
  inputGroup: {
    marginBottom: Spacing["3"],
  },
  inputLabel: {
    fontWeight: "600",
    marginBottom: 4,
  },
  modalInput: {
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing["3"],
    fontSize: 14,
  },
  modalTextArea: {
    height: 64,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing["3"],
    paddingVertical: Spacing["2"],
    fontSize: 14,
    textAlignVertical: "top",
  },
  bookSelectChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingRight: Spacing["3"],
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginRight: Spacing["2"],
  },
  bookSelectThumb: {
    width: 22,
    height: 28,
    borderRadius: 4,
  },
  privacyToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing["3"],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: Spacing["2"],
  },
  createSubmitBtn: {
    height: 44,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing["3"],
    ...(Platform.OS === "web" ? { cursor: "pointer" as const } : {}),
  },
});

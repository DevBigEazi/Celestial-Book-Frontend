import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, FlatList, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { ScreenWrapper } from '../../../src/components/layout/ScreenWrapper';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Card } from '../../../src/components/ui/Card';
import { mockClubs } from '../../../src/mock/clubs';
import { mockPosts } from '../../../src/mock/posts';
import { Spacing, Radius } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export default function BookClubDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const club = mockClubs.find((c) => c.id === id);
  const [isJoined, setIsJoined] = useState(club?.isJoined || false);
  const [posts, setPosts] = useState(mockPosts.filter(p => p.bookId === club?.currentBook?.id));
  const [postContent, setPostContent] = useState('');

  // Countdown timer for temporary clubs
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!club || !club.isTemporary || !club.endsAt) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(club.endsAt!) - +new Date();
      if (difference <= 0) {
        setTimeLeft('Club Ended');
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [club]);

  if (!club) {
    return (
      <ScreenWrapper scrollEnabled={false} style={styles.center}>
        <Typography variant="title" color={colors.error}>Club not found</Typography>
        <Button variant="primary" label="Go Back" onPress={() => router.back()} style={styles.backBtn} />
      </ScreenWrapper>
    );
  }

  const handleJoinToggle = () => {
    setIsJoined((prev) => !prev);
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      communityId: 'community-001',
      createdAt: new Date().toISOString(),
      content: postContent,
      author: {
        id: 'user-001',
        name: 'Jane Doe',
        username: 'janedoe',
        avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
        bio: 'Avid reader',
        booksRead: 10,
        following: 50,
        followers: 120,
        favoriteGenres: ['Fantasy']
      },
      likes: 0,
      isLiked: false,
      commentCount: 0,
      bookId: club.currentBook?.id || null
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostContent('');
  };

  const handleLikePress = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Typography variant="heading" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
          {club.name}
        </Typography>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Hero / Cover */}
            <View style={[styles.hero, { borderColor: colors.border }]}>
              {club.coverUrl ? (
                <Image source={{ uri: club.coverUrl }} style={styles.coverImage} contentFit="cover" transition={200} />
              ) : (
                <View style={[styles.coverPlaceholder, { backgroundColor: colors.bgSecondary }]}>
                  <Typography variant="display">👥</Typography>
                </View>
              )}
              <View style={styles.heroDetails}>
                <Typography variant="title" color={colors.textPrimary} style={styles.clubName}>
                  {club.name}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary} style={styles.members}>
                  {club.memberCount} members • {club.isTemporary ? 'Temporary' : 'Permanent'}
                </Typography>
                <Button
                  variant={isJoined ? 'outline' : 'primary'}
                  label={isJoined ? 'Leave Club' : 'Join Club'}
                  onPress={handleJoinToggle}
                  size="sm"
                  style={styles.joinBtn}
                />
              </View>
            </View>

            {/* Temporary Countdown Badge */}
            {club.isTemporary && timeLeft && (
              <View style={[styles.countdownBox, { backgroundColor: colors.bgSecondary, borderColor: colors.warning }]}>
                <Typography variant="body" color={colors.warning} style={styles.countdownText}>
                  ⏳ Temporary Club Ends In: {timeLeft}
                </Typography>
              </View>
            )}

            {/* Description */}
            <View style={styles.section}>
              <Typography variant="body" color={colors.textPrimary} style={styles.descText}>
                {club.description}
              </Typography>
            </View>

            {/* Current Book section */}
            {club.currentBook && (
              <View style={styles.section}>
                <Typography variant="subtitle" color={colors.textPrimary} style={styles.sectionTitle}>
                  Current Book Selection
                </Typography>
                <Card
                  onPress={() => router.push(`/(stack)/book/${club.currentBook!.id}`)}
                  style={styles.bookCard}
                  variant="outlined"
                >
                  {club.currentBook.coverUrl ? (
                    <Image source={{ uri: club.currentBook.coverUrl }} style={styles.bookCover} contentFit="contain" />
                  ) : (
                    <View style={[styles.bookCover, { backgroundColor: colors.bgSecondary }]}>
                      <Typography variant="title">📖</Typography>
                    </View>
                  )}
                  <View style={styles.bookDetails}>
                    <Typography variant="label" color={colors.textPrimary} style={styles.bookTitle}>
                      {club.currentBook.title}
                    </Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                      by {club.currentBook.author}
                    </Typography>
                    <Typography variant="caption" color={colors.textAccent} style={styles.bookRating}>
                      ★ {club.currentBook.rating}
                    </Typography>
                  </View>
                </Card>
              </View>
            )}

            {/* Discussion Feed Header & Form */}
            <View style={styles.discussionHeader}>
              <Typography variant="subtitle" color={colors.textPrimary} style={styles.sectionTitle}>
                Discussion Forum
              </Typography>
              
              {isJoined ? (
                <Card style={styles.postFormCard} variant="outlined">
                  <TextInput
                    placeholder="Share your thoughts with the club..."
                    placeholderTextColor={colors.textMuted}
                    value={postContent}
                    onChangeText={setPostContent}
                    style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                    multiline
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    label="Share Post"
                    onPress={handleCreatePost}
                    disabled={!postContent.trim()}
                    style={styles.postBtn}
                  />
                </Card>
              ) : (
                <Card style={styles.joinPromptCard} variant="outlined">
                  <Typography variant="caption" color={colors.textSecondary} align="center">
                    Join this club to join the conversation and post.
                  </Typography>
                </Card>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.postCard} variant="outlined">
            <View style={styles.postHeader}>
              <Avatar url={item.author.avatarUrl} name={item.author.name} size="sm" />
              <View style={styles.authorDetails}>
                <Typography variant="label" color={colors.textPrimary} style={styles.authorName}>
                  {item.author.name}
                </Typography>
                <Typography variant="caption" color={colors.textMuted}>
                  @{item.author.username}
                </Typography>
              </View>
            </View>
            <Typography variant="body" color={colors.textPrimary} style={styles.postContent}>
              {item.content}
            </Typography>
            <View style={styles.postFooter}>
              <Pressable onPress={() => handleLikePress(item.id)} style={styles.actionBtn}>
                <Ionicons
                  name={item.isLiked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={item.isLiked ? colors.error : colors.textSecondary}
                />
                <Typography variant="caption" color={colors.textSecondary} style={styles.actionText}>
                  {item.likes}
                </Typography>
              </Pressable>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyFeed}>
            <Typography variant="body" color={colors.textMuted} align="center">
              No discussions started yet. Start the conversation!
            </Typography>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
    paddingTop: Spacing['4'],
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
    marginBottom: Spacing['5'],
  },
  backIcon: {
    marginRight: Spacing['3'],
  },
  headerTitle: {
    flex: 1,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: Spacing['12'],
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing['5'],
    borderBottomWidth: 1,
    marginBottom: Spacing['5'],
  },
  coverImage: {
    width: 90,
    height: 90,
    borderRadius: Radius.md,
  },
  coverPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroDetails: {
    flex: 1,
    marginLeft: Spacing['4'],
  },
  clubName: {
    fontWeight: 'bold',
  },
  members: {
    marginTop: Spacing['1'],
    marginBottom: Spacing['3'],
  },
  joinBtn: {
    alignSelf: 'flex-start',
  },
  countdownBox: {
    padding: Spacing['3'],
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing['5'],
    alignItems: 'center',
  },
  countdownText: {
    fontWeight: 'bold',
    fontFamily: 'GeistMono_500Medium',
  },
  section: {
    marginBottom: Spacing['6'],
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Spacing['3'],
  },
  descText: {
    lineHeight: 20,
  },
  bookCard: {
    flexDirection: 'row',
    padding: Spacing['3'],
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: Radius.sm,
  },
  bookDetails: {
    marginLeft: Spacing['4'],
    justifyContent: 'center',
    flex: 1,
  },
  bookTitle: {
    fontWeight: '600',
    marginBottom: Spacing['1'],
  },
  bookRating: {
    fontWeight: 'bold',
    marginTop: Spacing['2'],
    fontFamily: 'GeistMono_500Medium',
  },
  discussionHeader: {
    marginBottom: Spacing['5'],
  },
  postFormCard: {
    padding: Spacing['3'],
    marginBottom: Spacing['2'],
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing['3'],
    fontSize: 14,
    height: 60,
    textAlignVertical: 'top',
    marginBottom: Spacing['3'],
  },
  postBtn: {
    alignSelf: 'flex-end',
  },
  joinPromptCard: {
    padding: Spacing['4'],
    alignItems: 'center',
  },
  postCard: {
    padding: Spacing['4'],
    marginBottom: Spacing['3'],
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['3'],
  },
  authorDetails: {
    marginLeft: Spacing['3'],
  },
  authorName: {
    fontWeight: '600',
  },
  postContent: {
    lineHeight: 20,
    marginBottom: Spacing['3'],
  },
  postFooter: {
    flexDirection: 'row',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: Spacing['1'],
    fontFamily: 'GeistMono_500Medium',
  },
  emptyFeed: {
    paddingVertical: Spacing['8'],
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, Modal, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { ScreenWrapper } from '../../../src/components/layout/ScreenWrapper';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Card } from '../../../src/components/ui/Card';
import { mockCommunities } from '../../../src/mock/communities';
import { mockPosts } from '../../../src/mock/posts';
import { mockBooks } from '../../../src/mock/books';
import { getPostStarters } from '../../../src/services/ai';
import { Spacing, Radius, Shadow } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export default function CommunityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const community = mockCommunities.find((c) => c.id === id);
  const [isJoined, setIsJoined] = useState(community?.isJoined || false);
  const [posts, setPosts] = useState(mockPosts.filter((p) => p.communityId === id));

  // Modal post states
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  if (!community) {
    return (
      <ScreenWrapper scrollEnabled={false} style={styles.center}>
        <Typography variant="title" color={colors.error}>Community not found</Typography>
        <Button variant="primary" label="Go Back" onPress={() => router.back()} style={styles.backBtn} />
      </ScreenWrapper>
    );
  }

  const handleJoinToggle = () => {
    setIsJoined((prev) => !prev);
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

  const handleFetchAiSuggestions = async () => {
    setAiLoading(true);
    try {
      const book = mockBooks[selectedBookIndex];
      const suggestions = await getPostStarters(book.title, community.genre);
      setAiSuggestions(suggestions);
    } catch (e) {
      console.error('Failed to load community post starters:', e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    const book = mockBooks[selectedBookIndex];
    const newPost = {
      id: `post-${Date.now()}`,
      communityId: community.id,
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
      bookId: book.id
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostContent('');
    setAiSuggestions([]);
    setModalVisible(false);
  };

  const activeBook = mockBooks[selectedBookIndex];

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Typography variant="heading" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
          {community.name}
        </Typography>
      </View>

      {/* Community Info & Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.hero}>
            {community.coverUrl ? (
              <Image source={{ uri: community.coverUrl }} style={styles.coverImage} contentFit="cover" transition={200} />
            ) : (
              <View style={[styles.coverPlaceholder, { backgroundColor: colors.bgSecondary }]}>
                <Typography variant="display">🏔️</Typography>
              </View>
            )}
            
            <Typography variant="title" color={colors.textPrimary} style={styles.communityName}>
              {community.name}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={styles.members}>
              {community.genre} • {community.memberCount} members
            </Typography>
            <Typography variant="body" color={colors.textSecondary} align="center" style={styles.description}>
              {community.description}
            </Typography>

            <Button
              variant={isJoined ? 'outline' : 'primary'}
              label={isJoined ? 'Leave Community' : 'Join Community'}
              onPress={handleJoinToggle}
              style={styles.joinBtn}
            />

            <Typography variant="subtitle" color={colors.textPrimary} style={styles.feedTitle}>
              Community Feed
            </Typography>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.postCard} variant="outlined">
            <View style={styles.postHeader}>
              <Avatar url={item.author.avatarUrl} name={item.author.name} size="sm" />
              <View style={styles.postAuthorInfo}>
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
              No posts in this community yet. Be the first to share your thoughts!
            </Typography>
          </View>
        }
      />

      {/* Floating Action Button (Only show if joined) */}
      {isJoined && (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={[styles.fab, { backgroundColor: colors.accent }]}
        >
          <Ionicons name="create-outline" size={24} color={colors.accentText} />
        </Pressable>
      )}

      {/* New Post Modal Bottom-Sheet */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgPrimary, borderTopColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Typography variant="title" color={colors.textPrimary}>
                New Post
              </Typography>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Typography variant="label" color={colors.textSecondary} style={styles.fieldLabel}>
                Discussing Book:
              </Typography>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksSelectRow}>
                {mockBooks.map((book, idx) => {
                  const isSelected = selectedBookIndex === idx;
                  return (
                    <Pressable
                      key={book.id}
                      onPress={() => {
                        setSelectedBookIndex(idx);
                        setAiSuggestions([]);
                      }}
                      style={[
                        styles.bookSelectCard,
                        {
                          backgroundColor: isSelected ? colors.bgSecondary : colors.bgPrimary,
                          borderColor: isSelected ? colors.accent : colors.border
                        }
                      ]}
                    >
                      <Typography variant="caption" color={isSelected ? colors.textAccent : colors.textPrimary} numberOfLines={1}>
                        {book.title}
                      </Typography>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.aiSuggestionHeader}>
                <Button
                  variant="outline"
                  size="sm"
                  label="💡 Ask Claude for Discussion Ideas"
                  onPress={handleFetchAiSuggestions}
                  loading={aiLoading}
                  style={styles.aiBtn}
                />
              </View>

              {aiSuggestions.length > 0 && (
                <View style={[styles.suggestionsBox, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                  <Typography variant="caption" color={colors.accent} style={styles.suggestionsTitle}>
                    DISCUSSION IDEAS (Tap to use):
                  </Typography>
                  {aiSuggestions.map((suggestion, index) => (
                    <Pressable
                      key={index}
                      onPress={() => setPostContent(suggestion)}
                      style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                    >
                      <Typography variant="body" color={colors.textPrimary} style={styles.suggestionText}>
                        • {suggestion}
                      </Typography>
                    </Pressable>
                  ))}
                </View>
              )}

              <Typography variant="label" color={colors.textSecondary} style={styles.fieldLabel}>
                Your Message:
              </Typography>
              <TextInput
                placeholder={`What are your thoughts on ${activeBook.title} in the context of ${community.name}?`}
                placeholderTextColor={colors.textMuted}
                value={postContent}
                onChangeText={setPostContent}
                multiline
                numberOfLines={4}
                style={[
                  styles.input,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bgSecondary,
                    borderColor: colors.border
                  }
                ]}
              />

              <Button
                variant="primary"
                label="Share in Community"
                onPress={handleCreatePost}
                disabled={!postContent.trim()}
                style={styles.submitBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    marginBottom: Spacing['6'],
    borderBottomWidth: 1,
    borderColor: 'transparent', // Overriden by theme divider or similar
    paddingBottom: Spacing['5'],
  },
  coverImage: {
    width: '100%',
    height: 120,
    borderRadius: Radius.md,
    marginBottom: Spacing['4'],
  },
  coverPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['4'],
  },
  communityName: {
    fontWeight: 'bold',
  },
  members: {
    marginTop: Spacing['1'],
    marginBottom: Spacing['3'],
  },
  description: {
    paddingHorizontal: Spacing['4'],
    marginBottom: Spacing['5'],
    lineHeight: 18,
  },
  joinBtn: {
    width: 160,
    marginBottom: Spacing['6'],
  },
  feedTitle: {
    alignSelf: 'flex-start',
    fontWeight: '600',
    marginBottom: Spacing['2'],
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
  postAuthorInfo: {
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
  fab: {
    position: 'absolute',
    bottom: Spacing['6'],
    right: Spacing['6'],
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.md,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopWidth: 1,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    height: '75%',
    padding: Spacing['5'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['4'],
  },
  closeBtn: {
    padding: Spacing['1'],
  },
  modalScroll: {
    paddingBottom: Spacing['10'],
  },
  fieldLabel: {
    fontWeight: '600',
    marginTop: Spacing['3'],
    marginBottom: Spacing['2'],
  },
  booksSelectRow: {
    gap: Spacing['2'],
    paddingBottom: Spacing['2'],
  },
  bookSelectCard: {
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.md,
    borderWidth: 1,
    maxWidth: 160,
  },
  aiSuggestionHeader: {
    marginVertical: Spacing['4'],
    alignItems: 'flex-start',
  },
  aiBtn: {
    alignSelf: 'stretch',
  },
  suggestionsBox: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing['3'],
    marginBottom: Spacing['4'],
  },
  suggestionsTitle: {
    fontWeight: '700',
    marginBottom: Spacing['2'],
    letterSpacing: 0.5,
  },
  suggestionItem: {
    paddingVertical: Spacing['2'],
    borderBottomWidth: 1,
  },
  suggestionText: {
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing['3'],
    fontSize: 15,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing['5'],
  },
  submitBtn: {
    marginTop: Spacing['2'],
  },
});

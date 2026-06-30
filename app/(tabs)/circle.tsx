import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Modal, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { PostCard } from '../../src/components/circle';
import { mockPosts } from '../../src/mock/posts';
import { mockBooks } from '../../src/mock/books';
import { getPostStarters } from '../../src/services/ai';
import { Spacing, Radius, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Circle() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [posts, setPosts] = useState(mockPosts);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('Fiction');
  
  // AI suggestions states
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

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
      const suggestions = await getPostStarters(book.title, selectedGenre);
      setAiSuggestions(suggestions);
    } catch (e) {
      console.error('Failed to get post starters:', e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    const book = mockBooks[selectedBookIndex];
    const newPost = {
      id: `post-${Date.now()}`,
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
      bookId: book.id,
      communityId: 'community-001',
      createdAt: new Date().toISOString()
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostContent('');
    setAiSuggestions([]);
    setModalVisible(false);
  };

  const displayedPosts = filter === 'all'
    ? posts
    : posts.filter((post) => post.author.following > 100);

  const activeBook = mockBooks[selectedBookIndex];

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          Circle
        </Typography>
        <View style={styles.filterChips}>
          <Pressable
            onPress={() => setFilter('all')}
            style={[
              styles.chip,
              { backgroundColor: filter === 'all' ? colors.accent : colors.bgSecondary },
            ]}
          >
            <Typography variant="caption" color={filter === 'all' ? colors.accentText : colors.textPrimary}>
              All
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => setFilter('following')}
            style={[
              styles.chip,
              { backgroundColor: filter === 'following' ? colors.accent : colors.bgSecondary },
            ]}
          >
            <Typography variant="caption" color={filter === 'following' ? colors.accentText : colors.textPrimary}>
              Following
            </Typography>
          </Pressable>
        </View>
      </View>

      {/* Feed List */}
      <FlatList
        data={displayedPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedList}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLikePress={() => handleLikePress(item.id)}
          />
        )}
      />

      {/* Floating Action Button */}
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.fab, { backgroundColor: colors.accent }]}
      >
        <Ionicons name="create-outline" size={24} color={colors.accentText} />
      </Pressable>

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
                Create Post
              </Typography>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Typography variant="label" color={colors.textSecondary} style={styles.fieldLabel}>
                Reference a Book:
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

              <Typography variant="label" color={colors.textSecondary} style={styles.fieldLabel}>
                Discussion Genre:
              </Typography>
              <View style={styles.genresRow}>
                {['Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance'].map((genre) => {
                  const isSelected = selectedGenre === genre;
                  return (
                    <Pressable
                      key={genre}
                      onPress={() => {
                        setSelectedGenre(genre);
                        setAiSuggestions([]);
                      }}
                    >
                      <Badge label={genre} variant={isSelected ? 'accent' : 'secondary'} />
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.aiSuggestionHeader}>
                <Button
                  variant="outline"
                  size="sm"
                  label="💡 Get AI Discussion Starters"
                  onPress={handleFetchAiSuggestions}
                  loading={aiLoading}
                  style={styles.aiBtn}
                />
              </View>

              {aiSuggestions.length > 0 && (
                <View style={[styles.suggestionsBox, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                  <Typography variant="caption" color={colors.accent} style={styles.suggestionsTitle}>
                    CLAUDE SUGGESTIONS (Tap to use):
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
                Your Thoughts:
              </Typography>
              <TextInput
                placeholder={`Share your thoughts on ${activeBook.title}...`}
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
                label="Post to Circle"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['4'],
  },
  filterChips: {
    flexDirection: 'row',
    gap: Spacing['2'],
  },
  chip: {
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
  },
  feedList: {
    paddingBottom: Spacing['12'],
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopWidth: 1,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    height: '80%',
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
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
    marginBottom: Spacing['2'],
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

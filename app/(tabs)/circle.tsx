import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Typography } from '../../src/components/ui/Typography';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Button } from '../../src/components/ui/Button';
import { mockPosts } from '../../src/mock/posts';
import { Spacing, Radius, Shadow } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Circle() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [posts, setPosts] = useState(mockPosts);

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

  const handleNewPostPress = () => {
    Alert.alert('New Post', 'Mock post creation bottom sheet. (Not persisting)');
  };

  const displayedPosts = filter === 'all'
    ? posts
    : posts.filter((post) => post.author.following > 100); // Mock criteria for "following" users

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
          <View style={[styles.postCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={styles.postHeader}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.bgSecondary }]}>
                <Typography variant="label" color={colors.textPrimary}>
                  👤
                </Typography>
              </View>
              <View style={styles.headerText}>
                <Typography variant="label" color={colors.textPrimary}>
                  {item.author.name}
                </Typography>
                <Typography variant="caption" color={colors.textMuted}>
                  @{item.author.username}
                </Typography>
              </View>
            </View>

            <Typography variant="body" color={colors.textPrimary} style={styles.content}>
              {item.content}
            </Typography>

            {item.bookId && (
              <View style={[styles.bookRef, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                <Typography variant="caption" color={colors.textAccent}>
                  📖 Referencing Book: {item.bookId}
                </Typography>
              </View>
            )}

            <View style={styles.postFooter}>
              <Pressable onPress={() => handleLikePress(item.id)} style={styles.actionBtn}>
                <Ionicons
                  name={item.isLiked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={item.isLiked ? colors.error : colors.textSecondary}
                />
                <Typography variant="caption" color={colors.textSecondary} style={styles.actionText}>
                  {item.likes}
                </Typography>
              </Pressable>
              <View style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
                <Typography variant="caption" color={colors.textSecondary} style={styles.actionText}>
                  {item.commentCount}
                </Typography>
              </View>
            </View>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <Pressable
        onPress={handleNewPostPress}
        style={[styles.fab, { backgroundColor: colors.accent }]}
      >
        <Ionicons name="create-outline" size={24} color={colors.accentText} />
      </Pressable>
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
  postCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing['4'],
    marginBottom: Spacing['4'],
    ...Shadow.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['3'],
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing['3'],
  },
  headerText: {
    justifyContent: 'center',
  },
  content: {
    marginBottom: Spacing['3'],
  },
  bookRef: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    padding: Spacing['2'],
    marginBottom: Spacing['3'],
  },
  postFooter: {
    flexDirection: 'row',
    gap: Spacing['6'],
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: Spacing['1'],
    fontFamily: 'GeistMono_500Medium',
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
});

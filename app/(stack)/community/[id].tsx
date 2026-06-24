import React, { useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { ScreenWrapper } from '../../../src/components/layout/ScreenWrapper';
import { mockCommunities } from '../../../src/mock/communities';
import { mockPosts } from '../../../src/mock/posts';
import { Spacing, Radius, Shadow } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const community = mockCommunities.find((c) => c.id === id);
  const [isJoined, setIsJoined] = useState(community?.isJoined || false);
  const [posts, setPosts] = useState(mockPosts.filter((p) => p.communityId === id));

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

  const handleNewPostPress = () => {
    Alert.alert('New Post', 'Mock post creation bottom sheet for this community.');
  };

  return (
    <ScreenWrapper scrollEnabled={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Typography variant="heading" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
          {community.name}
        </Typography>
      </View>

      {/* Community Info (Header of Feed) */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.hero}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.bgSecondary }]}>
              <Typography variant="display">🏔️</Typography>
            </View>
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

            <Typography variant="title" color={colors.textPrimary} style={styles.feedTitle}>
              Community Feed
            </Typography>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.postCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={styles.postHeader}>
              <View style={[styles.postAvatar, { backgroundColor: colors.bgSecondary }]}>
                <Typography variant="label">👤</Typography>
              </View>
              <View style={styles.postAuthorInfo}>
                <Typography variant="label" color={colors.textPrimary}>
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
                  size={20}
                  color={item.isLiked ? colors.error : colors.textSecondary}
                />
                <Typography variant="caption" color={colors.textSecondary} style={styles.actionText}>
                  {item.likes}
                </Typography>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyFeed}>
            <Typography variant="body" color={colors.textMuted} align="center">
              No posts in this community yet. Be the first to post!
            </Typography>
          </View>
        }
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
    paddingVertical: Spacing['4'],
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
    marginBottom: Spacing['6'],
  },
  headerTitle: {
    marginLeft: Spacing['4'],
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing['4'],
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
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
    marginBottom: Spacing['4'],
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
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing['3'],
  },
  postAuthorInfo: {
    justifyContent: 'center',
  },
  postContent: {
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
    paddingVertical: Spacing['10'],
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

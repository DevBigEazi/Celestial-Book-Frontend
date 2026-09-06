import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../ui/Avatar';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { useCommentSheet } from '../../context/CommentSheetContext';
import { Post, Comment, Book } from '../../types';
import { mockBooks } from '../../mock/books';
import { mockComments } from '../../mock/comments';
import { Spacing, Radius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export interface PostCardProps {
  post: Post;
  referencedBook?: Book;
  onLikePress?: () => void;
  showCommentsButton?: boolean;
}

export function PostCard({
  post,
  referencedBook,
  onLikePress,
  showCommentsButton = true,
}: PostCardProps) {
  const { colors } = useTheme();
  const { openComments } = useCommentSheet();

  // Find referenced book locally if not provided
  const book = referencedBook || mockBooks.find((b) => b.id === post.bookId);

  // Comments state local to the card for immediate interactive feedback
  const [localComments, setLocalComments] = useState<Comment[]>(() =>
    mockComments.filter((c) => c.postId === post.id)
  );

  const totalCommentCount = Math.max(post.commentCount, localComments.length);

  return (
    <Card style={styles.postCard} variant="outlined">
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Avatar url={post.author.avatarUrl} name={post.author.name} size="sm" />
        <View style={styles.headerText}>
          <Typography variant="label" color={colors.textPrimary} style={styles.authorName}>
            {post.author.name}
          </Typography>
          <Typography variant="caption" color={colors.textMuted} style={styles.username}>
            @{post.author.username}
          </Typography>
        </View>
      </View>

      {/* Post Content */}
      <Typography variant="body" color={colors.textPrimary} style={styles.content}>
        {post.content}
      </Typography>

      {/* Referenced Book (if any) */}
      {book && (
        <View style={[styles.bookRef, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
          <Typography variant="caption" color={colors.textAccent} style={styles.bookRefText}>
            📖 Referencing Book: {book.title} by {book.author}
          </Typography>
        </View>
      )}

      {/* Actions (Like & Comment) */}
      <View style={styles.postFooter}>
        <Pressable onPress={onLikePress} style={styles.actionBtn}>
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={post.isLiked ? colors.error : colors.textSecondary}
          />
          <Typography variant="caption" color={colors.textSecondary} style={styles.actionText}>
            {post.likes}
          </Typography>
        </Pressable>

        {showCommentsButton && (
          <Pressable
            onPress={() =>
              openComments(post.id, localComments, (newComment) => {
                setLocalComments((prev) => [newComment, ...prev]);
              })
            }
            style={styles.actionBtn}
          >
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Typography variant="caption" color={colors.textSecondary} style={styles.actionText}>
              {totalCommentCount}
            </Typography>
          </Pressable>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  postCard: {
    padding: Spacing['4'],
    marginBottom: Spacing['4'],
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['3'],
  },
  headerText: {
    justifyContent: 'center',
    marginLeft: Spacing['3'],
  },
  authorName: {
    fontWeight: '600',
  },
  username: {
    fontFamily: 'GeistMono_400Regular',
  },
  content: {
    marginBottom: Spacing['3'],
    lineHeight: 20,
  },
  bookRef: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    padding: Spacing['2'],
    marginBottom: Spacing['3'],
  },
  bookRefText: {
    fontWeight: '500',
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
});

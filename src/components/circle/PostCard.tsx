import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../ui/Avatar';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CommentItem } from './CommentItem';
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
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Find referenced book locally if not provided
  const book = referencedBook || mockBooks.find((b) => b.id === post.bookId);

  // Comments state local to the card for immediate interactive feedback
  const [localComments, setLocalComments] = useState<Comment[]>(() => 
    mockComments.filter((c) => c.postId === post.id)
  );
  
  // Local liked comments tracking
  const [likedCommentIds, setLikedCommentIds] = useState<Record<string, boolean>>({});

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
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
      content: newCommentText.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    setLocalComments((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  const handleLikeComment = (commentId: string) => {
    setLikedCommentIds((prev) => {
      const isLiked = !prev[commentId];
      
      // Update local comments list counts
      setLocalComments((currentComments) =>
        currentComments.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              likes: isLiked ? c.likes + 1 : c.likes - 1,
            };
          }
          return c;
        })
      );
      
      return {
        ...prev,
        [commentId]: isLiked,
      };
    });
  };

  const totalCommentCount = post.commentCount > localComments.length ? post.commentCount : localComments.length;

  return (
    <Card style={styles.postCard} variant="outlined">
      {/* Post Author Header */}
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
          <Pressable onPress={() => setCommentsExpanded(!commentsExpanded)} style={styles.actionBtn}>
            <Ionicons
              name={commentsExpanded ? 'chatbubble' : 'chatbubble-outline'}
              size={18}
              color={commentsExpanded ? colors.accent : colors.textSecondary}
            />
            <Typography variant="caption" color={colors.textSecondary} style={styles.actionText}>
              {totalCommentCount}
            </Typography>
          </Pressable>
        )}
      </View>

      {/* Expandable Inline Comments Section */}
      {commentsExpanded && showCommentsButton && (
        <View style={[styles.commentsSection, { borderTopColor: colors.divider }]}>
          {/* Add Comment Form */}
          <View style={styles.addCommentContainer}>
            <TextInput
              placeholder="Write a comment..."
              placeholderTextColor={colors.textMuted}
              value={newCommentText}
              onChangeText={setNewCommentText}
              style={[
                styles.commentInput,
                {
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  backgroundColor: colors.bgSecondary,
                },
              ]}
              multiline
            />
            <Button
              variant="primary"
              size="sm"
              label="Send"
              onPress={handleAddComment}
              disabled={!newCommentText.trim()}
              style={styles.sendButton}
            />
          </View>

          {/* List of Comments */}
          {localComments.length > 0 ? (
            <View style={styles.commentsList}>
              {localComments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onLikePress={() => handleLikeComment(c.id)}
                  isLiked={!!likedCommentIds[c.id]}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyComments}>
              <Typography variant="caption" color={colors.textMuted}>
                No comments yet. Be the first to share your thoughts!
              </Typography>
            </View>
          )}
        </View>
      )}
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
  commentsSection: {
    marginTop: Spacing['4'],
    borderTopWidth: 1,
    paddingTop: Spacing['3'],
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    marginBottom: Spacing['2'],
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    height: '100%',
    justifyContent: 'center',
  },
  commentsList: {
    marginTop: Spacing['2'],
  },
  emptyComments: {
    paddingVertical: Spacing['4'],
    alignItems: 'center',
  },
});

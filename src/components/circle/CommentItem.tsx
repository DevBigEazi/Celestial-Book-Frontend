import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../ui/Avatar';
import { Typography } from '../ui/Typography';
import { Comment } from '../../types';
import { Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export interface CommentItemProps {
  comment: Comment;
  onLikePress?: () => void;
  isLiked?: boolean;
}

export function CommentItem({ comment, onLikePress, isLiked = false }: CommentItemProps) {
  const { colors } = useTheme();

  // Simple date formatter (e.g. "Jun 25")
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: colors.divider }]}>
      <Avatar url={comment.author.avatarUrl} name={comment.author.name} size="sm" />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            <Typography variant="label" color={colors.textPrimary} style={styles.authorName}>
              {comment.author.name}
            </Typography>
            <Typography variant="caption" color={colors.textMuted} style={styles.username}>
              @{comment.author.username}
            </Typography>
          </View>
          <Typography variant="caption" color={colors.textMuted}>
            {formatDate(comment.createdAt)}
          </Typography>
        </View>

        <Typography variant="body" color={colors.textPrimary} style={styles.content}>
          {comment.content}
        </Typography>

        <View style={styles.footer}>
          <Pressable onPress={onLikePress} style={styles.likeButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={14}
              color={isLiked ? colors.error : colors.textSecondary}
            />
            <Typography variant="caption" color={colors.textSecondary} style={styles.likeText}>
              {comment.likes}
            </Typography>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: Spacing['3'],
    borderBottomWidth: 1,
  },
  contentContainer: {
    flex: 1,
    marginLeft: Spacing['3'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['1'],
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  authorName: {
    fontWeight: '600',
    marginRight: Spacing['2'],
  },
  username: {
    fontFamily: 'GeistMono_400Regular',
  },
  content: {
    lineHeight: 18,
    marginBottom: Spacing['2'],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: Spacing['1'],
    fontFamily: 'GeistMono_500Medium',
  },
});

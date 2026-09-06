import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useResponsive } from '../../hooks/useResponsive';
import { Typography } from '../ui/Typography';
import { Avatar } from '../ui/Avatar';
import { CommentItem } from './CommentItem';
import { Comment } from '../../types';
import { Spacing, Radius, Shadow } from '../../constants/theme';

export interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onLikeComment?: (commentId: string) => void;
  likedCommentIds?: Record<string, boolean>;
}

export function CommentModal({
  visible,
  onClose,
  comments,
  onAddComment,
  onLikeComment,
  likedCommentIds = {},
}: CommentModalProps) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { isDesktop } = useResponsive();
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const sendingRef = useRef(false);

  // Smooth Reanimated keyboard tracking on mobile
  const animatedSheetStyle = useAnimatedStyle(() => {
    if (isDesktop) {
      return {};
    }
    return {
      transform: [{ translateY: -keyboard.height.value }],
    };
  });

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || sendingRef.current) return;
    sendingRef.current = true;
    onAddComment(trimmed);
    setInputText('');
    setTimeout(() => {
      sendingRef.current = false;
    }, 200);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const userName = user?.name || 'Reader';
  const userAvatar = user?.avatarUrl;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isDesktop ? 'fade' : 'slide'}
      onRequestClose={handleClose}
    >
      <View
        style={[
          styles.modalRoot,
          isDesktop ? styles.desktopModalRoot : styles.mobileModalRoot,
        ]}
      >
        {/* Dimmed Backdrop */}
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
          accessibilityLabel="Close comments modal"
        />

        {/* Animated Sheet Container */}
        <Animated.View
          style={[
            styles.sheetBase,
            isDesktop ? styles.desktopSheet : styles.mobileSheet,
            {
              backgroundColor: colors.bgCard,
              borderColor: colors.border,
            },
            animatedSheetStyle,
          ]}
        >
          {/* Drag Handle Indicator (Mobile only) */}
          {!isDesktop && (
            <View style={[styles.handleBar, { backgroundColor: colors.divider }]} />
          )}

          {/* Modal Header */}
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <View style={styles.headerLeftSpacer} />
            <Typography variant="subtitle" color={colors.textPrimary} style={styles.headerTitle}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </Typography>
            <Pressable onPress={handleClose} hitSlop={12} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Comments List: hugs content when few, scrolls when many */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            renderItem={({ item }) => (
              <CommentItem
                comment={item}
                onLikePress={() => onLikeComment?.(item.id)}
                isLiked={!!likedCommentIds[item.id]}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={36}
                  color={colors.textMuted}
                  style={styles.emptyIcon}
                />
                <Typography variant="subtitle" color={colors.textPrimary} align="center">
                  No comments yet
                </Typography>
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  align="center"
                  style={styles.emptySubtext}
                >
                  Be the first to share your celestial thoughts!
                </Typography>
              </View>
            }
          />

          {/* Sticky TikTok-Style Comment Input Bar */}
          <View
            style={[
              styles.inputBar,
              {
                backgroundColor: colors.bgCard,
                borderTopColor: colors.border,
                paddingBottom: isDesktop
                  ? Spacing['4']
                  : Math.max(insets.bottom, Spacing['3']),
              },
            ]}
          >
            {/* User Avatar */}
            <Avatar url={userAvatar} name={userName} size="sm" />

            {/* Rounded Input Pill */}
            <Pressable
              onPress={() => inputRef.current?.focus()}
              style={[
                styles.inputPill,
                {
                  backgroundColor: isFocused ? colors.bgPrimary : colors.bgSecondary,
                  borderColor: isFocused ? colors.accent : colors.border,
                  boxShadow: isFocused ? `0 0 0 3px ${colors.accent}33` : undefined,
                  ...(Platform.OS === 'web'
                    ? ({
                        outlineStyle: 'none',
                        outlineWidth: 0,
                        transition:
                          'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                        cursor: 'text',
                      } as any)
                    : {}),
                },
              ]}
            >
              <TextInput
                ref={inputRef}
                placeholder="Add comment..."
                placeholderTextColor={colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={colors.accent}
                cursorColor={colors.accent}
                style={[
                  styles.textInput,
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
                multiline={false}
                returnKeyType="send"
                blurOnSubmit={false}
                onSubmitEditing={handleSend}
              />
            </Pressable>

            {/* Circular Send Action Button */}
            <Pressable
              onPress={handleSend}
              onPressIn={handleSend}
              disabled={!inputText.trim()}
              hitSlop={8}
              style={[
                styles.sendBtn,
                {
                  backgroundColor: inputText.trim() ? colors.accent : colors.bgSecondary,
                  borderColor: inputText.trim() ? colors.accent : colors.border,
                },
              ]}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={inputText.trim() ? colors.accentText : colors.textMuted}
              />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  desktopModalRoot: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['6'],
  },
  mobileModalRoot: {
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheetBase: {
    width: '100%',
    overflow: 'hidden',
  },
  desktopSheet: {
    width: '100%',
    maxWidth: 500,
    maxHeight: 580,
    borderRadius: Radius.xl,
    borderWidth: 1,
    ...Shadow.lg,
  },
  mobileSheet: {
    maxHeight: '75%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginTop: Spacing['2'],
    marginBottom: Spacing['1'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['5'],
    paddingVertical: Spacing['4'],
    borderBottomWidth: 1,
  },
  headerLeftSpacer: {
    width: 24,
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  flatList: {
    flexGrow: 0,
    flexShrink: 1,
  },
  listContent: {
    paddingHorizontal: Spacing['5'],
    paddingTop: Spacing['2'],
    paddingBottom: Spacing['3'],
  },
  emptyState: {
    paddingVertical: Spacing['6'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    marginBottom: Spacing['2'],
  },
  emptySubtext: {
    marginTop: Spacing['1'],
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    paddingHorizontal: Spacing['5'],
    paddingTop: Spacing['3'],
    borderTopWidth: 1,
  },
  inputPill: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1.5,
    paddingHorizontal: Spacing['4'],
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontFamily: 'GeistSans_400Regular',
    padding: 0,
    outlineWidth: 0,
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          boxShadow: 'none',
        } as any)
      : {}),
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
});

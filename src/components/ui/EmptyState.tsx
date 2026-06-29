import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';
import { Button } from './Button';
import { Spacing } from '../../constants/theme';

export interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.bgSecondary }]}>
        <Feather name={icon as any} size={32} color={colors.accent} />
      </View>
      
      <Typography variant="title" color={colors.textPrimary} align="center" style={styles.title}>
        {title}
      </Typography>
      
      <Typography variant="body" color={colors.textSecondary} align="center" style={styles.message}>
        {message}
      </Typography>

      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="outline"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing['6'],
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['4'],
  },
  title: {
    marginBottom: Spacing['2'],
  },
  message: {
    marginBottom: Spacing['6'],
    maxWidth: 280,
  },
  button: {
    minWidth: 150,
  },
});

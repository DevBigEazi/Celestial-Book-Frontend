import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';
import { Radius, Spacing } from '../../constants/theme';

export type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'success' | 'warning' | 'error';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'primary', style }: BadgeProps) {
  const { colors } = useTheme();

  let backgroundColor = colors.border;
  let textColor = colors.textPrimary;
  let borderColor = 'transparent';
  let borderWidth = 0;

  switch (variant) {
    case 'primary':
      backgroundColor = colors.bgPrimary;
      textColor = colors.textPrimary;
      break;
    case 'secondary':
      backgroundColor = colors.bgSecondary;
      textColor = colors.textSecondary;
      break;
    case 'accent':
      backgroundColor = colors.accent;
      textColor = colors.accentText;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = colors.accent;
      borderColor = colors.accent;
      borderWidth = 1;
      break;
    case 'success':
      backgroundColor = '#10B981';
      textColor = '#FFFFFF';
      break;
    case 'warning':
      backgroundColor = '#F59E0B';
      textColor = '#FFFFFF';
      break;
    case 'error':
      backgroundColor = colors.error;
      textColor = '#FFFFFF';
      break;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderColor,
          borderWidth,
        },
        style,
      ]}
    >
      <Typography
        variant="caption"
        color={textColor}
        style={styles.text}
      >
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing['2'],
    paddingVertical: Spacing['1'],
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

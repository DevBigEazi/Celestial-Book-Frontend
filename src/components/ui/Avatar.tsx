import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';

export interface AvatarProps {
  url?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export function Avatar({ url, name, size = 'md', style }: AvatarProps) {
  const { colors } = useTheme();

  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  }[size];

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const containerStyle = [
    styles.avatar,
    {
      width: dimensions,
      height: dimensions,
      borderRadius: dimensions / 2,
      backgroundColor: colors.bgSecondary,
      borderColor: colors.border,
      borderWidth: 1,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={{ width: dimensions, height: dimensions, borderRadius: dimensions / 2 }}
          transition={200}
        />
      ) : (
        <Typography
          variant={size === 'sm' ? 'caption' : size === 'md' ? 'label' : 'title'}
          color={colors.textSecondary}
          style={styles.initials}
        >
          {initials}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '600',
  },
});

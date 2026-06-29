import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Radius, Shadow } from '../../constants/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({
  children,
  style,
  onPress,
  variant = 'default',
}: CardProps) {
  const { colors } = useTheme();

  const cardStyle = [
    styles.card,
    { backgroundColor: colors.bgSecondary },
    variant === 'outlined' && { borderWidth: 1, borderColor: colors.border },
    variant === 'elevated' && {
      ...Shadow.md,
      shadowColor: colors.textPrimary,
      elevation: 4,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    padding: 16,
    overflow: 'hidden',
  },
});

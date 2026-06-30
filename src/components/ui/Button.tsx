import React from 'react';
import { Pressable, ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';
import { Spacing, Radius } from '../../constants/theme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useReducedMotion } from 'react-native-reanimated';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const reducedMotion = useReducedMotion();

  // Explicitly type variables as string/number to allow reassignment
  let backgroundColor: string = 'transparent';
  let borderColor: string = 'transparent';
  let labelColor: string = colors.textPrimary;

  switch (variant) {
    case 'primary':
      backgroundColor = colors.accent;
      labelColor = colors.accentText;
      break;
    case 'secondary':
      backgroundColor = colors.accentDark;
      labelColor = '#ffffff'; // White label as per specification
      break;
    case 'outline':
      borderColor = colors.accent;
      labelColor = colors.accent;
      break;
    case 'ghost':
      labelColor = colors.textAccent;
      break;
    case 'danger':
      backgroundColor = colors.error;
      labelColor = '#ffffff';
      break;
  }

  // Adjust style for disabled state
  const isInteractionDisabled = disabled || loading;
  const opacity = isInteractionDisabled ? 0.6 : 1;

  // Explicitly type variables as number to allow sizing reassignment
  let paddingVertical: number = Spacing['3'];
  let paddingHorizontal: number = Spacing['5'];
  let typographyVariant: 'label' | 'body' = 'body';

  switch (size) {
    case 'sm':
      paddingVertical = Spacing['2'];
      paddingHorizontal = Spacing['3'];
      typographyVariant = 'label';
      break;
    case 'md':
      paddingVertical = Spacing['3'];
      paddingHorizontal = Spacing['5'];
      typographyVariant = 'body';
      break;
    case 'lg':
      paddingVertical = Spacing['4'];
      paddingHorizontal = Spacing['6'];
      typographyVariant = 'body';
      break;
  }

  const handlePressIn = () => {
    if (!isInteractionDisabled) {
      scale.value = withSpring(0.96, { damping: 10, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) return {};
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        { width: fullWidth ? '100%' : 'auto' },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isInteractionDisabled}
        style={({ pressed }) => [
          styles.base,
          {
            backgroundColor,
            borderColor,
            borderWidth: borderColor !== 'transparent' ? 1 : 0,
            paddingVertical,
            paddingHorizontal,
            width: '100%',
            opacity: pressed ? 0.8 : opacity,
          },
        ]}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="small" color={labelColor} />
          ) : (
            <>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Typography variant={typographyVariant} color={labelColor} style={styles.label}>
                {label}
              </Typography>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing['2'],
  },
  label: {
    fontWeight: '600',
  },
});

import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FontFamily, FontSize, LineHeight } from '../../constants/theme';

export type TypographyVariant =
  | 'display'     // 3xl, displayBold
  | 'heading'     // 2xl, displayBold
  | 'title'       // xl, displaySemiBold
  | 'subtitle'    // lg, bodyMedium
  | 'body'        // base, bodyRegular
  | 'label'       // sm, bodyMedium
  | 'caption'     // xs, bodyRegular
  | 'mono';       // sm, monoRegular

export interface TypographyProps {
  variant: TypographyVariant;
  color?: string; // defaults to colors.textPrimary
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  children: React.ReactNode;
  style?: TextStyle;
}

export function Typography({
  variant,
  color,
  align = 'left',
  numberOfLines,
  children,
  style,
}: TypographyProps) {
  const { colors } = useTheme();

  const textColor = color || colors.textPrimary;

  const variantStyles = styles[variant];

  return (
    <Text
      style={[
        { color: textColor, textAlign: align },
        variantStyles,
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['3xl'],
    lineHeight: Math.round(FontSize['3xl'] * LineHeight.tight),
  },
  heading: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    lineHeight: Math.round(FontSize['2xl'] * LineHeight.tight),
  },
  title: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.xl,
    lineHeight: Math.round(FontSize.xl * LineHeight.snug),
  },
  subtitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.lg,
    lineHeight: Math.round(FontSize.lg * LineHeight.snug),
  },
  body: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.base,
    lineHeight: Math.round(FontSize.base * LineHeight.normal),
  },
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    lineHeight: Math.round(FontSize.sm * LineHeight.normal),
  },
  caption: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    lineHeight: Math.round(FontSize.xs * LineHeight.normal),
  },
  mono: {
    fontFamily: FontFamily.monoRegular,
    fontSize: FontSize.sm,
    lineHeight: Math.round(FontSize.sm * LineHeight.normal),
  },
});

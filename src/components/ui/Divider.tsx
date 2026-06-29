import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from '../../constants/theme';

export interface DividerProps {
  marginVertical?: number;
  style?: ViewStyle;
}

export function Divider({ marginVertical = Spacing['4'], style }: DividerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.border,
          marginVertical,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth || 1,
    width: '100%',
  },
});

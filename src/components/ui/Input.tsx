import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Typography } from './Typography';
import { Spacing, Radius } from '../../constants/theme';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  containerStyle,
  style,
  onBlur,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.accent
    : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      <Typography variant="label" color={colors.textSecondary} style={styles.label}>
        {label}
      </Typography>
      <TextInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            backgroundColor: colors.bgPrimary,
            borderColor,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <Typography variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing['2'],
    width: '100%',
  },
  label: {
    marginBottom: Spacing['1'],
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing['4'],
    fontSize: 15,
  },
  errorText: {
    marginTop: Spacing['1'],
  },
});

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from './Typography';
import { Spacing, Radius } from '../../constants/theme';

interface DualPoleSliderProps {
  leftLabel: string;
  rightLabel: string;
  value: number; // -2, -1, 0, 1, 2
  onChange: (value: number) => void;
}

const STEPS = [-2, -1, 0, 1, 2];

export function DualPoleSlider({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: DualPoleSliderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.labelsRow}>
        <Typography
          variant="caption"
          color={value < 0 ? colors.accent : colors.textSecondary}
          style={[styles.label, value < 0 && styles.activeLabel]}
        >
          {leftLabel}
        </Typography>
        <Typography
          variant="caption"
          color={value > 0 ? colors.accent : colors.textSecondary}
          style={[styles.label, value > 0 && styles.activeLabel]}
        >
          {rightLabel}
        </Typography>
      </View>

      {/* Interactive Step Track */}
      <View style={[styles.track, { backgroundColor: colors.bgSecondary }]}>
        {STEPS.map((step) => {
          const isSelected = value === step;
          return (
            <Pressable
              key={step}
              onPress={() => onChange(step)}
              hitSlop={12}
              style={[
                styles.stepPoint,
                isSelected && {
                  backgroundColor: colors.accent,
                  borderColor: colors.bgPrimary,
                  transform: [{ scale: 1.35 }],
                },
                !isSelected && {
                  backgroundColor: colors.border,
                },
              ]}
            >
              {isSelected && <View style={[styles.innerGlow, { backgroundColor: colors.accentText }]} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing['3'],
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing['2'],
    paddingHorizontal: Spacing['1'],
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  activeLabel: {
    fontWeight: '700',
  },
  track: {
    height: 38,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['4'],
  },
  stepPoint: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGlow: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
  },
});

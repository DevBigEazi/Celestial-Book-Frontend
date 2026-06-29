import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';

export default function Index() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


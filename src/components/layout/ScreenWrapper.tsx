import React from 'react';
import { StyleSheet, ScrollView, View, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  style?: ViewStyle;
  edges?: Edge[];
}

export function ScreenWrapper({
  children,
  scrollEnabled = true,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
}: ScreenWrapperProps) {
  const { colors } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.bgPrimary },
    style,
  ];

  if (scrollEnabled) {
    return (
      <SafeAreaView edges={edges} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={containerStyle}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, containerStyle]}>
      <View style={styles.flexContent}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  flexContent: {
    flex: 1,
  },
});

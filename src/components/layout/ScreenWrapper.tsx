import React from 'react';
import { StyleSheet, ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useSegments } from 'expo-router';
import { Radius, Shadow, Spacing } from '../../constants/theme';

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
  const { isDesktop } = useResponsive();
  const segments = useSegments();

  const isInTabs = segments[0] === '(tabs)';

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.bgPrimary },
    style,
  ];

  const content = scrollEnabled ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={containerStyle}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flexContent, containerStyle]}>{children}</View>
  );

  if (isDesktop) {
    return (
      <View
        style={[
          styles.desktopOuter,
          {
            backgroundColor: colors.bgPrimary,
            paddingLeft: isInTabs ? 240 : 0,
          },
        ]}
      >
        <View
          style={[
            styles.desktopFrame,
            {
              backgroundColor: colors.bgPrimary,
              borderColor: colors.border,
              ...Shadow.lg,
              shadowColor: colors.textPrimary,
            },
          ]}
        >
          <SafeAreaView edges={edges} style={styles.safeArea}>
            {content}
          </SafeAreaView>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor: colors.bgPrimary }]}>
      {content}
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
  desktopOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4'],
    width: '100%',
  },
  desktopFrame: {
    width: 480,
    height: '95%',
    borderRadius: Radius.xl,
    borderWidth: 8,
    overflow: 'hidden',
  },
});

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import { Typography } from '../../src/components/ui/Typography';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  colors: any;
  isDesktop: boolean;
}

function CustomTabBar({ state, descriptors, navigation, colors, isDesktop }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();

  if (!isDesktop) {
    return (
      <View
        style={[
          styles.bottomTabBar,
          {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            height: 60 + insets.bottom,
            paddingBottom: 8 + insets.bottom,
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? colors.tabActive : colors.tabInactive;
          let iconName: keyof typeof Ionicons.glyphMap = 'compass-outline';
          if (route.name === 'discover') iconName = isFocused ? 'compass' : 'compass-outline';
          else if (route.name === 'search') iconName = isFocused ? 'search' : 'search-outline';
          else if (route.name === 'circle') iconName = isFocused ? 'people' : 'people-outline';
          else if (route.name === 'library') iconName = isFocused ? 'library' : 'library-outline';
          else if (route.name === 'profile') iconName = isFocused ? 'person-circle' : 'person-circle-outline';

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.bottomTabButton}>
              <Ionicons name={iconName} size={22} color={color} />
              <Typography variant="caption" color={color} style={styles.bottomTabLabel}>
                {label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.sidebar, { backgroundColor: colors.tabBar, borderRightColor: colors.border }]}>
      <View style={styles.sidebarHeader}>
        <Ionicons name="book" size={32} color={colors.accent} />
        <Typography variant="title" color={colors.textPrimary} style={styles.sidebarTitle}>
          Celestial
        </Typography>
      </View>

      <View style={styles.sidebarMenu}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? colors.tabActive : colors.tabInactive;
          const bgStyle = isFocused ? { backgroundColor: colors.bgSecondary } : {};

          let iconName: keyof typeof Ionicons.glyphMap = 'compass-outline';
          if (route.name === 'discover') iconName = isFocused ? 'compass' : 'compass-outline';
          else if (route.name === 'search') iconName = isFocused ? 'search' : 'search-outline';
          else if (route.name === 'circle') iconName = isFocused ? 'people' : 'people-outline';
          else if (route.name === 'library') iconName = isFocused ? 'library' : 'library-outline';
          else if (route.name === 'profile') iconName = isFocused ? 'person-circle' : 'person-circle-outline';

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.sidebarButton, bgStyle]}
            >
              <Ionicons name={iconName} size={22} color={color} style={styles.sidebarIcon} />
              <Typography variant="body" color={color} style={styles.sidebarLabel}>
                {label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const { isDesktop } = useResponsive();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} colors={colors} isDesktop={isDesktop} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="circle" options={{ title: 'Circle' }} />
      <Tabs.Screen name="library" options={{ title: 'Library' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  bottomTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 240,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  sidebarTitle: {
    marginLeft: 12,
    fontWeight: 'bold',
  },
  sidebarMenu: {
    flex: 1,
    gap: 8,
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sidebarIcon: {
    marginRight: 12,
  },
  sidebarLabel: {
    fontWeight: '600',
  },
});

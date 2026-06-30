import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import { Typography } from '../../src/components/ui/Typography';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useReducedMotion } from 'react-native-reanimated';
import { Image } from 'expo-image';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  colors: any;
  isDesktop: boolean;
}

function CustomTabBar({ state, descriptors, navigation, colors, isDesktop }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useResponsive();
  const reducedMotion = useReducedMotion();

  // Animations shared values
  const tabWidth = isDesktop ? 0 : width / state.routes.length;
  const bottomTranslateX = useSharedValue(state.index * tabWidth);
  const sidebarTranslateY = useSharedValue(state.index * 56); // 48px height + 8px gap

  useEffect(() => {
    if (isDesktop) {
      sidebarTranslateY.value = reducedMotion 
        ? state.index * 56 
        : withSpring(state.index * 56, { damping: 15, stiffness: 120 });
    } else {
      bottomTranslateX.value = reducedMotion 
        ? state.index * tabWidth 
        : withSpring(state.index * tabWidth, { damping: 15, stiffness: 120 });
    }
  }, [state.index, tabWidth, isDesktop, reducedMotion, bottomTranslateX, sidebarTranslateY]);

  const animatedBottomStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: bottomTranslateX.value }],
    };
  });

  const animatedSidebarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: sidebarTranslateY.value }],
    };
  });

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
        {/* Spring Tab Indicator */}
        <Animated.View
          style={[
            styles.bottomIndicator,
            {
              backgroundColor: colors.accent,
              width: tabWidth,
            },
            animatedBottomStyle,
          ]}
        />

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
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.sidebarLogo}
          contentFit="contain"
        />
        <Typography variant="title" color={colors.textPrimary} style={styles.sidebarTitle}>
          Celestial
        </Typography>
      </View>

      <View style={styles.sidebarMenu}>
        {/* Spring Background Capsule for active tab */}
        <Animated.View
          style={[
            styles.sidebarIndicator,
            {
              backgroundColor: colors.bgSecondary,
            },
            animatedSidebarStyle,
          ]}
        />

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
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.sidebarButton}
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
    position: 'relative',
  },
  bottomIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
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
  sidebarLogo: {
    width: 32,
    height: 32,
  },
  sidebarTitle: {
    marginLeft: 12,
    fontWeight: 'bold',
  },
  sidebarMenu: {
    flex: 1,
    gap: 8,
    position: 'relative',
  },
  sidebarIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    borderRadius: 8,
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
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

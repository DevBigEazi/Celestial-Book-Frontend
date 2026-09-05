import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import { Typography } from '../../src/components/ui/Typography';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

type TabsTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

interface CustomTabBarProps extends TabsTabBarProps {
  isDesktop: boolean;
}

function CustomTabBar({
  state,
  descriptors,
  navigation,
  isDesktop,
}: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { width } = useResponsive();
  const reducedMotion = useReducedMotion();

  // Only the 4 defined tabs (Home, TBR, Clubs, Settings)
  const tabRoutes = state.routes.filter(
    (route) => route.name === 'home' || route.name === 'tbr' || route.name === 'club' || route.name === 'settings'
  );

  const tabWidth = isDesktop ? 0 : width / tabRoutes.length;
  const activeTabRoute = state.routes[state.index];
  const activeIndex = Math.max(
    0,
    tabRoutes.findIndex((r) => r.key === activeTabRoute?.key)
  );

  const bottomTranslateX = useSharedValue(activeIndex * tabWidth);
  const sidebarTranslateY = useSharedValue(activeIndex * 56);

  useEffect(() => {
    if (isDesktop) {
      sidebarTranslateY.value = reducedMotion
        ? activeIndex * 56
        : withSpring(activeIndex * 56, { damping: 15, stiffness: 120 });
    } else {
      bottomTranslateX.value = reducedMotion
        ? activeIndex * tabWidth
        : withSpring(activeIndex * tabWidth, { damping: 15, stiffness: 120 });
    }
  }, [activeIndex, tabWidth, isDesktop, reducedMotion, bottomTranslateX, sidebarTranslateY]);

  const animatedBottomStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bottomTranslateX.value }],
  }));

  const animatedSidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sidebarTranslateY.value }],
  }));

  const getIconName = (
    routeName: string,
    isFocused: boolean
  ): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
      case 'home':
        return isFocused ? 'compass' : 'compass-outline';
      case 'tbr':
        return isFocused ? 'bookmark' : 'bookmark-outline';
      case 'club':
        return isFocused ? 'people' : 'people-outline';
      case 'settings':
        return isFocused ? 'settings' : 'settings-outline';
      default:
        return isFocused ? 'compass' : 'compass-outline';
    }
  };

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

        {tabRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.title !== undefined
              ? options.title
              : route.name.toUpperCase();
          const isFocused = index === activeIndex;

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
          const iconName = getIconName(route.name, isFocused);

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.bottomTabButton}
            >
              <Ionicons name={iconName} size={22} color={color} />
              <Typography
                variant="caption"
                color={color}
                style={[
                  styles.bottomTabLabel,
                  isFocused && { fontWeight: '700', color: colors.tabActive },
                ]}
              >
                {label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.sidebar,
        { backgroundColor: colors.tabBar, borderRightColor: colors.border },
      ]}
    >
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
        <Animated.View
          style={[
            styles.sidebarIndicator,
            {
              backgroundColor: colors.bgSecondary,
            },
            animatedSidebarStyle,
          ]}
        />

        {tabRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.title !== undefined ? options.title : route.name;
          const isFocused = index === activeIndex;

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
          const iconName = getIconName(route.name, isFocused);

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.sidebarButton}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={color}
                style={styles.sidebarIcon}
              />
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
  const { isDesktop } = useResponsive();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} isDesktop={isDesktop} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="tbr" options={{ title: 'TBR' }} />
      <Tabs.Screen name="club" options={{ title: 'Clubs' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
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

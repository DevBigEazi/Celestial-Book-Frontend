export const Palette = {
  // Celestial Gold Spectrum
  goldLight: '#FBF2C0',
  gold: '#E5C158',
  goldDark: '#D4AF37',
  goldMuted: '#C5A059',
  goldGlow: 'rgba(229, 193, 88, 0.25)',

  // Celestial Blue & Indigo Spectrum
  blueLight: '#93C5FD',
  blue: '#3B82F6',
  blueDark: '#1E3A8A',
  midnightNavy: '#0B1120',
  abyssalNavy: '#070B14',

  // Starlight & Parchment (Light Mode)
  starlightWhite: '#FFFDF7',
  parchment: '#FAF8F5',
  parchmentSecondary: '#F3EFEA',
  parchmentCard: '#FFFFFF',
  linenMuted: '#E6E2D8',
  inkBlack: '#140B08',
  inkSecondary: '#5C5248',
  inkMuted: '#94877A',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

export type PaletteKey = keyof typeof Palette;

export type AccentChoice = 'gold' | 'blue';

export type SkyThemeKey =
  | 'midnight_library'
  | 'celestial_gold'
  | 'moonlit_garden'
  | 'ember_hearth'
  | 'rose_quartz'
  | 'whispering_forest'
  | 'deep_tides'
  | 'desert_dusk';

export interface SkyPreset {
  id: SkyThemeKey;
  name: string;
  subtitle: string;
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  border: string;
  borderStrong: string;
  divider: string;
}

export const SKY_PRESETS: Record<SkyThemeKey, SkyPreset> = {
  midnight_library: {
    id: 'midnight_library',
    name: 'Midnight Library',
    subtitle: 'Deep navy, drifting stars',
    bgPrimary: '#070B14',
    bgSecondary: '#0B1220',
    bgCard: '#0F172A',
    border: '#1E293B',
    borderStrong: '#E5C158',
    divider: '#162238',
  },
  celestial_gold: {
    id: 'celestial_gold',
    name: 'Celestial Gold',
    subtitle: 'Warm gold on indigo',
    bgPrimary: '#0C0D1B',
    bgSecondary: '#121429',
    bgCard: '#181A36',
    border: '#282B57',
    borderStrong: '#E5C158',
    divider: '#1E2145',
  },
  moonlit_garden: {
    id: 'moonlit_garden',
    name: 'Moonlit Garden',
    subtitle: 'Nocturnal teal and slate',
    bgPrimary: '#091316',
    bgSecondary: '#0E1C21',
    bgCard: '#13262D',
    border: '#1E3B46',
    borderStrong: '#E5C158',
    divider: '#18313A',
  },
  ember_hearth: {
    id: 'ember_hearth',
    name: 'Ember Hearth',
    subtitle: 'Quiet candlelight and oak',
    bgPrimary: '#140B08',
    bgSecondary: '#1E110D',
    bgCard: '#271712',
    border: '#3F251D',
    borderStrong: '#E5C158',
    divider: '#311D16',
  },
  rose_quartz: {
    id: 'rose_quartz',
    name: 'Rose Quartz',
    subtitle: 'Petal-soft dawn light',
    bgPrimary: '#150D14',
    bgSecondary: '#20141F',
    bgCard: '#2A1A29',
    border: '#432941',
    borderStrong: '#E5C158',
    divider: '#352033',
  },
  whispering_forest: {
    id: 'whispering_forest',
    name: 'Whispering Forest',
    subtitle: 'Mossy hush and pine',
    bgPrimary: '#08120D',
    bgSecondary: '#0E1D15',
    bgCard: '#14291E',
    border: '#214331',
    borderStrong: '#E5C158',
    divider: '#193426',
  },
  deep_tides: {
    id: 'deep_tides',
    name: 'Deep Tides',
    subtitle: 'Slow waves under stars',
    bgPrimary: '#050F1A',
    bgSecondary: '#081728',
    bgCard: '#0C2037',
    border: '#143459',
    borderStrong: '#3B82F6',
    divider: '#102A47',
  },
  desert_dusk: {
    id: 'desert_dusk',
    name: 'Desert Dusk',
    subtitle: 'Warm dunes at twilight',
    bgPrimary: '#170F0A',
    bgSecondary: '#231710',
    bgCard: '#2F1F15',
    border: '#4A3222',
    borderStrong: '#E5C158',
    divider: '#3A271B',
  },
};

export const LightTokens = {
  // Backgrounds
  bgPrimary: Palette.parchment,
  bgSecondary: Palette.parchmentSecondary,
  bgCard: Palette.parchmentCard,
  bgInverse: Palette.abyssalNavy,

  // Text
  textPrimary: Palette.inkBlack,
  textSecondary: Palette.inkSecondary,
  textMuted: Palette.inkMuted,
  textInverse: Palette.starlightWhite,
  textAccent: Palette.goldDark,

  // Interactive
  accent: Palette.goldDark,
  accentDark: Palette.blueDark,
  accentText: Palette.starlightWhite,
  accentMuted: 'rgba(212, 175, 55, 0.12)',

  // Borders & dividers
  border: '#E3DCD1',
  borderStrong: Palette.goldDark,
  divider: '#EDE7DE',

  // Status
  success: Palette.success,
  warning: Palette.warning,
  error: Palette.error,

  // Tab bar
  tabActive: Palette.goldDark,
  tabInactive: '#9CA3AF',
  tabBar: Palette.parchmentCard,

  // Shadow
  shadow: 'rgba(20, 11, 8, 0.08)',

  // Brand Highlights
  gold: Palette.goldDark,
  blue: Palette.blueDark,
} as const;

export type ColorTokens = {
  [K in keyof typeof LightTokens]: string;
};

export function createDarkTokens(
  skyKey: SkyThemeKey = 'midnight_library',
  accent: AccentChoice = 'gold'
): ColorTokens {
  const sky = SKY_PRESETS[skyKey] || SKY_PRESETS.midnight_library;
  const isGold = accent === 'gold';
  const activeAccent = isGold ? Palette.gold : Palette.blue;
  const activeAccentDark = isGold ? Palette.goldDark : Palette.blueDark;
  const activeAccentText = isGold ? Palette.abyssalNavy : Palette.starlightWhite;
  const activeAccentMuted = isGold
    ? 'rgba(229, 193, 88, 0.15)'
    : 'rgba(59, 130, 246, 0.15)';

  return {
    bgPrimary: sky.bgPrimary,
    bgSecondary: sky.bgSecondary,
    bgCard: sky.bgCard,
    bgInverse: Palette.starlightWhite,

    textPrimary: Palette.starlightWhite,
    textSecondary: '#C8C4BA',
    textMuted: '#807C74',
    textInverse: Palette.abyssalNavy,
    textAccent: activeAccent,

    accent: activeAccent,
    accentDark: activeAccentDark,
    accentText: activeAccentText,
    accentMuted: activeAccentMuted,

    border: sky.border,
    borderStrong: activeAccent,
    divider: sky.divider,

    success: Palette.success,
    warning: Palette.warning,
    error: Palette.error,

    tabActive: activeAccent,
    tabInactive: '#64748B',
    tabBar: sky.bgPrimary,

    shadow: isGold ? Palette.goldGlow : 'rgba(59, 130, 246, 0.2)',

    gold: Palette.gold,
    blue: Palette.blue,
  };
}

export const DarkTokens: ColorTokens = createDarkTokens('midnight_library', 'gold');

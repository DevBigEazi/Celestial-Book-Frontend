export const FontFamily = {
  // Geist Sans roles
  displayBold: 'GeistSans_700Bold',
  displaySemiBold: 'GeistSans_600SemiBold',
  bodyMedium: 'GeistSans_500Medium',
  bodyRegular: 'GeistSans_400Regular',
  // Geist Mono roles
  monoMedium: 'GeistMono_500Medium',
  monoRegular: 'GeistMono_400Regular',
} as const;

export type TypographyChoice =
  | 'celestial_serif'
  | 'literary_italic'
  | 'modern_sans'
  | 'classic_serif';

export interface TypographyStyleOption {
  id: TypographyChoice;
  name: string;
  sample: string;
  fontFamily: string;
  isItalic?: boolean;
}

export const TYPOGRAPHY_OPTIONS: TypographyStyleOption[] = [
  {
    id: 'celestial_serif',
    name: 'Celestial Serif',
    sample: 'Aa',
    fontFamily: 'Georgia',
  },
  {
    id: 'literary_italic',
    name: 'Literary Italic',
    sample: 'Aa',
    fontFamily: 'Georgia',
    isItalic: true,
  },
  {
    id: 'modern_sans',
    name: 'Modern Sans',
    sample: 'Aa',
    fontFamily: FontFamily.bodyMedium,
  },
  {
    id: 'classic_serif',
    name: 'Classic Serif',
    sample: 'Aa',
    fontFamily: 'Times New Roman',
  },
];

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 22,
  '3xl': 30,
} as const;

export const LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

export const Spacing = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
} as const;

export const Radius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const Shadow = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

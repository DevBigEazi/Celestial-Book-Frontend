export const Palette = {
  white: "#fefeff",
  softLinen: "#e6e4db",
  turquoiseSurf: "#00b4d8",
  regalNavy: "#1b4079",
  pitchBlack: "#140b01",
} as const;

export type PaletteKey = keyof typeof Palette;

export const LightTokens = {
  // Backgrounds
  bgPrimary: Palette.white,
  bgSecondary: Palette.softLinen,
  bgCard: Palette.white,
  bgInverse: Palette.pitchBlack,

  // Text
  textPrimary: Palette.pitchBlack,
  textSecondary: "#4a4540", // softened for secondary labels
  textMuted: "#8a8680",
  textInverse: Palette.white,
  textAccent: Palette.turquoiseSurf,

  // Interactive
  accent: Palette.turquoiseSurf,
  accentDark: Palette.regalNavy,
  accentText: Palette.white, // text on accent backgrounds

  // Borders & dividers
  border: "#d4d2ca",
  borderStrong: Palette.regalNavy,
  divider: "#e0ded6",

  // Status
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",

  // Tab bar
  tabActive: Palette.turquoiseSurf,
  tabInactive: "#9ca3af",
  tabBar: Palette.white,

  // Shadow (web and iOS)
  shadow: "rgba(20, 11, 1, 0.08)",
} as const;

export type ColorTokens = {
  [K in keyof typeof LightTokens]: string;
};

export const DarkTokens: ColorTokens = {
  bgPrimary: Palette.pitchBlack,
  bgSecondary: "#1e1710",
  bgCard: "#221c14",
  bgInverse: Palette.white,

  textPrimary: Palette.softLinen,
  textSecondary: "#b5b2aa",
  textMuted: "#6b6860",
  textInverse: Palette.pitchBlack,
  textAccent: Palette.turquoiseSurf,

  accent: Palette.turquoiseSurf,
  accentDark: "#2a5fa8",
  accentText: Palette.pitchBlack,

  border: "#2e2720",
  borderStrong: Palette.turquoiseSurf,
  divider: "#2a2318",

  success: "#16a34a",
  warning: "#d97706",
  error: "#dc2626",

  tabActive: Palette.turquoiseSurf,
  tabInactive: "#4b5563",
  tabBar: "#1a1410",

  shadow: "rgba(0, 180, 216, 0.08)",
};

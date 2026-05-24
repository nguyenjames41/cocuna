import '@/global.css';

import { Platform } from 'react-native';

export const Cocuna = {
  bg: '#F7F4EE',
  surface: '#FFFFFF',
  surfaceSunken: '#EFEBE4',
  rose: '#F3D7DC',
  roseDeep: '#E7B8C2',
  mint: '#C8E2D2',
  mintDeep: '#9DCBB0',
  lavender: '#D8D0EE',
  lavenderDeep: '#B5A8DC',
  peach: '#F8D9C5',
  peachDeep: '#EDB99B',
  butter: '#F0E3B1',
  text: '#2A2723',
  textMuted: '#6E6862',
  textFaint: '#A29D95',
  hairline: 'rgba(42, 39, 35, 0.10)',
  hairlineSoft: 'rgba(42, 39, 35, 0.06)',
  hairlineStrong: 'rgba(42, 39, 35, 0.16)',
  shadow: 'rgba(42, 39, 35, 0.10)',
} as const;

export type Pastel = 'rose' | 'mint' | 'lavender' | 'peach' | 'butter';

export const Pastels: Record<Pastel, { fill: string; deep: string }> = {
  rose: { fill: Cocuna.rose, deep: Cocuna.roseDeep },
  mint: { fill: Cocuna.mint, deep: Cocuna.mintDeep },
  lavender: { fill: Cocuna.lavender, deep: Cocuna.lavenderDeep },
  peach: { fill: Cocuna.peach, deep: Cocuna.peachDeep },
  butter: { fill: Cocuna.butter, deep: Cocuna.peachDeep },
};

export const Triage = {
  red: '#E5616A',
  orange: '#F0A152',
  yellow: '#C9B05D',
  green: '#7EC298',
  gray: '#9CA6B5',
} as const;

export const TriageLabel = {
  red: 'Urgent',
  orange: 'Same-day',
  yellow: 'Review',
  green: 'Steady',
  gray: 'Needs review',
} as const;

export const FontStack = {
  display: Platform.select({
    web: '"Fraunces", Georgia, serif',
    default: 'Fraunces_600SemiBold',
  }),
  displayMedium: Platform.select({
    web: '"Fraunces", Georgia, serif',
    default: 'Fraunces_500Medium',
  }),
  displayLight: Platform.select({
    web: '"Fraunces", Georgia, serif',
    default: 'Fraunces_400Regular',
  }),
  body: Platform.select({
    web: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    default: 'DMSans_400Regular',
  }),
  bodyMedium: Platform.select({
    web: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    default: 'DMSans_500Medium',
  }),
  bodySemibold: Platform.select({
    web: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    default: 'DMSans_600SemiBold',
  }),
} as const;

export const Type = {
  display: {
    fontFamily: FontStack.display,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  title: {
    fontFamily: FontStack.displayMedium,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: FontStack.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
  },
  small: {
    fontFamily: FontStack.body,
    fontSize: 13,
    lineHeight: 18,
  },
  smallMedium: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  caption: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: 'uppercase' as const,
  },
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const MaxContentWidth = 560;

import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Cocuna, Pastels, Radius, type Pastel } from '@/constants/theme';

type Tone = 'surface' | 'sunken' | 'outline' | Pastel;

export function Surface({
  children,
  style,
  padded = true,
  tone = 'surface',
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
  tone?: Tone;
}) {
  const isPastel = tone in Pastels;
  const baseStyle = isPastel
    ? { backgroundColor: Pastels[tone as Pastel].fill }
    : tone === 'sunken'
      ? { backgroundColor: Cocuna.surfaceSunken }
      : tone === 'outline'
        ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: Cocuna.hairline }
        : { backgroundColor: Cocuna.surface, borderWidth: 1, borderColor: Cocuna.hairlineSoft };

  return (
    <View style={[styles.base, baseStyle, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
  },
  padded: { padding: 20 },
});

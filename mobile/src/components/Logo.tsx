import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Cocuna, FontStack } from '@/constants/theme';

const LOGO_SOURCE = require('@/assets/images/cocuna-logo.png');

export function Logo({
  size = 80,
  withWordmark = false,
  wordmarkSize,
}: {
  size?: number;
  withWordmark?: boolean;
  wordmarkSize?: number;
}) {
  const wm = wordmarkSize ?? Math.round(size * 0.36);
  return (
    <View style={[styles.wrap, { gap: Math.max(8, size * 0.12) }]}>
      <Image
        source={LOGO_SOURCE}
        style={{ width: size, height: size }}
        contentFit="contain"
        transition={150}
        accessibilityLabel="Cocuna"
        alt="Cocuna"
      />
      {withWordmark ? (
        <Text style={[styles.wordmark, { fontSize: wm, lineHeight: wm * 1.05 }]}>
          cocuna
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: FontStack.body,
    color: Cocuna.text,
    letterSpacing: -0.4,
  },
});

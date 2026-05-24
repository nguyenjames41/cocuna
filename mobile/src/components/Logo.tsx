import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const LOGO_SOURCE = require('@/assets/images/cocuna-logo.png');

/**
 * Cocuna lockup — gradient mark + wordmark, baked into the PNG. Renders at the
 * given size preserving aspect (square 1:1 in the source). On a cream background
 * the gradient + dark wordmark read against the surface; the source's black
 * background has been processed to transparent.
 */
export function Logo({
  size = 120,
}: {
  size?: number;
}) {
  return (
    <View style={styles.wrap}>
      <Image
        source={LOGO_SOURCE}
        style={{ width: size, height: size }}
        contentFit="contain"
        transition={150}
        accessibilityLabel="Cocuna"
        alt="Cocuna"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
});

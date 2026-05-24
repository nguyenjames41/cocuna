import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Cocuna } from '@/constants/theme';

export type HeraMood = 'calm' | 'attentive' | 'milestone' | 'lean-in';

const GRADIENTS: Record<HeraMood, [string, string]> = {
  calm: [Cocuna.lavender, Cocuna.mint],
  attentive: [Cocuna.peach, Cocuna.rose],
  milestone: [Cocuna.butter, Cocuna.mint],
  'lean-in': [Cocuna.roseDeep, Cocuna.peachDeep],
};

const SHADOW_TINT: Record<HeraMood, string> = {
  calm: 'rgba(181, 168, 220, 0.35)',
  attentive: 'rgba(237, 185, 155, 0.35)',
  milestone: 'rgba(157, 203, 176, 0.35)',
  'lean-in': 'rgba(231, 184, 194, 0.45)',
};

export function Companion({
  size = 86,
  mood = 'calm',
  introPulse = true,
}: {
  size?: number;
  mood?: HeraMood;
  introPulse?: boolean;
}) {
  const breath = useSharedValue(1);
  const glow = useSharedValue(introPulse ? 0 : 0.6);

  useEffect(() => {
    breath.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [breath]);

  useEffect(() => {
    if (introPulse) {
      glow.value = withSequence(
        withTiming(1.0, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withDelay(200, withTiming(0.6, { duration: 1200 })),
      );
    } else {
      glow.value = withTiming(0.6, { duration: 600 });
    }
  }, [glow, introPulse]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breath.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.5,
    transform: [{ scale: 1 + glow.value * 0.18 }],
  }));

  const colors = GRADIENTS[mood];
  const shadow = SHADOW_TINT[mood];
  const eyeSize = Math.max(4, Math.round(size * 0.07));
  const eyeTop = size * 0.42;
  const eyeLeftA = size * 0.32;
  const eyeLeftB = size * 0.62 - eyeSize;
  const radiusTL = size * 0.42;
  const radiusTR = size * 0.46;
  const radiusBL = size * 0.4;
  const radiusBR = size * 0.48;

  return (
    <View
      style={[
        styles.frame,
        { width: size * 1.7, height: size * 1.5 },
      ]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: size * 0.7,
            backgroundColor: colors[0],
          },
          glowStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.body,
          {
            width: size,
            height: size,
            borderTopLeftRadius: radiusTL,
            borderTopRightRadius: radiusTR,
            borderBottomLeftRadius: radiusBL,
            borderBottomRightRadius: radiusBR,
            shadowColor: shadow,
            shadowOpacity: 1,
            shadowRadius: size * 0.28,
            shadowOffset: { width: 0, height: size * 0.08 },
          },
          bodyStyle,
        ]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.85, y: 0.95 }}
          style={[
            StyleSheet.absoluteFill,
            {
              borderTopLeftRadius: radiusTL,
              borderTopRightRadius: radiusTR,
              borderBottomLeftRadius: radiusBL,
              borderBottomRightRadius: radiusBR,
            },
          ]}
        />
        <View
          style={[
            styles.eye,
            {
              width: eyeSize,
              height: eyeSize,
              borderRadius: eyeSize / 2,
              top: eyeTop,
              left: eyeLeftA,
            },
          ]}
        />
        <View
          style={[
            styles.eye,
            {
              width: eyeSize,
              height: eyeSize,
              borderRadius: eyeSize / 2,
              top: eyeTop,
              left: eyeLeftB,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  body: {
    position: 'relative',
  },
  eye: {
    position: 'absolute',
    backgroundColor: Cocuna.text,
  },
});

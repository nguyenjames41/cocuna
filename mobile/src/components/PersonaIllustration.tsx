import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { Cocuna, FontStack } from '@/constants/theme';

const BABY_34W = require('@/assets/images/baby-34w.png');

const AnimatedG = Animated.createAnimatedComponent(G);

/**
 * PersonaIllustration — central hero on Home that swaps with the persona.
 *  - Maria (pregnant, week 34): user-supplied womb baby image floating in fluid
 *  - Jane  (postpartum, month 3): cartoon 3-month baby (Lila) with gentle motion
 *
 * Ported from the design bundle's `babies.jsx` (WombBaby + HappyBaby), adapted
 * for React Native with Reanimated v4 + react-native-svg. Web export uses
 * react-native-web so the same code renders on Vercel.
 */
export function PersonaIllustration({
  persona,
  size = 200,
}: {
  persona: 'maria' | 'jane' | string;
  size?: number;
}) {
  if (persona === 'jane') return <HappyBaby size={size} name="Lila" />;
  return <WombBaby size={size} week={34} />;
}

/* ─────────────────────────────────────────────────────────
   WOMB BABY — image with slow float + scale drift
   ───────────────────────────────────────────────────────── */
function WombBaby({ size, week }: { size: number; week: number }) {
  const drift = useSharedValue(0);
  const breath = useSharedValue(1);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    breath.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [drift, breath]);

  const imageStyle = useAnimatedStyle(() => {
    // Phase map: drift∈[0,1] → tx/ty/rotation curves matching baby-float-img
    const tx = Math.sin(drift.value * Math.PI * 2) * 3;
    const ty = Math.sin(drift.value * Math.PI * 2 + 0.6) * 2.5;
    const rot = Math.sin(drift.value * Math.PI * 2 + 1.2) * 1.5;
    return {
      transform: [
        { translateX: tx },
        { translateY: ty },
        { rotate: `${rot}deg` },
        { scale: breath.value },
      ],
    };
  });

  return (
    <View style={[styles.wombWrap, { width: size, height: size + 22 }]}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[{ width: size, height: size }, imageStyle]}>
          <Image
            source={BABY_34W}
            style={{ width: size, height: size }}
            contentFit="contain"
            transition={200}
            accessibilityLabel={`Baby at week ${week}`}
            alt={`Baby at week ${week}`}
          />
        </Animated.View>
      </View>
      <Animated.Text style={styles.weekLabel}>{`WEEK ${week}`}</Animated.Text>
    </View>
  );
}

/* ─────────────────────────────────────────────────────────
   HAPPY BABY — animated SVG 3-month baby for Jane
   Ported from babies.jsx HappyBaby, simplified for RN.
   ───────────────────────────────────────────────────────── */
function HappyBaby({ size, name }: { size: number; name: string }) {
  const bob = useSharedValue(0);
  const wiggle = useSharedValue(0);
  const wave = useSharedValue(0);
  const halo = useSharedValue(1);

  useEffect(() => {
    bob.value = withRepeat(
      withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    wiggle.value = withRepeat(
      withTiming(1, { duration: 3800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    wave.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    halo.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 2250, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 2250, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [bob, wiggle, wave, halo]);

  const headAnim = useAnimatedStyle(() => {
    const ty = Math.sin(bob.value * Math.PI * 2) * 2.5;
    const rot = Math.sin(bob.value * Math.PI * 2 + 0.8) * 1.4;
    return { transform: [{ translateY: ty }, { rotate: `${rot}deg` }] };
  });
  const bodyAnim = useAnimatedStyle(() => {
    const rot = Math.sin(wiggle.value * Math.PI * 2) * 1.4;
    return { transform: [{ rotate: `${rot}deg` }] };
  });
  const waveAnim = useAnimatedStyle(() => {
    const rot = Math.sin(wave.value * Math.PI * 2) * 15 - 25;
    return { transform: [{ rotate: `${rot}deg` }] };
  });
  const haloAnim = useAnimatedStyle(() => ({
    transform: [{ scale: halo.value }],
    opacity: 0.75 + (halo.value - 1) * 4,
  }));

  return (
    <View
      style={{ width: size, height: size + 22, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ width: size, height: size, position: 'relative' }}>
        {/* Soft pastel halo — Animated.View overlay (scales with halo SV) */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: 'center',
              justifyContent: 'center',
            },
            haloAnim,
          ]}
        >
          <View
            style={{
              width: size * 0.92,
              height: size * 0.92,
              borderRadius: size,
              backgroundColor: Cocuna.mint,
              opacity: 0.5,
            }}
          />
        </Animated.View>

        <Svg viewBox="0 0 200 200" width={size} height={size}>
          <Defs>
            <RadialGradient id="skin" cx="0.4" cy="0.35" r="0.7">
              <Stop offset="0%" stopColor="#FFE0CB" />
              <Stop offset="100%" stopColor="#F3B891" />
            </RadialGradient>
            <RadialGradient id="onesie" cx="0.5" cy="0.3" r="0.7">
              <Stop offset="0%" stopColor="#E4D4EB" />
              <Stop offset="100%" stopColor="#BFA8D6" />
            </RadialGradient>
          </Defs>

          {/* Onesie body + waving arm */}
          {/* @ts-expect-error react-native-svg style prop on G via Animated */}
          <AnimatedG style={bodyAnim} origin="100, 156">
            <Path
              d="M 64 168 Q 64 134, 100 134 Q 136 134, 136 168 Q 136 188, 100 188 Q 64 188, 64 168 Z"
              fill="url(#onesie)"
            />
            <Path
              d="M 100 156 L 102 162 L 108 162 L 103 166 L 105 172 L 100 168 L 95 172 L 97 166 L 92 162 L 98 162 Z"
              fill="#FFFFFF"
              opacity={0.8}
            />
            {/* Waving arm */}
            {/* @ts-expect-error react-native-svg style prop on G via Animated */}
            <AnimatedG style={waveAnim} origin="60, 148">
              <Ellipse cx={60} cy={148} rx={9} ry={14} fill="url(#skin)" />
            </AnimatedG>
            {/* Other arm relaxed (static rotate via transform attr) */}
            <G origin="140, 148" rotation={20}>
              <Ellipse cx={140} cy={148} rx={9} ry={14} fill="url(#skin)" />
            </G>
          </AnimatedG>

          {/* Head with bob */}
          {/* @ts-expect-error react-native-svg style prop on G via Animated */}
          <AnimatedG style={headAnim} origin="100, 92">
            <Circle cx={100} cy={92} r={46} fill="url(#skin)" />
            <Ellipse cx={56} cy={92} rx={5} ry={7} fill="url(#skin)" />
            <Ellipse cx={144} cy={92} rx={5} ry={7} fill="url(#skin)" />
            {/* Hair tuft */}
            <Path
              d="M 88 52 Q 92 44 98 50 Q 102 44 108 50 Q 114 46 116 56"
              stroke="#7B5447"
              strokeWidth={3.5}
              fill="none"
              strokeLinecap="round"
            />
            {/* Cheek blush */}
            <Ellipse cx={74} cy={100} rx={9} ry={6} fill="#F4A3A8" opacity={0.55} />
            <Ellipse cx={126} cy={100} rx={9} ry={6} fill="#F4A3A8" opacity={0.55} />
            {/* Smiley arc eyes */}
            <Path
              d="M 78 88 Q 84 80 90 88"
              stroke="#3A2418"
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M 110 88 Q 116 80 122 88"
              stroke="#3A2418"
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
            />
            {/* Smile */}
            <Path
              d="M 90 108 Q 100 118 110 108"
              stroke="#A85A5A"
              strokeWidth={2.4}
              fill="none"
              strokeLinecap="round"
            />
          </AnimatedG>

          {/* Caption */}
          <SvgText
            x={100}
            y={200}
            textAnchor="middle"
            fontFamily={FontStack.bodySemibold ?? 'sans-serif'}
            fontSize={10}
            fill="#5B7A66"
            fontWeight="600"
          >
            {`${name.toUpperCase()} · HEALTHY`}
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wombWrap: { alignItems: 'center', justifyContent: 'center' },
  weekLabel: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: '#9A573D',
    marginTop: 6,
    fontWeight: '600',
  },
});

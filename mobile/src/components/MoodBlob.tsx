import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);

export type MoodFace =
  | 'cry'
  | 'glum'
  | 'neutral'
  | 'soft'
  | 'smile'
  | 'beam'
  | 'sleepy'
  | 'dead'
  | 'sparkle'
  | 'wince'
  | 'ouch'
  | 'severe';

const BLOB_PATHS = [
  'M 50 8 C 70 8 90 22 92 44 C 94 66 80 90 56 92 C 30 94 8 78 8 54 C 8 30 28 8 50 8 Z',
  'M 48 6 C 72 8 94 24 90 50 C 88 72 70 92 46 92 C 22 92 6 72 10 50 C 14 28 28 6 48 6 Z',
  'M 50 10 C 72 8 88 30 88 50 C 88 70 76 92 50 92 C 26 92 10 76 12 52 C 14 28 30 10 50 10 Z',
  'M 52 6 C 76 6 92 28 90 52 C 88 76 68 94 46 90 C 22 86 8 68 10 46 C 12 22 30 6 52 6 Z',
  'M 50 8 C 66 6 84 18 90 38 C 96 60 82 88 58 92 C 36 96 12 84 10 58 C 8 32 30 8 50 8 Z',
  'M 50 4 C 68 4 88 16 92 38 C 96 60 84 88 60 92 C 36 94 14 80 10 56 C 6 30 28 4 50 4 Z',
];

/**
 * MoodBlob — original organic blob character with a simple line face and
 * gentle idle motion (bob + wobble). Ported from the design bundle's
 * blobs.jsx, adapted to React Native + Reanimated v4 + react-native-svg.
 *
 * Twelve face variants drive Mood/Energy/Pain rows on Home. Each instance
 * gets a per-index phase offset so a row of five never lines up.
 */
export function MoodBlob({
  size = 48,
  color = '#F3D7DC',
  face = 'neutral',
  selected = false,
  idx = 0,
}: {
  size?: number;
  color?: string;
  face?: MoodFace;
  selected?: boolean;
  idx?: number;
}) {
  const bob = useSharedValue(0);
  const wobble = useSharedValue(0);

  useEffect(() => {
    // Per-index delay so a row of five never lines up
    const bobDelay = (idx * 270) % 1600;
    const wobbleDelay = (idx * 400) % 2400;
    setTimeout(() => {
      bob.value = withRepeat(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    }, bobDelay);
    setTimeout(() => {
      wobble.value = withRepeat(
        withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    }, wobbleDelay);
  }, [bob, wobble, idx]);

  const bobAnim = useAnimatedStyle(() => {
    const ty = Math.sin(bob.value * Math.PI * 2) * 2.5;
    return { transform: [{ translateY: ty }] };
  });
  const wobbleAnim = useAnimatedStyle(() => {
    const rot = Math.sin(wobble.value * Math.PI * 2) * 1.5;
    const sx = 1 + Math.sin(wobble.value * Math.PI * 2 + 0.4) * 0.04;
    const sy = 1 + Math.cos(wobble.value * Math.PI * 2 + 0.4) * 0.04;
    return { transform: [{ rotate: `${rot}deg` }, { scaleX: sx }, { scaleY: sy }] };
  });

  const path = BLOB_PATHS[idx % BLOB_PATHS.length];

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[{ width: size, height: size }, bobAnim]}>
        <Svg viewBox="0 0 100 100" width={size} height={size}>
          {/* shadow */}
          <Ellipse cx={50} cy={92} rx={22} ry={3} fill="rgba(0,0,0,0.10)" />
          {/* @ts-expect-error svg style via Animated */}
          <AnimatedG style={wobbleAnim} origin="50, 55">
            <Path d={path} fill={color} />
            {selected ? (
              <Path
                d={path}
                fill="none"
                stroke={color}
                strokeOpacity={0.55}
                strokeWidth={3}
              />
            ) : null}
            <Face id={face} />
          </AnimatedG>
        </Svg>
      </Animated.View>
    </View>
  );
}

function Face({ id }: { id: MoodFace }) {
  const stroke = '#3D2A22';
  const sw = 2;
  const lc = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    case 'cry':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 38 52 L 32 56 M 38 52 L 44 56" />
          <Path d="M 56 52 L 50 56 M 56 52 L 62 56" />
          <Path d="M 42 64 Q 50 60 58 64" />
        </G>
      );
    case 'glum':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 34 54 L 44 54" />
          <Path d="M 56 54 L 66 54" />
          <Path d="M 42 64 Q 50 62 58 64" />
        </G>
      );
    case 'neutral':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 36 52 L 42 52" />
          <Path d="M 58 52 L 64 52" />
          <Path d="M 44 62 L 56 62" />
        </G>
      );
    case 'soft':
      return (
        <G {...lc}>
          <Circle cx={40} cy={52} r={1.8} fill={stroke} />
          <Circle cx={60} cy={52} r={1.8} fill={stroke} />
          <Path
            d="M 42 62 Q 50 66 58 62"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
        </G>
      );
    case 'smile':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 36 52 Q 40 48 44 52" />
          <Path d="M 56 52 Q 60 48 64 52" />
          <Path d="M 40 62 Q 50 70 60 62" />
        </G>
      );
    case 'beam':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 36 54 L 42 50 L 36 46" />
          <Path d="M 64 54 L 58 50 L 64 46" />
          <Path d="M 40 62 Q 50 72 60 62" />
        </G>
      );
    case 'sleepy':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 34 52 Q 39 56 44 52" />
          <Path d="M 56 52 Q 61 56 66 52" />
          <Path d="M 44 64 Q 50 66 56 64" />
        </G>
      );
    case 'dead':
      return (
        <G stroke={stroke} strokeWidth={sw} {...lc} fill="none">
          <Path d="M 36 48 L 44 56" />
          <Path d="M 44 48 L 36 56" />
          <Path d="M 56 48 L 64 56" />
          <Path d="M 64 48 L 56 56" />
          <Path d="M 42 65 L 58 65" />
        </G>
      );
    case 'sparkle':
      return (
        <G {...lc}>
          <Circle cx={40} cy={51} r={2.5} fill={stroke} />
          <Circle cx={60} cy={51} r={2.5} fill={stroke} />
          <Circle cx={38.5} cy={50} r={0.7} fill="#FFFFFF" />
          <Circle cx={58.5} cy={50} r={0.7} fill="#FFFFFF" />
          <Path
            d="M 40 62 Q 50 70 60 62"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
        </G>
      );
    case 'wince':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 34 50 L 44 53" />
          <Path d="M 66 50 L 56 53" />
          <Circle cx={40} cy={56} r={1.6} fill={stroke} />
          <Circle cx={60} cy={56} r={1.6} fill={stroke} />
          <Path d="M 42 66 L 58 66" />
        </G>
      );
    case 'ouch':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 32 48 Q 38 52 44 48" />
          <Path d="M 56 48 Q 62 52 68 48" />
          <Path d="M 40 64 Q 50 60 60 64" />
        </G>
      );
    case 'severe':
      return (
        <G fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
          <Path d="M 32 50 Q 38 56 44 50" />
          <Path d="M 56 50 Q 62 56 68 50" />
          <Circle cx={42} cy={58} r={1.5} fill="#5BA8E0" />
          <Circle cx={58} cy={58} r={1.5} fill="#5BA8E0" />
          <Path d="M 40 68 Q 50 60 60 68" />
        </G>
      );
    default:
      return null;
  }
}

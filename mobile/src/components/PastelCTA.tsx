import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cocuna, FontStack, Pastels, Radius, type Pastel } from '@/constants/theme';

export function PastelCTA({
  label,
  caption,
  onPress,
  tone = 'peach',
  size = 'lg',
}: {
  label: string;
  caption?: string;
  onPress: () => void;
  tone?: Pastel;
  size?: 'md' | 'lg';
}) {
  const fill = Pastels[tone].fill;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        { backgroundColor: fill },
        size === 'lg' ? styles.wrapLg : styles.wrapMd,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.textCol}>
        <Text style={size === 'lg' ? styles.labelLg : styles.labelMd}>{label}</Text>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowGlyph}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    borderRadius: Radius.xl,
  },
  wrapLg: { paddingVertical: 20, paddingHorizontal: 22 },
  wrapMd: { paddingVertical: 14, paddingHorizontal: 18 },
  pressed: { opacity: 0.85 },
  textCol: { flex: 1, gap: 4 },
  labelLg: {
    fontFamily: FontStack.display,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: Cocuna.text,
  },
  labelMd: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 15,
    color: Cocuna.text,
  },
  caption: {
    fontFamily: FontStack.body,
    fontSize: 13,
    lineHeight: 18,
    color: Cocuna.text,
    opacity: 0.78,
  },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Cocuna.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowGlyph: {
    color: Cocuna.text,
    fontSize: 17,
    fontFamily: FontStack.bodySemibold,
  },
});

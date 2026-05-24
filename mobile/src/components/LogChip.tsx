import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cocuna, FontStack, Radius, Triage } from '@/constants/theme';

export function LogChip({
  label,
  done,
  onPress,
}: {
  label: string;
  done?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
    >
      <View style={[styles.dot, done && styles.dotDone]} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Cocuna.hairline,
    backgroundColor: Cocuna.surface,
  },
  pressed: { opacity: 0.65 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Cocuna.hairline,
    backgroundColor: 'transparent',
  },
  dotDone: {
    backgroundColor: Triage.green,
    borderColor: Triage.green,
  },
  label: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 13,
    color: Cocuna.text,
  },
});

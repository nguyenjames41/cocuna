import { StyleSheet, Text, View } from 'react-native';

import { Cocuna, FontStack, Radius, Triage, TriageLabel } from '@/constants/theme';
import type { TriageLevel } from '@/lib/triage';

export function StatusBadge({
  label,
  level,
}: {
  label: string;
  level: TriageLevel;
}) {
  return (
    <View style={styles.pill}>
      <View style={[styles.dot, { backgroundColor: Triage[level] }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.divider}>·</Text>
      <Text style={styles.value}>{TriageLabel[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Cocuna.hairline,
    backgroundColor: Cocuna.surface,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 13,
    color: Cocuna.textMuted,
  },
  divider: { color: Cocuna.textFaint, fontSize: 13 },
  value: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 13,
    color: Cocuna.text,
  },
});

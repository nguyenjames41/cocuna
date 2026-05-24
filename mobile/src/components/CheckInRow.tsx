import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MoodBlob, type MoodFace } from '@/components/MoodBlob';
import { Cocuna, FontStack } from '@/constants/theme';

export type CheckInOption = {
  face: MoodFace;
  label: string;
  bg: string;
  /** Index into the blob silhouette set (0..5). */
  idx?: number;
};

/**
 * CheckInRow — single Mood / Energy / Pain row.
 * Five blob options laid out as a 5-up grid. Tap to select; selection
 * lifts the chip onto a quiet surface card and pulses the blob outline.
 *
 * Ported from screens-home.jsx CheckInRow. The mood / energy / pain
 * triplet on Home replaces the old StatusBadge + Quick log section.
 */
export function CheckInRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: CheckInOption[];
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        {value != null ? (
          <Text style={styles.value}>{options[value]?.label}</Text>
        ) : null}
      </View>
      <View style={styles.grid}>
        {options.map((opt, i) => {
          const selected = value === i;
          return (
            <Pressable
              key={`${label}-${i}`}
              onPress={() => onChange(i)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <MoodBlob
                size={42}
                color={opt.bg}
                face={opt.face}
                selected={selected}
                idx={opt.idx ?? i}
              />
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8 },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 13,
    color: Cocuna.text,
  },
  value: {
    fontFamily: FontStack.body,
    fontSize: 11,
    color: Cocuna.textMuted,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: Cocuna.surface,
    borderColor: Cocuna.hairline,
    transform: [{ translateY: -1 }],
  },
  chipPressed: { opacity: 0.7 },
  chipLabel: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 9,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: Cocuna.textMuted,
  },
  chipLabelSelected: {
    color: Cocuna.text,
    fontFamily: FontStack.bodySemibold,
  },
});

import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Companion } from '@/components/Companion';
import { Surface } from '@/components/Surface';
import {
  Cocuna,
  FontStack,
  MaxContentWidth,
  Spacing,
  Triage,
  Type,
} from '@/constants/theme';
import { isPregnancy, useDemoState } from '@/lib/demo-state';

export default function CompanionScreen() {
  const state = useDemoState();
  const pregnancy = isPregnancy(state);
  const week = pregnancy ? state.weeksPregnant : Math.ceil(state.daysPostpartum / 7);

  const recognitions = pregnancy
    ? [
        state.kickStreakDays >= 3
          ? `Kick counts logged ${state.kickStreakDays} days in a row.`
          : 'You tuned in today.',
        state.bpStreakDays >= 3
          ? `BP logged ${state.bpStreakDays} days in a row.`
          : null,
        `Week ${state.weeksPregnant} — almost there.`,
      ]
    : [
        state.bpStreakDays >= 3
          ? `BP logged ${state.bpStreakDays} days in a row.`
          : null,
        state.logsToday.length >= 2
          ? 'You checked in twice today.'
          : 'You showed up today.',
        `Week ${week} postpartum — quietly arrived.`,
      ];

  const filtered = recognitions.filter(Boolean) as string[];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Text style={styles.backText}>← Home</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroWrap}>
            <Companion size={200} mood="calm" introPulse />
          </View>

          <View style={styles.headBlock}>
            <Text style={styles.eyebrow}>Companion</Text>
            <Text style={styles.title}>Steady, with you.</Text>
            <Text style={styles.lede}>
              A quiet record of how you’ve shown up. Not a score, not a streak — just what
              has been true.
            </Text>
          </View>

          <View style={styles.recognitionList}>
            {filtered.map((line, i) => (
              <Surface key={i} tone="surface" style={styles.recogCard}>
                <View style={styles.recogDot} />
                <Text style={styles.recogText}>{line}</Text>
              </Surface>
            ))}
          </View>

          <Surface tone="lavender" style={styles.tendBlock}>
            <Text style={styles.tendLabel}>Tend to yourself</Text>
            <Text style={styles.tendBody}>
              When you’ve got a minute, breathe slow with Hera. She’s holding the same minute
              with you.
            </Text>
          </Surface>

          <Text style={styles.disclaimer}>
            Cocuna acknowledges the work you’re doing. We don’t take credit for your safety —
            you’re the one keeping yourself well. We’re a hand to hold.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cocuna.bg },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  back: { paddingVertical: 6, paddingHorizontal: 4, alignSelf: 'flex-start' },
  pressed: { opacity: 0.6 },
  backText: { ...Type.smallMedium, color: Cocuna.textMuted },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
    paddingTop: Spacing.two,
    alignItems: 'stretch',
  },
  heroWrap: {
    alignItems: 'center',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  headBlock: {
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  eyebrow: { ...Type.caption, color: Cocuna.textMuted },
  title: {
    fontFamily: FontStack.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: Cocuna.text,
    textAlign: 'center',
  },
  lede: {
    ...Type.body,
    color: Cocuna.textMuted,
    textAlign: 'center',
    maxWidth: 360,
  },
  recognitionList: { gap: 10 },
  recogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recogDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Triage.green,
  },
  recogText: {
    flex: 1,
    fontFamily: FontStack.body,
    fontSize: 15,
    lineHeight: 22,
    color: Cocuna.text,
  },
  tendBlock: { gap: 6 },
  tendLabel: { ...Type.caption, color: Cocuna.text, opacity: 0.7 },
  tendBody: {
    fontFamily: FontStack.body,
    fontSize: 14,
    lineHeight: 21,
    color: Cocuna.text,
  },
  disclaimer: {
    ...Type.small,
    color: Cocuna.textFaint,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
  },
});

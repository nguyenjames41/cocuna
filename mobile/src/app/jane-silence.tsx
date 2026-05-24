import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Companion } from '@/components/Companion';
import { PastelCTA } from '@/components/PastelCTA';
import {
  Cocuna,
  FontStack,
  MaxContentWidth,
  Radius,
  Spacing,
  Type,
} from '@/constants/theme';
import { useDemoState, type SilenceSignal } from '@/lib/demo-state';

const FALLBACK_SIGNALS: SilenceSignal[] = [
  {
    id: 'sleep',
    label: 'Sleep',
    value: '−47% (7-day avg)',
    trend: 'down',
    hint: 'Wearable: 3.8h / night, fragmented.',
  },
  {
    id: 'activity',
    label: 'Activity',
    value: '−86% (7-day avg)',
    trend: 'down',
    hint: 'Steps below 1,200 / day. Was 8,400 baseline.',
  },
  {
    id: 'baby-logs',
    label: 'Baby logs',
    value: 'None for 5 days',
    trend: 'flat',
    hint: 'No feeds, diapers, or sleep entries since Sunday.',
  },
  {
    id: 'app-opens',
    label: 'App opens',
    value: 'None for 4 days',
    trend: 'flat',
    hint: 'Last opened at 2:14 AM on Monday.',
  },
];

function TrendGlyph({ trend }: { trend: SilenceSignal['trend'] }) {
  if (trend === 'down') return <Text style={[styles.trend, styles.trendDown]}>↓</Text>;
  if (trend === 'up') return <Text style={[styles.trend, styles.trendUp]}>↑</Text>;
  return <Text style={[styles.trend, styles.trendFlat]}>·</Text>;
}

export default function JaneSilenceScreen() {
  const state = useDemoState();
  const signals = state.silenceSignals?.length ? state.silenceSignals : FALLBACK_SIGNALS;
  const name = state.name ?? 'Jane';

  const openCheckIn = () => {
    router.push('/chat?mode=proactive&persona=jane');
  };

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={close}
          hitSlop={12}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Text style={styles.backText}>← Home</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Check-in</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.companionWrap}>
            <Companion size={72} mood="lean-in" />
          </View>

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>Cocuna noticed</Text>
            <Text style={styles.headline}>
              It&rsquo;s been quiet for a few days, {name}.
            </Text>
            <Text style={styles.note}>
              No pressure. We just wanted to check in on you.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Last 7 days</Text>
            <View style={styles.cardStack}>
              {signals.map((s) => (
                <View key={s.id} style={styles.signalCard}>
                  <View style={styles.signalHead}>
                    <Text style={styles.signalLabel}>{s.label}</Text>
                    <TrendGlyph trend={s.trend} />
                  </View>
                  <Text style={styles.signalValue}>{s.value}</Text>
                  <Text style={styles.signalHint}>{s.hint}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.disclosure}>
            <Text style={styles.disclosureText}>
              These are signals — not a diagnosis. A short check-in helps your
              clinic see how you&rsquo;re really doing.
            </Text>
          </View>

          <PastelCTA
            label="Open check-in"
            caption="A few short questions. Under two minutes."
            onPress={openCheckIn}
            tone="peach"
          />

          <Pressable
            onPress={close}
            style={({ pressed }) => [styles.notNow, pressed && styles.pressed]}
          >
            <Text style={styles.notNowText}>Not now</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cocuna.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Cocuna.hairlineSoft,
    backgroundColor: Cocuna.bg,
  },
  back: { paddingVertical: 8, width: 60 },
  backText: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 13,
    color: Cocuna.textMuted,
  },
  headerTitle: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 15,
    color: Cocuna.text,
  },
  pressed: { opacity: 0.65 },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    paddingTop: Spacing.three,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  companionWrap: {
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  intro: {
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    ...Type.caption,
    color: Cocuna.textMuted,
  },
  headline: {
    fontFamily: FontStack.display,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
    color: Cocuna.text,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  note: {
    ...Type.body,
    color: Cocuna.textMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
  section: { gap: 10 },
  sectionLabel: {
    ...Type.caption,
    color: Cocuna.textMuted,
  },
  cardStack: {
    gap: 10,
  },
  signalCard: {
    backgroundColor: Cocuna.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Cocuna.hairlineSoft,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  signalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signalLabel: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 14,
    color: Cocuna.text,
  },
  signalValue: {
    fontFamily: FontStack.body,
    fontSize: 15,
    color: Cocuna.text,
  },
  signalHint: {
    fontFamily: FontStack.body,
    fontSize: 12,
    color: Cocuna.textMuted,
    lineHeight: 17,
  },
  trend: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 16,
  },
  trendDown: { color: Cocuna.peachDeep },
  trendUp: { color: Cocuna.mintDeep },
  trendFlat: { color: Cocuna.textFaint, fontSize: 18 },
  disclosure: {
    backgroundColor: Cocuna.surfaceSunken,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  disclosureText: {
    fontFamily: FontStack.body,
    fontSize: 13,
    lineHeight: 19,
    color: Cocuna.textMuted,
  },
  notNow: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  notNowText: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 13,
    color: Cocuna.textFaint,
  },
});

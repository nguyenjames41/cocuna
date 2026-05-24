import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckInRow, type CheckInOption } from '@/components/CheckInRow';
import { LogChip } from '@/components/LogChip';
import { PastelCTA } from '@/components/PastelCTA';
import { PersonaIllustration } from '@/components/PersonaIllustration';
import {
  Cocuna,
  FontStack,
  MaxContentWidth,
  Radius,
  Spacing,
  Type,
} from '@/constants/theme';
import {
  cycleDemoPersona,
  isPregnancy,
  logToday,
  nextPersonaLabel,
  useDemoState,
  type LogKind,
} from '@/lib/demo-state';

const POSTPARTUM_LOGS: { kind: LogKind; label: string }[] = [
  { kind: 'bp', label: 'Log BP' },
  { kind: 'mood', label: 'Log mood' },
  { kind: 'feeding', label: 'Log feeding' },
  { kind: 'diapers', label: 'Log diapers' },
];

const PREGNANCY_LOGS: { kind: LogKind; label: string }[] = [
  { kind: 'kicks', label: 'Kick counts' },
  { kind: 'bp', label: 'Log BP' },
  { kind: 'glucose', label: 'Log glucose' },
  { kind: 'mood', label: 'Log mood' },
];

// 3 check-in dimensions ported from the Aurora design — Mood / Energy / Pain.
// Each option pairs a face variant with a pastel from the brand palette.
const MOOD_OPTIONS: CheckInOption[] = [
  { face: 'cry', label: 'Low', bg: '#E4D4EB', idx: 0 },
  { face: 'glum', label: 'OK', bg: '#F5E4B0', idx: 1 },
  { face: 'smile', label: 'Good', bg: '#D4E8DC', idx: 2 },
  { face: 'soft', label: 'Soft', bg: '#F8D9C5', idx: 3 },
  { face: 'sparkle', label: 'Bright', bg: '#F3D7DC', idx: 4 },
];
const ENERGY_OPTIONS: CheckInOption[] = [
  { face: 'dead', label: 'Empty', bg: '#E5E0D6', idx: 5 },
  { face: 'sleepy', label: 'Low', bg: '#E4D4EB', idx: 0 },
  { face: 'neutral', label: 'OK', bg: '#F5E4B0', idx: 1 },
  { face: 'soft', label: 'Lifted', bg: '#D4E8DC', idx: 2 },
  { face: 'beam', label: 'Sunny', bg: '#F8D9C5', idx: 3 },
];
const PAIN_OPTIONS: CheckInOption[] = [
  { face: 'smile', label: 'None', bg: '#D4E8DC', idx: 4 },
  { face: 'soft', label: 'Mild', bg: '#F5E4B0', idx: 5 },
  { face: 'wince', label: 'Some', bg: '#F8D9C5', idx: 0 },
  { face: 'ouch', label: 'High', bg: '#F3D7DC', idx: 1 },
  { face: 'severe', label: 'Severe', bg: '#F0B4B4', idx: 2 },
];

function greetingFor(hour: number) {
  if (hour < 5) return 'It’s late';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 22) return 'Good evening';
  return 'Quiet hours';
}

function stageLine(state: ReturnType<typeof useDemoState>) {
  if (state.stage === 'pregnant') {
    return `You’re ${state.weeksPregnant} weeks pregnant.`;
  }
  if (state.stage === 'postpartum') {
    const weeks = Math.floor(state.daysPostpartum / 7);
    return weeks >= 4
      ? `You’re ${weeks} weeks postpartum.`
      : `You’re ${state.daysPostpartum} days postpartum.`;
  }
  if (state.stage === 'toddler') return `Baby is ${Math.floor(state.babyAgeDays / 30)} months old.`;
  return 'Welcome to Cocuna.';
}

function supportiveNote(state: ReturnType<typeof useDemoState>) {
  if (state.stage === 'pregnant') {
    return 'Third trimester is heavy work. Hydrate, count kicks, and sit when you can.';
  }
  if (state.stage === 'postpartum') {
    const weeks = Math.floor(state.daysPostpartum / 7);
    return weeks >= 4
      ? 'You’ve come a long way. The 6 week visit is coming up. We’ll get you ready.'
      : 'Your body’s still doing big work. Rest when you can.';
  }
  return 'We’re here whenever you need us.';
}

type Pending = {
  label: string;
  hint: string;
  cta?: string;
  action: () => void;
};

function pendingAction(state: ReturnType<typeof useDemoState>): Pending | null {
  // Maria — gentle headache prompt that telegraphs the scripted demo flow.
  if (state.persona === 'maria') {
    return {
      label: 'How’s the headache?',
      hint: 'You logged it earlier. Hera can take a closer look in under a minute.',
      cta: 'Tell Hera',
      action: () => router.push('/chat'),
    };
  }
  if (state.stage === 'pregnant') {
    if (!state.logsToday.includes('kicks')) {
      return {
        label: 'Count baby’s kicks',
        hint: 'Aim for 10 movements in 2 hours. We’ll time it with you.',
        action: () => logToday('kicks'),
      };
    }
    if (!state.logsToday.includes('glucose')) {
      return {
        label: 'Log this morning’s glucose',
        hint: 'Fasting reading, before breakfast. Under 15 seconds.',
        action: () => logToday('glucose'),
      };
    }
    return null;
  }
  if (!state.logsToday.includes('mood')) {
    return {
      label: 'How are you feeling today?',
      hint: 'Under 15 seconds. No right answer.',
      action: () => logToday('mood'),
    };
  }
  if (!state.logsToday.includes('feeding')) {
    return {
      label: 'Note a feed when you have a moment',
      hint: 'Helps your clinic see the rhythm.',
      action: () => logToday('feeding'),
    };
  }
  return null;
}

export default function HomeScreen() {
  const state = useDemoState();
  const greeting = greetingFor(new Date().getHours());
  const pending = pendingAction(state);
  const logs = isPregnancy(state) ? PREGNANCY_LOGS : POSTPARTUM_LOGS;
  const isJane = state.persona === 'jane';
  const isMaria = state.persona === 'maria';
  // Aurora persona illustration — Maria=womb baby, Jane=happy 3-month Lila,
  // others fall back to Maria so the hero never reads empty in demo flows.
  const illustrationPersona: 'maria' | 'jane' = isJane ? 'jane' : 'maria';

  // 3 check-ins (mood, energy, pain). Local UI state for the demo —
  // taps are not persisted, this is a visual / story beat.
  const [checkin, setCheckin] = useState<{
    mood: number | null;
    energy: number | null;
    pain: number | null;
  }>({ mood: null, energy: null, pain: null });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.greetingBlock}>
            <Text style={styles.eyebrow}>{greeting}</Text>
            <Text style={styles.name}>{state.name ? `${state.name}.` : 'Mom.'}</Text>
            <Text style={styles.stage}>{stageLine(state)}</Text>
            <Text style={[styles.note, isJane && styles.noteDim]}>
              {supportiveNote(state)}
            </Text>
          </View>

          <View style={styles.illustrationWrap}>
            <PersonaIllustration persona={illustrationPersona} size={200} />
          </View>

          <PastelCTA
            label="Ask Cocuna"
            caption={
              isPregnancy(state)
                ? 'Anything about pregnancy. We’ll route you to the right care.'
                : 'Tell us what’s happening. We’ll route you to the right care.'
            }
            onPress={() => router.push('/chat')}
            tone="peach"
          />

          {isJane ? (
            // Jane's "silence" surface — single soft card replacing the
            // usual pending log. Telegraphs that Cocuna noticed without
            // shouting at her.
            <Pressable
              onPress={() => router.push('/jane-silence')}
              style={({ pressed }) => [
                styles.silenceCard,
                pressed && styles.pendingCtaPressed,
              ]}
            >
              <View style={styles.pendingHeadRow}>
                <View style={styles.silenceDot} />
                <Text style={styles.pendingLabel}>It’s been quiet</Text>
              </View>
              <Text style={styles.pendingHint}>
                A few signals have shifted this week. No pressure. We just want to check in.
              </Text>
              <View style={styles.pendingCta}>
                <Text style={styles.pendingCtaText}>Open check-in →</Text>
              </View>
            </Pressable>
          ) : pending ? (
            // Maria's "How's the headache?" card uses rose — the gentle/
            // supportive tone per DESIGN.md. Signals "this matters" without
            // the alarm a triage-red fill would carry, and doesn't double
            // up on peach (reserved for Ask Cocuna above).
            <View style={[styles.pending, isMaria && styles.pendingRose]}>
              <View style={styles.pendingHeadRow}>
                <View style={[styles.pendingDot, isMaria && styles.pendingDotRose]} />
                <Text style={styles.pendingLabel}>{pending.label}</Text>
              </View>
              <Text style={styles.pendingHint}>{pending.hint}</Text>
              <Pressable
                onPress={pending.action}
                style={({ pressed }) => [
                  styles.pendingCta,
                  pressed && styles.pendingCtaPressed,
                ]}
              >
                <Text style={styles.pendingCtaText}>{pending.cta ?? 'Mark done'}</Text>
              </Pressable>
            </View>
          ) : null}

          {/* 3 check-ins (Aurora) — Mood / Energy / Pain, animated blob chips. */}
          <View style={styles.checkinSection}>
            <Text style={styles.sectionLabel}>A small check in</Text>
            <CheckInRow
              label="Mood"
              options={MOOD_OPTIONS}
              value={checkin.mood}
              onChange={(v) => setCheckin({ ...checkin, mood: v })}
            />
            <CheckInRow
              label="Energy"
              options={ENERGY_OPTIONS}
              value={checkin.energy}
              onChange={(v) => setCheckin({ ...checkin, energy: v })}
            />
            <CheckInRow
              label="Pain"
              options={PAIN_OPTIONS}
              value={checkin.pain}
              onChange={(v) => setCheckin({ ...checkin, pain: v })}
            />
          </View>

          <View style={styles.logSection}>
            <Text style={styles.sectionLabel}>Quick log</Text>
            <View style={styles.chipRow}>
              {logs.map((l) => (
                <LogChip
                  key={l.kind}
                  label={l.label}
                  done={state.logsToday.includes(l.kind)}
                  onPress={() => logToday(l.kind)}
                />
              ))}
            </View>
          </View>

          <View style={styles.footerRow}>
            <Pressable
              onPress={() => router.push('/care-plan')}
              style={({ pressed }) => [styles.footerLink, pressed && styles.footerLinkPressed]}
            >
              <Text style={styles.footerLinkText}>Care plan</Text>
            </Pressable>
            <View style={styles.footerDivider} />
            <Pressable
              onPress={() => router.push('/companion')}
              style={({ pressed }) => [styles.footerLink, pressed && styles.footerLinkPressed]}
            >
              <Text style={styles.footerLinkText}>Companion</Text>
            </Pressable>
          </View>

          <Text style={styles.checkin}>Next check-in · {state.nextCheckin}</Text>

          <Pressable
            onPress={() => cycleDemoPersona()}
            style={({ pressed }) => [styles.demoSwitch, pressed && styles.demoSwitchPressed]}
          >
            <Text style={styles.demoSwitchEyebrow}>Demo</Text>
            <Text style={styles.demoSwitchText}>
              Switch to {nextPersonaLabel(state.stageDemo)} →
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cocuna.bg },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  greetingBlock: {
    gap: 6,
    paddingTop: Spacing.three,
    paddingBottom: 4,
  },
  eyebrow: {
    ...Type.caption,
    color: Cocuna.textMuted,
  },
  name: {
    fontFamily: FontStack.display,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.7,
    color: Cocuna.text,
  },
  stage: {
    fontFamily: FontStack.displayMedium,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: Cocuna.text,
    paddingTop: 2,
  },
  note: {
    ...Type.body,
    color: Cocuna.textMuted,
    paddingTop: 6,
    maxWidth: 360,
  },
  // Dimmed when persona is "jane" — telegraphs the silence visually.
  noteDim: {
    opacity: 0.55,
  },
  // Aurora persona illustration — center hero (WombBaby / HappyBaby).
  illustrationWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  // 3 animated check-ins block.
  checkinSection: { gap: 14 },
  pending: {
    backgroundColor: Cocuna.lavender,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 6,
  },
  // Maria's variant — rose telegraphs "gentle but matters" without
  // doubling up on the peach Ask Cocuna CTA above.
  pendingRose: {
    backgroundColor: Cocuna.rose,
  },
  // Jane's quiet check-in card. Same shape as `pending` but a more
  // subdued surface and a slightly softer dot color so it doesn't read
  // as an alarm. A soft peach hairline draws the eye without shouting.
  silenceCard: {
    backgroundColor: Cocuna.surfaceSunken,
    borderRadius: Radius.lg,
    borderWidth: 1,
    // Soft peach hairline — draws the eye without shouting. The surface
    // stays sunken (the "silence" register), the hairline is the only
    // warmth in the card.
    borderColor: 'rgba(237, 185, 155, 0.55)',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 6,
  },
  silenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Cocuna.peachDeep,
  },
  pendingHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Cocuna.lavenderDeep,
  },
  pendingDotRose: {
    backgroundColor: Cocuna.roseDeep,
  },
  pendingLabel: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 14,
    color: Cocuna.text,
  },
  pendingHint: {
    fontFamily: FontStack.body,
    fontSize: 12,
    color: Cocuna.text,
    opacity: 0.7,
  },
  pendingCta: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    backgroundColor: Cocuna.surface,
  },
  pendingCtaPressed: { opacity: 0.7 },
  pendingCtaText: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 12,
    color: Cocuna.text,
  },
  logSection: { gap: 10 },
  sectionLabel: {
    ...Type.caption,
    color: Cocuna.textMuted,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingTop: Spacing.two,
  },
  footerLink: { paddingVertical: 8, paddingHorizontal: 6 },
  footerLinkPressed: { opacity: 0.6 },
  footerLinkText: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 13,
    color: Cocuna.text,
  },
  footerDivider: {
    width: 1,
    height: 14,
    backgroundColor: Cocuna.hairline,
  },
  checkin: {
    fontFamily: FontStack.body,
    fontSize: 12,
    color: Cocuna.textFaint,
    textAlign: 'center',
  },
  demoSwitch: {
    marginTop: Spacing.four,
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Cocuna.hairline,
    borderStyle: 'dashed',
    gap: 2,
  },
  demoSwitchPressed: { opacity: 0.6 },
  demoSwitchEyebrow: {
    ...Type.caption,
    fontSize: 9,
    color: Cocuna.textFaint,
  },
  demoSwitchText: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 12,
    color: Cocuna.textMuted,
  },
});

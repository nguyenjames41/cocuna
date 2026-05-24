import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Companion } from '@/components/Companion';
import { LogChip } from '@/components/LogChip';
import { PastelCTA } from '@/components/PastelCTA';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Cocuna,
  FontStack,
  MaxContentWidth,
  Radius,
  Spacing,
  Type,
} from '@/constants/theme';
import {
  isPregnancy,
  logToday,
  switchStageDemo,
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

function pendingAction(state: ReturnType<typeof useDemoState>) {
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
            <Text style={styles.note}>{supportiveNote(state)}</Text>
          </View>

          <View style={styles.companionWrap}>
            <Companion size={88} mood="calm" />
          </View>

          <View style={styles.statusRow}>
            <StatusBadge label="Mom" level={state.momStatus} />
            <StatusBadge label={state.babyStatusLabel} level={state.babyStatus} />
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

          {pending ? (
            <View style={styles.pending}>
              <View style={styles.pendingHeadRow}>
                <View style={styles.pendingDot} />
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
                <Text style={styles.pendingCtaText}>Mark done</Text>
              </Pressable>
            </View>
          ) : null}

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
            onPress={() => switchStageDemo()}
            style={({ pressed }) => [styles.demoSwitch, pressed && styles.demoSwitchPressed]}
          >
            <Text style={styles.demoSwitchEyebrow}>Demo</Text>
            <Text style={styles.demoSwitchText}>
              Switch to {isPregnancy(state) ? 'postpartum 6wk' : 'pregnancy 28wk'} →
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
  companionWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  pending: {
    backgroundColor: Cocuna.lavender,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 6,
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

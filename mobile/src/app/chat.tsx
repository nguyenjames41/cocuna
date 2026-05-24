import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/ChatBubble';
import { CocunaSay } from '@/components/CocunaSay';
import { FollowupCard } from '@/components/FollowupCard';
import { ResultCard } from '@/components/ResultCard';
import {
  Cocuna,
  FontStack,
  MaxContentWidth,
  Radius,
  Spacing,
  Type,
} from '@/constants/theme';
import {
  askCocuna,
  type ChatMessage,
  type FollowupQuestion,
} from '@/lib/claude';
import { isPregnancy, useDemoState } from '@/lib/demo-state';
import { persistTriageDecision } from '@/lib/persistence';
import type { TriageDecision } from '@/lib/triage';

const OPENER =
  'Hello Mom. I’m Hera. Tell me what is happening — I’m here to take care of you.';

const PREGNANCY_QUICK_STARTS = [
  {
    id: 'fetal-movement',
    label: 'Decreased fetal movement',
    seed: 'I’m 28 weeks. Baby has been much quieter than usual today. I’ve only felt a few small movements all afternoon.',
  },
  {
    id: 'preeclampsia',
    label: 'Headache + swelling',
    seed: 'I’m 28 weeks pregnant. I have a bad headache, my face is puffy, and I’m seeing spots. BP at home was 152/98.',
  },
  {
    id: 'contractions',
    label: 'Contractions before term',
    seed: 'I’m 28 weeks. I’ve had 6 painful contractions in the last hour. They’re getting stronger.',
  },
];

const POSTPARTUM_QUICK_STARTS = [
  {
    id: 'pp-htn',
    label: 'Postpartum BP concern',
    seed: 'I’m 6 weeks postpartum. I have a bad headache and I’m seeing spots. My blood pressure is 158/102.',
  },
  {
    id: 'baby-fever',
    label: 'Baby fever',
    seed: 'My 6-week-old baby has a temperature of 100.5°F.',
  },
  {
    id: 'mental',
    label: 'Mental health',
    seed: 'I cry every day, I feel detached from my baby, and I can’t sleep even when the baby sleeps.',
  },
];

type Turn =
  | { kind: 'user'; text: string }
  | { kind: 'cocuna'; text: string }
  | { kind: 'followup'; question: FollowupQuestion }
  | { kind: 'result'; decision: TriageDecision };

export default function ChatScreen() {
  const state = useDemoState();
  const quickStarts = isPregnancy(state) ? PREGNANCY_QUICK_STARTS : POSTPARTUM_QUICK_STARTS;

  const [turns, setTurns] = useState<Turn[]>([
    { kind: 'cocuna', text: OPENER },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns, thinking]);

  const messagesForApi = (extraUser?: string): ChatMessage[] => {
    const msgs: ChatMessage[] = [];
    for (const t of turns) {
      if (t.kind === 'user') msgs.push({ role: 'user', content: t.text });
      if (t.kind === 'cocuna') msgs.push({ role: 'assistant', content: t.text });
    }
    if (extraUser) msgs.push({ role: 'user', content: extraUser });
    return msgs;
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setShowQuickStart(false);
    setInput('');
    const next: Turn[] = [
      ...turns.filter((t) => t.kind !== 'followup'),
      { kind: 'user', text: trimmed },
    ];
    setTurns(next);
    setThinking(true);

    const stageDetail = isPregnancy(state)
      ? `${state.weeksPregnant} weeks pregnant`
      : `${state.daysPostpartum} days postpartum`;

    const response = await askCocuna(messagesForApi(trimmed), {
      stage: state.stageDemo,
      stageDetail,
    });

    const after: Turn[] = [
      ...next,
      { kind: 'cocuna', text: response.acknowledgement },
    ];
    if (response.decision) {
      after.push({ kind: 'result', decision: response.decision });
      // Fire-and-forget persistence so the clinic queue can pick it up.
      void persistTriageDecision(response.decision, trimmed, stageDetail);
    } else if (response.followup) {
      after.push({ kind: 'followup', question: response.followup });
    }
    setTurns(after);
    setThinking(false);
  };

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.grabber} />
        <View style={styles.headerRow}>
          <View style={{ width: 60 }} />
          <Text style={styles.headerTitle}>Ask Cocuna</Text>
          <Pressable
            onPress={close}
            hitSlop={12}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          <View style={styles.thread}>
            {turns.map((t, i) => {
              if (t.kind === 'user') return <ChatBubble key={i} text={t.text} />;
              if (t.kind === 'cocuna') return <CocunaSay key={i} text={t.text} />;
              if (t.kind === 'followup')
                return (
                  <FollowupCard
                    key={i}
                    question={t.question}
                    onAnswer={(label) => send(label)}
                  />
                );
              if (t.kind === 'result')
                return (
                  <ResultCard
                    key={i}
                    decision={t.decision}
                    onOpenCarePlan={() => router.push('/care-plan')}
                  />
                );
              return null;
            })}

            {thinking ? (
              <View style={styles.thinkingRow}>
                <View style={styles.thinkingDots}>
                  <View style={styles.dot} />
                  <View style={[styles.dot, styles.dotMid]} />
                  <View style={styles.dot} />
                </View>
                <Text style={styles.thinkingText}>Hera is thinking…</Text>
              </View>
            ) : null}

            {showQuickStart && turns.length === 1 ? (
              <View style={styles.quickStartWrap}>
                <Text style={styles.quickStartLabel}>Demo flows</Text>
                <View style={styles.quickStartRow}>
                  {quickStarts.map((q) => (
                    <Pressable
                      key={q.id}
                      onPress={() => send(q.seed)}
                      style={({ pressed }) => [
                        styles.quickStart,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.quickStartText}>{q.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Tell Cocuna what’s happening…"
            placeholderTextColor={Cocuna.textFaint}
            style={styles.input}
            multiline
            onSubmitEditing={() => send(input)}
            blurOnSubmit
          />
          <Pressable
            onPress={() => send(input)}
            disabled={!input.trim() || thinking}
            style={({ pressed }) => [
              styles.send,
              (!input.trim() || thinking) && styles.sendDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.sendGlyph}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cocuna.bg },
  flex: { flex: 1 },
  header: {
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Cocuna.hairlineSoft,
    backgroundColor: Cocuna.bg,
    gap: 8,
  },
  grabber: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Cocuna.hairline,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 15,
    color: Cocuna.text,
  },
  close: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    width: 60,
    alignItems: 'flex-end',
  },
  closeText: {
    ...Type.smallMedium,
    color: Cocuna.textMuted,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
  },
  thread: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  thinkingDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Cocuna.textMuted,
    opacity: 0.45,
  },
  dotMid: { opacity: 0.85 },
  thinkingText: {
    ...Type.small,
    color: Cocuna.textFaint,
  },
  quickStartWrap: { gap: 10, paddingTop: Spacing.three },
  quickStartLabel: {
    ...Type.caption,
    color: Cocuna.textMuted,
  },
  quickStartRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickStart: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Cocuna.hairline,
    backgroundColor: Cocuna.surface,
  },
  quickStartText: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 13,
    color: Cocuna.text,
  },
  pressed: { opacity: 0.65 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Spacing.three,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 8 : 14,
    borderTopWidth: 1,
    borderTopColor: Cocuna.hairlineSoft,
    backgroundColor: Cocuna.bg,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    backgroundColor: Cocuna.surface,
    borderWidth: 1,
    borderColor: Cocuna.hairline,
    fontFamily: FontStack.body,
    fontSize: 15,
    color: Cocuna.text,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Cocuna.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.35 },
  sendGlyph: {
    color: Cocuna.bg,
    fontSize: 20,
    fontFamily: FontStack.bodySemibold,
  },
});

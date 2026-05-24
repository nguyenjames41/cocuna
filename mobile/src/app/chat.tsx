import { router, useLocalSearchParams } from 'expo-router';
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
import { Companion, type HeraMood } from '@/components/Companion';
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
  JANE_PUSH_NOTIFICATION,
  JANE_SCRIPT,
  JANE_SEED_PROMPT,
  MARIA_SEED_PROMPT,
  matchScriptedResponse,
} from '@/demo-data';
import {
  askCocuna,
  type ChatMessage,
  type FollowupQuestion,
} from '@/lib/claude';
import { isPregnancy, useDemoState } from '@/lib/demo-state';
import { persistTriageDecision } from '@/lib/persistence';
import type { TriageDecision } from '@/lib/triage';

const OPENER =
  'Hello Mom. I’m Hera. Tell me what is happening. I’m here to take care of you.';

// First entry in each list seeds the scripted Maria / Jane demo path — its
// `seed` MUST match the canonical seed prompt so matchScriptedResponse() hits.
// The other two seeds remain live-Anthropic flavor.
const PREGNANCY_QUICK_STARTS = [
  {
    id: 'maria-preeclampsia',
    label: 'Headache + vision + swelling',
    seed: MARIA_SEED_PROMPT,
  },
  {
    id: 'fetal-movement',
    label: 'Decreased fetal movement',
    seed: 'I’m 28 weeks. Baby has been much quieter than usual today. I’ve only felt a few small movements all afternoon.',
  },
  {
    id: 'contractions',
    label: 'Contractions before term',
    seed: 'I’m 28 weeks. I’ve had 6 painful contractions in the last hour. They’re getting stronger.',
  },
];

const POSTPARTUM_QUICK_STARTS = [
  {
    id: 'jane-proactive',
    label: 'Cocuna check-in',
    seed: JANE_SEED_PROMPT,
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

/**
 * Pre-seed the chat with Jane's push + the opener of her scripted safety
 * screen. The first scripted turn ("jane-turn-0") carries both the
 * acknowledgement Hera says when the push is tapped AND the first followup
 * card — we surface them as two turns so the thread reads like a real
 * proactive reach-out.
 */
function buildJaneProactiveInitial(): Turn[] {
  const turn0 = JANE_SCRIPT.find((t) => t.id === 'jane-turn-0');
  const turns: Turn[] = [
    { kind: 'cocuna', text: JANE_PUSH_NOTIFICATION },
  ];
  if (turn0) {
    turns.push({ kind: 'cocuna', text: turn0.response.acknowledgement });
    if (turn0.response.followup) {
      turns.push({ kind: 'followup', question: turn0.response.followup });
    }
  }
  return turns;
}

export default function ChatScreen() {
  const state = useDemoState();
  const params = useLocalSearchParams<{ mode?: string; persona?: string }>();
  const isProactiveJane =
    params.mode === 'proactive' && params.persona === 'jane';

  const quickStarts = isPregnancy(state) ? PREGNANCY_QUICK_STARTS : POSTPARTUM_QUICK_STARTS;

  // Proactive mode pre-seeds the thread with the Jane push + opening question.
  // Computed once at mount; URL params are stable for the life of the modal.
  const initialTurns: Turn[] = isProactiveJane
    ? buildJaneProactiveInitial()
    : [{ kind: 'cocuna', text: OPENER }];

  const [turns, setTurns] = useState<Turn[]>(initialTurns);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(!isProactiveJane);
  const [mood, setMood] = useState<HeraMood>(
    isProactiveJane ? 'lean-in' : 'attentive',
  );
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

  const applyMoodFromDecision = (decision: TriageDecision) => {
    if (decision.level === 'red') setMood('lean-in');
    else if (decision.level === 'green') setMood('milestone');
    else setMood('attentive');
  };

  /**
   * `send` is called both for free-text user messages AND for followup option
   * taps. When it's a followup option, `optionId` is passed and matched
   * against the scripted demo path before any network call.
   */
  const send = async (text: string, optionId?: string) => {
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

    // 1) Try scripted demo path first. If matched, fake a brief thinking
    //    delay so it doesn't feel instant — Hera should look like she's
    //    weighing the answer.
    const scripted = matchScriptedResponse({
      lastUserMessage: trimmed,
      lastFollowupOptionId: optionId,
      history: messagesForApi(trimmed),
    });

    let response;
    if (scripted) {
      await new Promise((r) => setTimeout(r, 600));
      response = scripted;
    } else {
      // 2) Fall through to the live Edge Function (which itself falls back
      //    to mock if Supabase is unreachable).
      response = await askCocuna(messagesForApi(trimmed), {
        stage: state.stage,
        stageDetail,
      });
    }

    const after: Turn[] = [
      ...next,
      { kind: 'cocuna', text: response.acknowledgement },
    ];
    if (response.decision) {
      after.push({ kind: 'result', decision: response.decision });
      applyMoodFromDecision(response.decision);
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
          <View style={styles.titleBlock}>
            <View style={styles.companionSlot}>
              <Companion size={48} mood={mood} introPulse={false} />
            </View>
            <Text style={styles.headerTitle}>Hera</Text>
          </View>
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
                    onAnswer={(label, id) => send(label, id)}
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
    paddingBottom: 10,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Cocuna.hairlineSoft,
    backgroundColor: Cocuna.bg,
    gap: 6,
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
  titleBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  // Companion frame inflates beyond its `size` (~1.7x for the glow halo);
  // clamp it visually so the header doesn't grow taller than other modal
  // headers while still giving Hera room to breathe.
  companionSlot: {
    width: 56,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerTitle: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 13,
    letterSpacing: 0.2,
    color: Cocuna.textMuted,
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

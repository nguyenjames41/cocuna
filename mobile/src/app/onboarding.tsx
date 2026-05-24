import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/Logo';
import { PastelCTA } from '@/components/PastelCTA';
import {
  Cocuna,
  FontStack,
  MaxContentWidth,
  Radius,
  Spacing,
  Type,
} from '@/constants/theme';
import { completeOnboarding } from '@/lib/demo-state';
import type { Stage } from '@/lib/triage';

type Step = 'name' | 'stage';

const STAGES: { id: Stage; label: string; hint: string }[] = [
  { id: 'ttc', label: 'Trying to conceive', hint: 'Tracking, questions, hopes.' },
  { id: 'pregnant', label: 'Pregnant', hint: 'First, second, third — we’ll meet you there.' },
  { id: 'postpartum', label: 'Postpartum', hint: 'Recovery and the early weeks.' },
  { id: 'toddler', label: 'Parenting a toddler', hint: 'Older than 12 months.' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [stage, setStage] = useState<Stage | null>(null);

  const finish = (s: Stage) => {
    completeOnboarding(name.trim() || 'Mom', s);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <View style={styles.heroWrap}>
            <Logo size={96} withWordmark />
          </View>

          {step === 'name' ? (
            <View style={styles.block}>
              <Text style={styles.eyebrow}>Welcome</Text>
              <Text style={styles.title}>What can we call you?</Text>
              <Text style={styles.lede}>
                Used in greetings and nowhere else. You can change it any time.
              </Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your first name"
                placeholderTextColor={Cocuna.textFaint}
                autoFocus
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => setStep('stage')}
                style={styles.input}
              />

              <PastelCTA label="Continue" size="md" onPress={() => setStep('stage')} tone="peach" />

              <Pressable
                onPress={() => setStep('stage')}
                hitSlop={8}
                style={({ pressed }) => [styles.skip, pressed && styles.pressed]}
              >
                <Text style={styles.skipText}>Skip — pick this later</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.block}>
              <Text style={styles.eyebrow}>Where are you?</Text>
              <Text style={styles.title}>So we land in the right place.</Text>
              <Text style={styles.lede}>
                The home screen, the chat tone, the warning signs — all shift to match your stage.
              </Text>

              <View style={styles.stageList}>
                {STAGES.map((s) => {
                  const active = stage === s.id;
                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => setStage(s.id)}
                      style={({ pressed }) => [
                        styles.stageRow,
                        active && styles.stageRowActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={[styles.stageDot, active && styles.stageDotActive]}>
                        {active ? <View style={styles.stageDotInner} /> : null}
                      </View>
                      <View style={styles.stageText}>
                        <Text style={styles.stageLabel}>{s.label}</Text>
                        <Text style={styles.stageHint}>{s.hint}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ opacity: stage ? 1 : 0.4 }}>
                <PastelCTA
                  label="Enter Cocuna"
                  size="md"
                  onPress={() => (stage ? finish(stage) : null)}
                  tone="peach"
                />
              </View>

              <Pressable
                onPress={() => setStep('name')}
                hitSlop={8}
                style={({ pressed }) => [styles.skip, pressed && styles.pressed]}
              >
                <Text style={styles.skipText}>← Back</Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cocuna.bg },
  flex: { flex: 1 },
  content: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  heroWrap: { alignItems: 'center' },
  block: { gap: Spacing.three },
  eyebrow: { ...Type.caption, color: Cocuna.textMuted },
  title: {
    fontFamily: FontStack.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: Cocuna.text,
  },
  lede: { ...Type.body, color: Cocuna.textMuted },
  input: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Cocuna.surface,
    borderWidth: 1,
    borderColor: Cocuna.hairline,
    fontFamily: FontStack.body,
    fontSize: 17,
    color: Cocuna.text,
  },
  pressed: { opacity: 0.65 },
  skip: { alignSelf: 'center', paddingVertical: 10 },
  skipText: { ...Type.smallMedium, color: Cocuna.textMuted },
  stageList: { gap: 10 },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: Radius.md,
    backgroundColor: Cocuna.surface,
    borderWidth: 1,
    borderColor: Cocuna.hairlineSoft,
  },
  stageRowActive: {
    borderColor: Cocuna.lavenderDeep,
    backgroundColor: Cocuna.lavender,
  },
  stageDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Cocuna.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDotActive: {
    borderColor: Cocuna.lavenderDeep,
  },
  stageDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Cocuna.lavenderDeep,
  },
  stageText: { flex: 1, gap: 2 },
  stageLabel: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 15,
    color: Cocuna.text,
  },
  stageHint: {
    fontFamily: FontStack.body,
    fontSize: 13,
    color: Cocuna.textMuted,
  },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cocuna, FontStack, Radius } from '@/constants/theme';
import type { FollowupQuestion } from '@/lib/claude';

export function FollowupCard({
  question,
  onAnswer,
}: {
  question: FollowupQuestion;
  // Receives both the human label (for the chat transcript) and the option id
  // (used by the scripted demo path to route to the right scripted turn).
  onAnswer: (label: string, id?: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Quick follow-up</Text>
      <Text style={styles.question}>{question.question}</Text>
      {question.options ? (
        <View style={styles.options}>
          {question.options.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => onAnswer(opt.label, opt.id)}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
            >
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Cocuna.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Cocuna.hairlineSoft,
    padding: 18,
    gap: 12,
  },
  label: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 11,
    color: Cocuna.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  question: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
    color: Cocuna.text,
  },
  options: { gap: 8 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    backgroundColor: Cocuna.surfaceSunken,
    borderWidth: 1,
    borderColor: Cocuna.hairlineSoft,
  },
  optionPressed: { backgroundColor: Cocuna.lavender },
  optionLabel: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 15,
    color: Cocuna.text,
  },
});

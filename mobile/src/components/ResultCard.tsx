import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import {
  Cocuna,
  FontStack,
  Radius,
  Triage,
  TriageLabel,
} from '@/constants/theme';
import type { TriageDecision, TriageLevel } from '@/lib/triage';

const HEADLINE: Record<TriageLevel, string> = {
  red: 'Contact your clinic now',
  orange: 'Same day review',
  yellow: 'Schedule a clinic review',
  green: 'Steady. Self care.',
  gray: 'A human will review this',
};

const PROSE_LABEL: Record<TriageLevel, string> = {
  red: 'Urgent · emergency',
  orange: 'Needs clinical review',
  yellow: 'Needs support',
  green: 'Normal',
  gray: 'A clinician will review this',
};

export function ResultCard({
  decision,
  onOpenCarePlan,
}: {
  decision: TriageDecision;
  onOpenCarePlan?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notify, setNotify] = useState(decision.notifyClinic);
  const color = Triage[decision.level];
  const isRed = decision.level === 'red';

  return (
    <View style={styles.card}>
      {isRed ? (
        <LinearGradient
          colors={[Cocuna.lavender, Cocuna.mint]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.redEdge}
        />
      ) : null}

      <View style={styles.body}>
        <View style={styles.headRow}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={styles.headLabel}>{TriageLabel[decision.level]}</Text>
          <Text style={styles.headLabelDivider}>·</Text>
          <Text style={styles.headLabelProse}>{PROSE_LABEL[decision.level]}</Text>
        </View>

        <Text style={styles.headline}>{HEADLINE[decision.level]}</Text>
        <Text style={styles.reason}>{decision.reason}</Text>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What to do</Text>
          <Text style={styles.sectionBody}>{decision.recommendedAction}</Text>
        </View>

        {onOpenCarePlan ? (
          <Pressable
            onPress={onOpenCarePlan}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaText}>Open care plan</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>
        ) : null}

        <Pressable onPress={() => setExpanded((e) => !e)} style={styles.whyToggle}>
          <Text style={styles.whyToggleText}>
            {expanded ? '− Hide reasoning' : '+ Why this triage'}
          </Text>
        </Pressable>

        {expanded ? (
          <View style={styles.whyList}>
            {decision.contributions.map((c, i) => (
              <View key={i} style={styles.whyRow}>
                <Text style={styles.whyInput}>{c.input}</Text>
                <Text style={styles.whyReason}>{c.reason}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>When to escalate</Text>
          <Text style={styles.sectionBody}>{decision.whenToEscalate}</Text>
        </View>

        <View style={styles.notifyRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.notifyLabel}>Notify your clinic</Text>
            <Text style={styles.notifyHint}>
              {notify
                ? 'Your clinic will see this in their queue.'
                : 'Your clinic will not be notified.'}
            </Text>
          </View>
          <Switch
            value={notify}
            onValueChange={setNotify}
            trackColor={{ true: Cocuna.lavenderDeep, false: Cocuna.hairline }}
            thumbColor={Cocuna.surface}
          />
        </View>

        <Text style={styles.source}>{decision.sourceProtocol}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Cocuna.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Cocuna.hairlineSoft,
    overflow: 'hidden',
  },
  redEdge: { height: 3, width: '100%' },
  body: { padding: 20, gap: 12 },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  headLabel: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 11,
    color: Cocuna.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  headLabelDivider: {
    color: Cocuna.textFaint,
    fontSize: 11,
  },
  headLabelProse: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 11,
    color: Cocuna.textMuted,
    letterSpacing: 0.4,
  },
  headline: {
    fontFamily: FontStack.display,
    fontSize: 22,
    lineHeight: 28,
    color: Cocuna.text,
    letterSpacing: -0.3,
  },
  reason: {
    fontFamily: FontStack.body,
    fontSize: 15,
    lineHeight: 22,
    color: Cocuna.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Cocuna.hairlineSoft,
  },
  section: { gap: 4 },
  sectionLabel: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 11,
    color: Cocuna.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  sectionBody: {
    fontFamily: FontStack.body,
    fontSize: 14,
    lineHeight: 21,
    color: Cocuna.text,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    backgroundColor: Cocuna.peach,
  },
  ctaPressed: { opacity: 0.78 },
  ctaText: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 14,
    color: Cocuna.text,
  },
  ctaArrow: {
    fontFamily: FontStack.bodySemibold,
    color: Cocuna.text,
    fontSize: 16,
  },
  whyToggle: { paddingVertical: 4 },
  whyToggleText: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 13,
    color: Cocuna.textMuted,
  },
  whyList: { gap: 8 },
  whyRow: {
    backgroundColor: Cocuna.surfaceSunken,
    borderRadius: Radius.md,
    padding: 12,
    gap: 4,
  },
  whyInput: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 13,
    color: Cocuna.text,
  },
  whyReason: {
    fontFamily: FontStack.body,
    fontSize: 13,
    color: Cocuna.textMuted,
    lineHeight: 18,
  },
  notifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifyLabel: {
    fontFamily: FontStack.bodyMedium,
    fontSize: 14,
    color: Cocuna.text,
  },
  notifyHint: {
    fontFamily: FontStack.body,
    fontSize: 12,
    color: Cocuna.textMuted,
  },
  source: {
    fontFamily: FontStack.body,
    fontSize: 11,
    color: Cocuna.textFaint,
    paddingTop: 4,
  },
});

import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PastelCTA } from '@/components/PastelCTA';
import { Surface } from '@/components/Surface';
import {
  Cocuna,
  FontStack,
  MaxContentWidth,
  Radius,
  Spacing,
  Triage,
  Type,
} from '@/constants/theme';
import { isPregnancy, useDemoState } from '@/lib/demo-state';

type Item = { title: string; body: string };

const POSTPARTUM_TODAY: Item[] = [
  { title: 'Take your BP twice today', body: 'Morning and evening. Sit quietly for 5 minutes first.' },
  { title: 'Hydrate, about 2L through the day', body: 'Breastfeeding needs more. Sip slowly between feeds.' },
  { title: 'One restful window, no checking the phone', body: 'Even 20 minutes counts. The chores will keep.' },
];

const PREGNANCY_TODAY: Item[] = [
  { title: 'Count baby’s movements after lunch', body: 'Aim for 10 distinct movements within 2 hours. We’ll time it with you.' },
  { title: 'Glucose check at morning and after meals', body: 'Fasting plus 1 hour after each main meal. Log the numbers as you go.' },
  { title: 'Hydrate, about 2.5L through the day', body: 'Third trimester needs more fluid. Sip steady, not all at once.' },
];

const POSTPARTUM_WARNINGS = [
  'Severe headache that won’t go away',
  'Vision changes (spots, blurriness, light sensitivity)',
  'Chest pain, shortness of breath, or fainting',
  'Heavy bleeding (soaking a pad an hour)',
  'Fever ≥100.4°F (you or baby under 3 months)',
];

const PREGNANCY_WARNINGS = [
  'Decreased fetal movement (fewer than 10 movements in 2 hours)',
  'Severe headache, vision changes, or sudden swelling (preeclampsia)',
  'Vaginal bleeding or leaking fluid',
  'Painful contractions before 37 weeks',
  'Severe upper right abdominal pain',
];

const POSTPARTUM_EDU: Item[] = [
  {
    title: 'The 6 week postpartum visit, what to expect',
    body: 'Pelvic exam, contraception talk, mood screen, breastfeeding questions. We’ll prep a summary for you.',
  },
  {
    title: 'When the baby blues become something more',
    body: 'Persistent sadness after week 2 warrants a screen. We can run one in chat. Say the word.',
  },
  {
    title: 'Returning to activity',
    body: 'Most providers clear walking and gentle stretching by week 2; running and lifting by week 6. Your provider has the final say.',
  },
];

const PREGNANCY_EDU: Item[] = [
  {
    title: 'GDM essentials in week 28',
    body: 'Targets: fasting <95, postprandial under 140 at 1 hour. Log every reading; we’ll flag patterns.',
  },
  {
    title: 'Kick counts. Why they matter now.',
    body: 'Movement patterns are the most reliable indicator of fetal wellbeing in the third trimester. ACOG · 2024.',
  },
  {
    title: 'Birth prep checklist for week 28',
    body: 'Pediatrician selection, hospital tour, breastfeeding class booking, GBS swab scheduled around week 36.',
  },
];

export default function CarePlanScreen() {
  const state = useDemoState();
  const pregnancy = isPregnancy(state);

  const today = pregnancy ? PREGNANCY_TODAY : POSTPARTUM_TODAY;
  const warnings = pregnancy ? PREGNANCY_WARNINGS : POSTPARTUM_WARNINGS;
  const education = pregnancy ? PREGNANCY_EDU : POSTPARTUM_EDU;

  const stageLabel = pregnancy
    ? `Today · ${state.weeksPregnant} weeks pregnant`
    : `Today · postpartum day ${state.daysPostpartum}`;

  const scheduledTitle = pregnancy
    ? '28-week antenatal visit · GDM screen'
    : '6-week postpartum visit';

  const scheduledBody = pregnancy
    ? `${state.nextCheckin} · with Dr. Patel. Glucose log + BP readings sent ahead.`
    : `${state.nextCheckin} · with Dr. Patel. Mood screen + BP trend sent ahead.`;

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
          <Text style={styles.headerTitle}>Care plan</Text>
          <Pressable
            onPress={close}
            hitSlop={12}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headBlock}>
            <Text style={styles.eyebrow}>{stageLabel}</Text>
            <Text style={styles.title}>What care looks like today</Text>
            <Text style={styles.lede}>
              Small, doable steps tuned to where you are this week. Skip what doesn’t fit.
            </Text>
          </View>

          <Section title="Today">
            {today.map((item, i) => (
              <Surface key={i} tone="surface">
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody}>{item.body}</Text>
              </Surface>
            ))}
          </Section>

          <Section title="Warning signs. Open chat or call your clinic.">
            <Surface tone="outline" style={styles.warnList}>
              {warnings.map((w, i) => (
                <View key={i} style={styles.warnRow}>
                  <View style={styles.warnDot} />
                  <Text style={styles.warnText}>{w}</Text>
                </View>
              ))}
            </Surface>
          </Section>

          <Section title="Scheduled follow-up">
            <Surface tone="mint">
              <Text style={styles.itemTitle}>{scheduledTitle}</Text>
              <Text style={styles.itemBody}>{scheduledBody}</Text>
              <Pressable style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}>
                <Text style={styles.linkBtnText}>Reschedule</Text>
              </Pressable>
            </Surface>
          </Section>

          <Section title="Reading we’d trust right now">
            {education.map((item, i) => (
              <Surface key={i} tone="surface">
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody}>{item.body}</Text>
              </Surface>
            ))}
          </Section>

          <View style={styles.videoBlock}>
            <PastelCTA
              label="Start a video visit"
              caption="Connects to your clinic’s on-call nurse. Mocked for the demo."
              onPress={close}
              tone="lavender"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Cocuna.bg },
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
  closeText: { ...Type.smallMedium, color: Cocuna.textMuted },
  pressed: { opacity: 0.65 },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.five,
    paddingTop: Spacing.four,
  },
  headBlock: { gap: 6 },
  eyebrow: { ...Type.caption, color: Cocuna.textMuted },
  title: {
    fontFamily: FontStack.display,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: Cocuna.text,
  },
  lede: { ...Type.body, color: Cocuna.textMuted },
  section: { gap: 10 },
  sectionLabel: { ...Type.caption, color: Cocuna.textMuted },
  sectionBody: { gap: 12 },
  itemTitle: {
    fontFamily: FontStack.bodySemibold,
    fontSize: 15,
    color: Cocuna.text,
    marginBottom: 4,
  },
  itemBody: {
    fontFamily: FontStack.body,
    fontSize: 14,
    lineHeight: 21,
    color: Cocuna.textMuted,
  },
  warnList: { gap: 10 },
  warnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  warnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Triage.red,
    marginTop: 8,
  },
  warnText: {
    flex: 1,
    fontFamily: FontStack.body,
    fontSize: 14,
    lineHeight: 21,
    color: Cocuna.text,
  },
  linkBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: Cocuna.surface,
  },
  linkBtnText: { ...Type.smallMedium, color: Cocuna.text },
  videoBlock: { paddingTop: Spacing.two },
});

import type {
  PatientSignals,
  TriageContribution,
  TriageDecision,
  TriageLevel,
} from './types';

const W_CRITICAL = 50;
const W_HIGH = 30;
const W_MEDIUM = 15;
const W_LOW = 5;

function evaluate(signals: PatientSignals): TriageContribution[] {
  const c: TriageContribution[] = [];
  const postpartum = (signals.daysPostpartum ?? -1) >= 0;
  const pregnant = (signals.weeksPregnant ?? 0) > 0;
  const thirdTrimester = pregnant && (signals.weeksPregnant ?? 0) >= 27;
  const preterm = pregnant && (signals.weeksPregnant ?? 0) < 37;

  if (signals.chestPain) c.push({ input: 'chest pain', weight: W_CRITICAL, reason: 'Possible cardiac event' });
  if (signals.breathingIssue) c.push({ input: 'shortness of breath', weight: W_CRITICAL, reason: 'Respiratory emergency' });
  if (signals.seizure) c.push({ input: 'seizure', weight: W_CRITICAL, reason: 'Neurological emergency' });
  if (signals.heavyBleeding) c.push({ input: 'heavy bleeding', weight: W_CRITICAL, reason: 'Hemorrhage risk' });
  if (signals.selfHarmIdeation) c.push({ input: 'self-harm ideation', weight: W_CRITICAL, reason: 'Acute mental-health crisis' });

  if (signals.bp) {
    const { systolic, diastolic } = signals.bp;
    const severe = systolic >= 160 || diastolic >= 110;
    const high = systolic >= 140 || diastolic >= 90;
    if ((postpartum || pregnant) && severe) {
      c.push({ input: `BP ${systolic}/${diastolic}`, weight: W_CRITICAL, reason: postpartum ? 'Severe hypertension postpartum' : 'Severe hypertension in pregnancy' });
    } else if ((postpartum || pregnant) && high) {
      c.push({ input: `BP ${systolic}/${diastolic}`, weight: W_HIGH, reason: postpartum ? 'Hypertension postpartum' : 'Hypertension in pregnancy' });
    } else if (high) {
      c.push({ input: `BP ${systolic}/${diastolic}`, weight: W_MEDIUM, reason: 'Elevated blood pressure' });
    }
  }
  if ((postpartum || pregnant) && signals.visualSymptoms) {
    c.push({ input: 'visual symptoms', weight: W_HIGH, reason: 'Possible preeclampsia indicator' });
  }
  if ((postpartum || pregnant) && signals.symptoms?.includes('severe-headache')) {
    c.push({ input: 'severe headache', weight: W_HIGH, reason: postpartum ? 'Postpartum red flag' : 'Preeclampsia red flag' });
  }
  if (pregnant && signals.swelling) {
    c.push({ input: 'facial/hand swelling', weight: W_MEDIUM, reason: 'Possible preeclampsia indicator' });
  }
  if (thirdTrimester && signals.decreasedFetalMovement) {
    c.push({ input: 'decreased fetal movement', weight: W_HIGH, reason: 'Third-trimester fetal wellbeing concern — needs same-day NST' });
  }
  if (preterm && (signals.contractionsPerHour ?? 0) >= 4) {
    c.push({
      input: `${signals.contractionsPerHour} contractions/hr at ${signals.weeksPregnant}wk`,
      weight: W_CRITICAL,
      reason: 'Preterm labor — needs immediate L&D evaluation',
    });
  }

  if ((signals.babyAgeDays ?? Infinity) < 90 && (signals.babyTempF ?? 0) >= 100.4) {
    c.push({
      input: `infant fever ${signals.babyTempF}°F`,
      weight: W_CRITICAL,
      reason: 'Fever in infant under 3 months requires urgent evaluation',
    });
  }

  if ((signals.moodScore ?? 0) >= 15) {
    c.push({ input: `mood score ${signals.moodScore}`, weight: W_HIGH, reason: 'Elevated depression/anxiety score' });
  } else if ((signals.moodScore ?? 0) >= 10) {
    c.push({ input: `mood score ${signals.moodScore}`, weight: W_MEDIUM, reason: 'Mild-to-moderate mood symptoms' });
  }

  if (signals.riskFactors?.includes('gestational-hypertension')) {
    c.push({ input: 'gestational hypertension history', weight: W_LOW, reason: 'Risk factor amplifies BP signals' });
  }

  return c;
}

function hasEnoughSignal(s: PatientSignals): boolean {
  return Boolean(
    s.bp ||
      s.symptoms?.length ||
      s.moodScore !== undefined ||
      s.babyTempF !== undefined ||
      s.chestPain ||
      s.breathingIssue ||
      s.seizure ||
      s.heavyBleeding ||
      s.selfHarmIdeation ||
      s.visualSymptoms ||
      s.riskFactors?.length ||
      s.decreasedFetalMovement ||
      s.contractionsPerHour !== undefined ||
      s.swelling,
  );
}

function levelForScore(score: number): TriageLevel {
  if (score >= W_CRITICAL) return 'red';
  if (score >= W_HIGH) return 'orange';
  if (score >= W_MEDIUM) return 'yellow';
  return 'green';
}

const ACTION: Record<TriageLevel, string> = {
  red: 'Contact your clinic or labor & delivery now. We have notified your clinic.',
  orange: 'Schedule a same-day review with your clinic.',
  yellow: 'Book a clinic review within the next 24-72 hours.',
  green: 'Self-care guidance — no clinical action needed right now.',
  gray: 'A clinician will review your message and get back to you.',
};

const WHEN_ESCALATE: Record<TriageLevel, string> = {
  red: 'Any new or worsening symptom — call now.',
  orange: 'If symptoms worsen, call your clinic right away or go to urgent care.',
  yellow: 'If anything escalates (fever, severe pain, vision changes), contact your clinic immediately.',
  green: 'If new symptoms appear, log them or message us.',
  gray: 'Add any more detail you can — the more we know, the better the routing.',
};

export function triage(signals: PatientSignals): TriageDecision {
  const contributions = evaluate(signals);
  const score = contributions.reduce((sum, c) => sum + c.weight, 0);

  let level: TriageLevel;
  if (!hasEnoughSignal(signals)) {
    level = 'gray';
  } else if (contributions.length === 0) {
    level = 'green';
  } else {
    level = levelForScore(score);
  }

  const reason =
    contributions.length === 0
      ? 'No urgent flags detected.'
      : contributions.slice(0, 3).map((c) => c.input).join(' + ');

  return {
    level,
    score,
    reason,
    contributions,
    recommendedAction: ACTION[level],
    whenToEscalate: WHEN_ESCALATE[level],
    notifyClinic: level === 'red' || level === 'orange' || level === 'gray',
    sourceProtocol: 'Cocuna RAD v0.1 (ACOG postpartum + AAP infant fever)',
  };
}

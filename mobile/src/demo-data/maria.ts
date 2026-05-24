// Maria Alvarez — 34 weeks pregnant. Mother-app scripted dialogue for the demo.
// The coding agent imports these into the Chat screen and short-circuits the
// live Anthropic path when the user picks Maria's quick-start seed. The live
// path stays wired for anything off-script.
//
// Voice rules (per supabase/functions/cocuna-rad/index.ts SYSTEM_PROMPT and
// mobile/DESIGN.md "Microcopy register"):
// - American English, address as "Maria"
// - No em dashes, no hyphenated compounds outside identifiers
// - Calm escalation, gravity not alarm
// - No "AI as the doctor" framing
// - Reward engagement habits, never health outcomes

import type { TriageDecision } from '@/lib/triage';
import type { ChatMessage, FollowupQuestion, RADResponse } from '@/lib/claude/schema';

// --- Quick-start seed ----------------------------------------------------

export const MARIA_SEED_ID = 'maria-headache-vision-swelling';

export const MARIA_SEED_PROMPT =
  "I have a bad headache and my vision feels blurry. My hands are swollen. Is this normal?";

export const MARIA_SEED_LABEL = "Maria · 34wk · headache + vision";

// --- Scripted turns ------------------------------------------------------
// Two turns. Turn 1: Hera acknowledges, asks the safety follow up.
// Turn 2: Mother answers, Hera returns the Red decision + ER handoff intro.

export type ScriptedTurn = {
  id: string;
  // The user message that triggers this turn. Match by exact text or by the
  // option `id` selected from the previous followup.
  triggerMessage?: string;
  triggerFollowupOptionId?: string;
  response: RADResponse;
};

const MARIA_FOLLOWUP_1: FollowupQuestion = {
  question: 'Is someone with you right now?',
  options: [
    { id: 'yes-not-alone', label: "Yes, I'm not alone" },
    { id: 'alone-stay-with-me', label: "I'm alone. Can you stay with me?" },
  ],
};

const MARIA_TRIAGE_DECISION: TriageDecision = {
  level: 'red',
  score: 96,
  reason:
    'BP 164/104 + severe headache + blurry vision + hand swelling + reduced fetal movement at 34wk',
  contributions: [
    {
      input: 'BP 164/104 (repeat 160/102)',
      weight: 35,
      reason: 'Severe hypertension in pregnancy. Preeclampsia warning.',
    },
    {
      input: 'Severe headache',
      weight: 20,
      reason: 'Preeclampsia red flag in 3rd trimester',
    },
    {
      input: 'Blurry vision',
      weight: 20,
      reason: 'Neurologic symptom of preeclampsia',
    },
    {
      input: 'Reduced fetal movement at 34wk',
      weight: 15,
      reason: '3rd trimester fetal wellbeing concern. Needs same day NST.',
    },
    {
      input: 'Resting HR 96 vs baseline 72 (+33%), sleep 3h50m vs 7h20m',
      weight: 6,
      reason: 'Autonomic stress signature consistent with acute event',
    },
  ],
  recommendedAction:
    'Head to the ER or call emergency care now. Your clinic has been notified. ER handoff summary is ready to show on arrival.',
  whenToEscalate:
    'Any seizure, chest pain, fainting, or sudden change in the baby’s movement. Call 911.',
  notifyClinic: true,
  sourceProtocol: 'Cocuna RAD v0.1 (ACOG hypertensive disorders of pregnancy)',
};

export const MARIA_SCRIPT: ScriptedTurn[] = [
  {
    id: 'maria-turn-1',
    triggerMessage: MARIA_SEED_PROMPT,
    response: {
      acknowledgement:
        "Maria, I'm with you. A few of these symptoms together at 34 weeks need attention right now, especially with your BP reading. I'd like you to head to the ER or call emergency care now. I'm notifying your clinic and getting a summary ready for you to show when you arrive. Stay seated.",
      followup: MARIA_FOLLOWUP_1,
      decision: null,
    },
  },
  {
    id: 'maria-turn-2',
    // Triggers on either option id from MARIA_FOLLOWUP_1, or the raw text.
    triggerFollowupOptionId: 'alone-stay-with-me',
    response: {
      acknowledgement:
        "I'm staying with you. Here is the summary the ER will see when you arrive. Your clinic has it too. If anything changes (seizure, chest pain, fainting, sudden change in the baby's movement), call 911.",
      followup: null,
      decision: MARIA_TRIAGE_DECISION,
    },
  },
  {
    id: 'maria-turn-2-alt',
    triggerFollowupOptionId: 'yes-not-alone',
    response: {
      acknowledgement:
        "Good. Stay seated and ask them to drive you. Here is the summary the ER will see when you arrive. Your clinic has it too. If anything changes (seizure, chest pain, fainting, sudden change in the baby's movement), call 911.",
      followup: null,
      decision: MARIA_TRIAGE_DECISION,
    },
  },
];

// --- ER handoff card (text + structured) --------------------------------

export const MARIA_ER_HANDOFF_TEXT = `Cocuna ER handoff — Maria Alvarez
34 weeks pregnant · first pregnancy
New symptoms today: severe headache, blurry vision, swollen hands
Home BP: 164/104 at 2:14 PM (repeat 160/102 at 2:18 PM)
Resting HR: 96 bpm (baseline 72 bpm, ↑33%)
HRV: 24 ms (baseline 52 ms, ↓54%)
Fetal movement: decreased today vs baseline
Cocuna Care Attention Score: 96/100 — Red, preeclampsia warning pattern
Clinic notified: yes · 2:21 PM
Timeline attached: last 7 days`;

export type HandoffField = { label: string; value: string };

export const MARIA_ER_HANDOFF_FIELDS: HandoffField[] = [
  { label: 'Patient', value: 'Maria Alvarez' },
  { label: 'Stage', value: '34 weeks pregnant, first pregnancy' },
  { label: 'New symptoms today', value: 'Severe headache, blurry vision, swollen hands' },
  { label: 'Home BP', value: '164/104 at 2:14 PM (repeat 160/102 at 2:18 PM)' },
  { label: 'Resting HR', value: '96 bpm (baseline 72 bpm, +33%)' },
  { label: 'HRV', value: '24 ms (baseline 52 ms, -54%)' },
  { label: 'Fetal movement', value: 'Decreased today vs baseline' },
  { label: 'Care Attention Score', value: '96 / 100. Red. Preeclampsia warning pattern.' },
  { label: 'Clinic notified', value: 'Yes, 2:21 PM' },
  { label: 'Timeline attached', value: 'Last 7 days' },
];

// --- Care Attention Score breakdown -------------------------------------

export type CareScoreDriver = { label: string; points: number };

export const MARIA_CARE_SCORE = {
  total: 96,
  level: 'red' as const,
  drivers: [
    { label: 'BP deviation (164/104 vs baseline 112/72)', points: 35 },
    { label: 'Severe headache', points: 20 },
    { label: 'Vision symptoms (blurry)', points: 20 },
    { label: 'Reduced fetal movement at 34wk', points: 15 },
    { label: 'HR + sleep deviation', points: 6 },
  ] satisfies CareScoreDriver[],
};

// --- Baseline + demo-day vitals -----------------------------------------

export const MARIA_BASELINE = {
  restingHr: 72,
  hrv: 52,
  sleepHours: 7.33,
  steps: 6500,
  bp: '112/72',
};

export const MARIA_DEMO_DAY = {
  restingHr: 96,
  hrv: 24,
  sleepHours: 3.83,
  steps: 1100,
  bp: '164/104',
  bpRepeat: '160/102',
  bpTime: '2:14 PM',
  bpRepeatTime: '2:18 PM',
  symptoms: ['Severe headache', 'Blurry vision', 'Swollen hands'] as string[],
  fetalMovement: 'Less than usual today',
};

// --- Lookup helpers for the chat screen ---------------------------------

/**
 * Returns the scripted RADResponse for Maria's flow, given the most recent
 * user message and (optionally) the followup option id she just tapped.
 * Returns null if nothing matches and the caller should fall back to the
 * live Anthropic path.
 */
export function matchMariaScript(input: {
  lastUserMessage?: string;
  lastFollowupOptionId?: string;
  history?: ChatMessage[];
}): RADResponse | null {
  if (input.lastFollowupOptionId) {
    const byOption = MARIA_SCRIPT.find(
      (t) => t.triggerFollowupOptionId === input.lastFollowupOptionId,
    );
    if (byOption) return byOption.response;
  }
  if (input.lastUserMessage) {
    const text = input.lastUserMessage.trim().toLowerCase();
    const byText = MARIA_SCRIPT.find(
      (t) => t.triggerMessage && t.triggerMessage.toLowerCase() === text,
    );
    if (byText) return byText.response;
    // Loose match: headache + (vision | blurry) + (swollen | swelling)
    if (
      text.includes('headache') &&
      (text.includes('vision') || text.includes('blurry')) &&
      (text.includes('swollen') || text.includes('swelling'))
    ) {
      return MARIA_SCRIPT[0].response;
    }
  }
  return null;
}

export const MARIA = {
  seedId: MARIA_SEED_ID,
  seedPrompt: MARIA_SEED_PROMPT,
  seedLabel: MARIA_SEED_LABEL,
  script: MARIA_SCRIPT,
  decision: MARIA_TRIAGE_DECISION,
  erHandoffText: MARIA_ER_HANDOFF_TEXT,
  erHandoffFields: MARIA_ER_HANDOFF_FIELDS,
  careScore: MARIA_CARE_SCORE,
  baseline: MARIA_BASELINE,
  demoDay: MARIA_DEMO_DAY,
  match: matchMariaScript,
};

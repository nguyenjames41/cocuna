// Jane Park — 12 weeks postpartum (emergency C-section). Mother-app scripted
// dialogue + passive-decline data for the demo. The coding agent imports
// these into the new "Cocuna noticed" screen and the chat screen.
//
// Voice rules (per supabase/functions/cocuna-rad/index.ts SYSTEM_PROMPT and
// mobile/DESIGN.md): American English, no em dashes, no hyphenated compounds
// outside identifiers, calm not alarming, never "AI as the doctor".

import type { TriageDecision } from '@/lib/triage';
import type { ChatMessage, FollowupQuestion, RADResponse } from '@/lib/claude/schema';

// --- Quick-start seed (used when Jane taps the proactive check-in push) -

export const JANE_SEED_ID = 'jane-proactive-checkin';

// This is the "user message" the chat screen seeds when Jane taps the push.
// It's a system-style line ("Cocuna check-in") rather than a typed mother
// message. The UI can render it as a Hera-initiated thread without a user
// bubble.
export const JANE_SEED_PROMPT = '[Cocuna proactive check-in opened]';

export const JANE_SEED_LABEL = 'Jane · 12wk postpartum · check-in';

export const JANE_PUSH_NOTIFICATION =
  "Cocuna noticed you and Leo have had a harder week. No pressure. Checking in gently.";

// --- Scripted turns ------------------------------------------------------

export type ScriptedTurn = {
  id: string;
  triggerMessage?: string;
  triggerFollowupOptionId?: string;
  response: RADResponse;
};

// Safety screen (3 sequential single-choice questions, CDC style).
const JANE_FOLLOWUP_SAFE: FollowupQuestion = {
  question: 'Are you having thoughts of harming yourself or your baby?',
  options: [
    { id: 'no-thoughts', label: "No, I'm not having those thoughts" },
    { id: 'yes-help-now', label: 'Yes. I need help right now' },
  ],
};

const JANE_FOLLOWUP_CAPACITY: FollowupQuestion = {
  question: 'Do you feel unable to care for yourself or Leo today?',
  options: [
    { id: 'managing-hard', label: "I'm managing, but it's hard" },
    { id: 'cant-some-days', label: "Some days I really can't" },
  ],
};

const JANE_FOLLOWUP_TALK: FollowupQuestion = {
  question: 'Would you like to talk to someone today?',
  options: [
    { id: 'yes-please', label: 'Yes, please' },
    { id: 'not-today', label: 'Not today. But check on me tomorrow' },
  ],
};

const JANE_TRIAGE_DECISION: TriageDecision = {
  level: 'orange',
  score: 82,
  reason:
    'Passive decline pattern over 7 days: sleep -47%, activity -86%, no baby logs for 5 days, no app opens for 4 days, depressive language in last message',
  contributions: [
    {
      input: 'Activity collapse (600 steps vs 4,200 baseline, -86%)',
      weight: 18,
      reason: 'Withdrawal pattern, possible PPD',
    },
    {
      input: 'Sleep deterioration (3h10m vs 6h baseline, -47%)',
      weight: 16,
      reason: 'Postpartum sleep collapse compounds mood risk',
    },
    {
      input: 'No baby logs for 5 days (was 5-7/day)',
      weight: 14,
      reason: 'Caregiver engagement drop',
    },
    {
      input: 'No app opens for 4 days',
      weight: 12,
      reason: 'Withdrawal from usual support behaviors',
    },
    {
      input: '"I feel like I\'m failing" (5d ago)',
      weight: 22,
      reason: 'Depressive language pattern; EPDS likely elevated',
    },
  ],
  recommendedAction:
    "Same day perinatal mental health video visit with Dr. Lena Park at 4:30 PM. Your clinic has been notified and will save your spot.",
  whenToEscalate:
    'Any thoughts of harming yourself or Leo, or any day you feel unable to keep yourself or Leo safe. Call 988 (Suicide and Crisis Lifeline) or 911.',
  notifyClinic: true,
  sourceProtocol: 'Cocuna RAD v0.1 (ACOG perinatal mood + anxiety disorders)',
};

export const JANE_SCRIPT: ScriptedTurn[] = [
  // Turn 0: Hera opens the conversation when Jane taps the push.
  {
    id: 'jane-turn-0',
    triggerMessage: JANE_SEED_PROMPT,
    response: {
      acknowledgement:
        "Jane, I noticed you and Leo have had a harder week than usual. Less sleep, fewer updates, and you haven't checked in for a few days. No pressure. I'd like to check on you. Are you feeling safe right now?",
      followup: JANE_FOLLOWUP_SAFE,
      decision: null,
    },
  },
  // Turn 1: Jane answers "No, I'm not having those thoughts" → ask capacity.
  {
    id: 'jane-turn-1',
    triggerFollowupOptionId: 'no-thoughts',
    response: {
      acknowledgement:
        "Thank you for telling me. That matters. One more gentle question so I can help in the right way.",
      followup: JANE_FOLLOWUP_CAPACITY,
      decision: null,
    },
  },
  // Turn 1 alt: emergency path.
  {
    id: 'jane-turn-1-emergency',
    triggerFollowupOptionId: 'yes-help-now',
    response: {
      acknowledgement:
        "I hear you. You are not alone in this. I'm connecting you with help right now. If you are in immediate danger, please call 988 (Suicide and Crisis Lifeline) or 911. I'm staying with you and notifying your clinic.",
      followup: null,
      decision: {
        ...JANE_TRIAGE_DECISION,
        level: 'red',
        score: 100,
        reason:
          'Active disclosure of self harm or harm to baby thoughts on proactive safety screen',
        recommendedAction:
          'Call 988 (Suicide and Crisis Lifeline) or 911 now. Clinic notified. Cocuna staying with you.',
        whenToEscalate:
          'If you feel unsafe at any moment, call 911 or go to the nearest ER.',
      },
    },
  },
  // Turn 2: Jane answers "Some days I really can't" → ask if she wants to talk.
  {
    id: 'jane-turn-2',
    triggerFollowupOptionId: 'cant-some-days',
    response: {
      acknowledgement:
        "That sounds really hard. You're not failing. The weeks after a hard birth can do this even to people who are coping well otherwise.",
      followup: JANE_FOLLOWUP_TALK,
      decision: null,
    },
  },
  {
    id: 'jane-turn-2-managing',
    triggerFollowupOptionId: 'managing-hard',
    response: {
      acknowledgement:
        "Managing on a hard week still counts. Would it help to talk to someone today, just to take some weight off?",
      followup: JANE_FOLLOWUP_TALK,
      decision: null,
    },
  },
  // Turn 3: Jane answers "Yes, please" → return Orange decision + video card.
  {
    id: 'jane-turn-3',
    triggerFollowupOptionId: 'yes-please',
    response: {
      acknowledgement:
        "You did a hard thing by saying yes. Today, you don't have to figure this out alone. Here is what I've set up.",
      followup: null,
      decision: JANE_TRIAGE_DECISION,
    },
  },
  {
    id: 'jane-turn-3-not-today',
    triggerFollowupOptionId: 'not-today',
    response: {
      acknowledgement:
        "Okay. I'll check on you tomorrow. If anything shifts before then, you can tap me anytime. You're not bothering anyone.",
      followup: null,
      decision: {
        ...JANE_TRIAGE_DECISION,
        recommendedAction:
          'No same day visit booked. Cocuna will check in again tomorrow. Clinic flagged for soft follow up within 24 hours.',
      },
    },
  },
];

// --- Video visit card ----------------------------------------------------

export type VideoVisitCard = {
  title: string;
  doctor: string;
  specialty: string;
  earliestAvailable: string;
  duration: string;
  clinicNote: string;
  cocunaJoinNote: string;
};

export const JANE_VIDEO_VISIT: VideoVisitCard = {
  title: 'Same day support',
  doctor: 'Dr. Lena Park',
  specialty: 'Perinatal psychiatry',
  earliestAvailable: 'Today, 4:30 PM (in 2h 45m)',
  duration: '45 minute video visit',
  clinicNote: 'Your clinic has been notified and will save your spot.',
  cocunaJoinNote:
    'Cocuna will join briefly at the start to share what you have told me, then leave you with Dr. Park.',
};

export const JANE_VIDEO_VISIT_TEXT = `Same day support · Dr. Lena Park, perinatal psychiatry
Earliest available: today, 4:30 PM (in 2h 45m)
45 minute video visit
Your clinic has been notified and will save your spot.
Cocuna will join briefly at the start to share what you have told me, then leave you with Dr. Park.`;

// --- Care Attention Score breakdown -------------------------------------

export type CareScoreDriver = { label: string; points: number };

export const JANE_CARE_SCORE = {
  total: 82,
  level: 'orange' as const,
  drivers: [
    { label: 'Activity collapse (-86%)', points: 18 },
    { label: 'Sleep deterioration (-47%)', points: 16 },
    { label: 'No baby logs for 5 days', points: 14 },
    { label: 'No app opens for 4 days', points: 12 },
    { label: 'Depressive language pattern', points: 22 },
  ] satisfies CareScoreDriver[],
};

// --- Passive-signal trail (oldest → newest) -----------------------------

export type PassiveDay = {
  dayOffset: number;
  label: string;
  sleepHours: number;
  steps: number;
  babyLogs: number;
  appOpens: number;
  noteworthy?: string;
};

export const JANE_PASSIVE_TIMELINE: PassiveDay[] = [
  { dayOffset: -6, label: '6d ago', sleepHours: 4.5, steps: 1800, babyLogs: 4, appOpens: 2, noteworthy: 'Last full day of feeding logs' },
  { dayOffset: -5, label: '5d ago', sleepHours: 4.0, steps: 1200, babyLogs: 2, appOpens: 1, noteworthy: '"I feel like I\'m failing"' },
  { dayOffset: -4, label: '4d ago', sleepHours: 3.5, steps: 900, babyLogs: 0, appOpens: 1 },
  { dayOffset: -3, label: '3d ago', sleepHours: 3.2, steps: 700, babyLogs: 0, appOpens: 0, noteworthy: 'No app open' },
  { dayOffset: -2, label: '2d ago', sleepHours: 3.0, steps: 500, babyLogs: 0, appOpens: 0, noteworthy: 'No app open' },
  { dayOffset: -1, label: 'Yesterday', sleepHours: 2.9, steps: 450, babyLogs: 0, appOpens: 0, noteworthy: 'No app open' },
  { dayOffset: 0, label: 'Today', sleepHours: 3.17, steps: 600, babyLogs: 0, appOpens: 1, noteworthy: 'Tapped Cocuna check in push' },
];

// --- Baseline vs this week numbers (for the passive-decline screen) -----

export const JANE_BASELINE = {
  sleepHours: 6.0,
  stepsPerDay: 4200,
  babyLogsPerDay: '5-7',
  feedingLogs: 'Regular',
  moodCheckins: 'Tired but okay',
  appOpens: 'Daily',
  messageSentiment: 'Neutral',
};

export const JANE_THIS_WEEK = {
  sleepHours: 3.17,
  sleepDeltaPct: -47,
  stepsPerDay: 600,
  stepsDeltaPct: -86,
  babyLogsDaysMissing: 5,
  feedingLogs: 'Missing',
  moodCheckins: 'No response',
  appOpensDaysMissing: 4,
  lastMessage: "I feel like I'm failing",
  lastMessageDaysAgo: 5,
};

// --- Lookup helper for the chat screen ----------------------------------

/**
 * Returns the scripted RADResponse for Jane's flow.
 *
 * Use `lastFollowupOptionId` whenever Jane taps a Followup option pill.
 * Use `lastUserMessage` for the initial seed (the proactive check in opener).
 * Returns null if nothing matches; caller can fall back to the live path.
 */
export function matchJaneScript(input: {
  lastUserMessage?: string;
  lastFollowupOptionId?: string;
  history?: ChatMessage[];
}): RADResponse | null {
  if (input.lastFollowupOptionId) {
    const byOption = JANE_SCRIPT.find(
      (t) => t.triggerFollowupOptionId === input.lastFollowupOptionId,
    );
    if (byOption) return byOption.response;
  }
  if (input.lastUserMessage) {
    const text = input.lastUserMessage.trim();
    const byText = JANE_SCRIPT.find((t) => t.triggerMessage === text);
    if (byText) return byText.response;
  }
  return null;
}

export const JANE = {
  seedId: JANE_SEED_ID,
  seedPrompt: JANE_SEED_PROMPT,
  seedLabel: JANE_SEED_LABEL,
  pushNotification: JANE_PUSH_NOTIFICATION,
  script: JANE_SCRIPT,
  decision: JANE_TRIAGE_DECISION,
  videoVisit: JANE_VIDEO_VISIT,
  videoVisitText: JANE_VIDEO_VISIT_TEXT,
  careScore: JANE_CARE_SCORE,
  passiveTimeline: JANE_PASSIVE_TIMELINE,
  baseline: JANE_BASELINE,
  thisWeek: JANE_THIS_WEEK,
  match: matchJaneScript,
};

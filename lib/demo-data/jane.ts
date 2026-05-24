// Jane Park — 12 weeks postpartum (emergency C-section). The patient the clinic
// would have missed. Passive-decline signal trail across 7 days, Hera's
// proactive check-in, CDC-style safety screen, same-day video visit handoff.

export type Baseline = {
  sleepHours: number; // average per night (fragmented)
  stepsPerDay: number;
  babyLogsPerDay: string; // range, e.g. '5-7'
  feedingLogs: string;
  moodCheckins: string;
  appOpens: string;
  messageSentiment: string;
};

export type DemoWeek = {
  sleepHours: number;
  sleepDeltaPct: number; // negative = decline vs baseline
  stepsPerDay: number;
  stepsDeltaPct: number;
  babyLogsDaysMissing: number;
  feedingLogs: string;
  moodCheckins: string;
  appOpensDaysMissing: number;
  lastMessage: string;
  lastMessageDaysAgo: number;
};

export type CareScoreDriver = {
  label: string;
  points: number;
};

export type CareScore = {
  total: number;
  level: 'red' | 'orange' | 'yellow' | 'green' | 'gray';
  drivers: CareScoreDriver[];
};

export type HeraFollowupOption = {
  id: string;
  label: string;
};

export type HeraFollowup = {
  prompt: string;
  options: HeraFollowupOption[];
};

export type HeraMessage = {
  id: string;
  role: 'mother' | 'hera' | 'system';
  content: string;
};

export const JANE_BASELINE: Baseline = {
  sleepHours: 6.0,
  stepsPerDay: 4200,
  babyLogsPerDay: '5-7',
  feedingLogs: 'Regular',
  moodCheckins: '"Tired but okay"',
  appOpens: 'Daily',
  messageSentiment: 'Neutral',
};

// "This week" = week 12 postpartum, the demo week.
export const JANE_THIS_WEEK: DemoWeek = {
  sleepHours: 3.17, // 3h 10m
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

export const JANE_CARE_SCORE: CareScore = {
  total: 82,
  level: 'orange',
  drivers: [
    { label: 'Activity collapse (600 steps vs 4,200 baseline, -86%)', points: 18 },
    { label: 'Sleep deterioration (3h10m vs 6h baseline, -47%)', points: 16 },
    { label: 'No baby logs for 5 days (was 5-7/day)', points: 14 },
    { label: 'No app opens for 4 days', points: 12 },
    { label: 'Depressive language pattern ("I feel like I\'m failing")', points: 22 },
  ],
};

// --- Push notification + opening Hera message.
// No em dashes, no hyphenated compounds (per Edge-Function voice rules).

export const JANE_PUSH_NOTIFICATION =
  "Cocuna noticed you and Leo have had a harder week. No pressure. Checking in gently.";

const JANE_HERA_OPENER: HeraMessage = {
  id: 'jane-hera-opener',
  role: 'hera',
  content:
    "Jane, I noticed you and Leo have had a harder week than usual. Less sleep, fewer updates, and you haven't checked in for a few days. No pressure. I'd like to check on you. Are you feeling safe right now?",
};

// CDC-style safety screen — three sequential single-choice questions.
const JANE_SAFETY_Q1: HeraFollowup = {
  prompt: 'Are you having thoughts of harming yourself or your baby?',
  options: [
    { id: 'no-thoughts', label: "No, I'm not having those thoughts" },
    { id: 'yes-help-now', label: 'Yes. I need help right now' },
  ],
};

const JANE_SAFETY_Q2: HeraFollowup = {
  prompt: 'Do you feel unable to care for yourself or Leo today?',
  options: [
    { id: 'managing-hard', label: "I'm managing, but it's hard" },
    { id: 'cant-some-days', label: "Some days I really can't" },
  ],
};

const JANE_SAFETY_Q3: HeraFollowup = {
  prompt: 'Would you like to talk to someone today?',
  options: [
    { id: 'yes-please', label: 'Yes, please' },
    { id: 'not-today', label: 'Not today. But check on me tomorrow' },
  ],
};

// Scripted demo answers (Jane's path through the safety screen).
const JANE_ANSWER_Q1: HeraMessage = {
  id: 'jane-answer-q1',
  role: 'mother',
  content: "No, I'm not having those thoughts",
};

const JANE_ANSWER_Q2: HeraMessage = {
  id: 'jane-answer-q2',
  role: 'mother',
  content: "Some days I really can't",
};

const JANE_ANSWER_Q3: HeraMessage = {
  id: 'jane-answer-q3',
  role: 'mother',
  content: 'Yes, please',
};

const JANE_HERA_CLOSING: HeraMessage = {
  id: 'jane-hera-closing',
  role: 'hera',
  content:
    "You did a hard thing by saying yes. Today, you don't have to figure this out alone.",
};

export const JANE_HERA_DIALOGUE = {
  pushNotification: JANE_PUSH_NOTIFICATION,
  opener: JANE_HERA_OPENER,
  safetyScreen: [JANE_SAFETY_Q1, JANE_SAFETY_Q2, JANE_SAFETY_Q3],
  scriptedAnswers: [JANE_ANSWER_Q1, JANE_ANSWER_Q2, JANE_ANSWER_Q3],
  closing: JANE_HERA_CLOSING,
};

// --- Same-day video visit card. Clinician facing language is fine on the
// clinic dashboard mirror; the mobile-side version follows the no-dash rule.

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
  title: 'Same-day support',
  doctor: 'Dr. Lena Park',
  specialty: 'Perinatal psychiatry',
  earliestAvailable: 'Today, 4:30 PM (in 2h 45m)',
  duration: '45-minute video visit',
  clinicNote: 'Your clinic has been notified and will save your spot.',
  cocunaJoinNote:
    'Cocuna will join briefly at the start to share what you have told me, then leave you with Dr. Park.',
};

export const JANE_VIDEO_VISIT_TEXT = `Same-day support · Dr. Lena Park, perinatal psychiatry
Earliest available: today, 4:30 PM (in 2h 45m)
45-minute video visit
Your clinic has been notified and will save your spot.
Cocuna will join briefly at the start to share what you have told me, then leave you with Dr. Park.`;

// --- 7-day passive signal trail (oldest → newest). Used by the clinic-side
// depression timeline chart and the mobile passive-decline screen.

export type PassiveDay = {
  dayOffset: number; // -6..0
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
  { dayOffset: 0, label: 'Today', sleepHours: 3.17, steps: 600, babyLogs: 0, appOpens: 1, noteworthy: 'Tapped Cocuna check-in push' },
];

// Convenience export.
export const JANE = {
  baseline: JANE_BASELINE,
  thisWeek: JANE_THIS_WEEK,
  careScore: JANE_CARE_SCORE,
  dialogue: JANE_HERA_DIALOGUE,
  videoVisit: JANE_VIDEO_VISIT,
  videoVisitText: JANE_VIDEO_VISIT_TEXT,
  passiveTimeline: JANE_PASSIVE_TIMELINE,
};

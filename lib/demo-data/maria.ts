// Maria Alvarez — 34 weeks pregnant. Demo-day acute presentation.
// Source of truth for the clinic dashboard (ER handoff card, Care Attention
// Score breakdown, vitals timeline). Mirrored in mobile/src/demo-data/maria.ts
// for the mother-app side of the same story.

export type Baseline = {
  restingHr: number;
  hrv: number;
  sleepHours: number;
  steps: number;
  bp: string;
};

export type DemoDay = Baseline & {
  bpRepeat: string;
  bpTime: string;
  bpRepeatTime: string;
  symptoms: string[];
  fetalMovement: string;
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
  role: 'mother' | 'hera';
  content: string;
};

export type HeraDialogue = {
  opener: HeraMessage;
  herarReply: HeraMessage; // (kept for readability, see `heraReply`)
  heraReply: HeraMessage;
  followupSafety: HeraFollowup;
  motherSafetyAnswer: HeraMessage;
  heraHandoffIntro: HeraMessage;
};

export const MARIA_BASELINE: Baseline = {
  restingHr: 72,
  hrv: 52,
  sleepHours: 7.33, // 7h 20m
  steps: 6500,
  bp: '112/72',
};

export const MARIA_DEMO_DAY: DemoDay = {
  restingHr: 96,
  hrv: 24,
  sleepHours: 3.83, // 3h 50m
  steps: 1100,
  bp: '164/104',
  bpRepeat: '160/102',
  bpTime: '2:14 PM',
  bpRepeatTime: '2:18 PM',
  symptoms: ['Severe headache', 'Blurry vision', 'Swollen hands'],
  fetalMovement: 'Less than usual today',
};

export const MARIA_CARE_SCORE: CareScore = {
  total: 96,
  level: 'red',
  drivers: [
    { label: 'BP deviation (164/104 vs baseline 112/72)', points: 35 },
    { label: 'Severe headache', points: 20 },
    { label: 'Vision symptoms (blurry)', points: 20 },
    { label: 'Reduced fetal movement at 34wk', points: 15 },
    { label: 'HR + sleep deviation (HR +33%, sleep -48%)', points: 6 },
  ],
};

// --- Mother / Hera scripted dialogue (clinic-side mirror; mobile owns the
// canonical version). Hera follows the Edge-Function voice rules:
// American English, no em dashes, no hyphenated compounds outside identifiers,
// calm escalation, no "AI as the doctor" framing.

const MARIA_OPENER: HeraMessage = {
  id: 'maria-opener',
  role: 'mother',
  content:
    "I have a bad headache and my vision feels blurry. My hands are swollen. Is this normal?",
};

const MARIA_HERA_REPLY: HeraMessage = {
  id: 'maria-hera-reply',
  role: 'hera',
  content:
    "Maria, I'm with you. A few of these symptoms together at 34 weeks need attention right now, especially with your BP reading. I'd like you to head to the ER or call emergency care now. I'm notifying your clinic and getting a summary ready for you to show when you arrive. Stay seated. Is someone with you?",
};

const MARIA_FOLLOWUP_SAFETY: HeraFollowup = {
  prompt: 'Is someone with you right now?',
  options: [
    { id: 'yes-not-alone', label: "Yes, I'm not alone" },
    { id: 'alone-stay-with-me', label: "I'm alone. Can you stay with me?" },
  ],
};

const MARIA_SAFETY_ANSWER: HeraMessage = {
  id: 'maria-safety-answer',
  role: 'mother',
  content: "I'm alone. Can you stay with me?",
};

const MARIA_HERA_HANDOFF_INTRO: HeraMessage = {
  id: 'maria-hera-handoff-intro',
  role: 'hera',
  content:
    "I'm staying with you. Here is the summary the ER will see when you arrive. Your clinic has it too. If anything changes (seizure, chest pain, fainting, sudden change in the baby's movement), call 911.",
};

export const MARIA_HERA_DIALOGUE: HeraDialogue = {
  opener: MARIA_OPENER,
  herarReply: MARIA_HERA_REPLY,
  heraReply: MARIA_HERA_REPLY,
  followupSafety: MARIA_FOLLOWUP_SAFETY,
  motherSafetyAnswer: MARIA_SAFETY_ANSWER,
  heraHandoffIntro: MARIA_HERA_HANDOFF_INTRO,
};

// --- ER handoff card text (exact, source of truth for both surfaces).
// This is clinician-facing copy: clinical register, real punctuation OK.
// The mobile-side ER handoff card renders the same block.

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

// Structured form of the same content for UI rendering (cards, tables).
export type HandoffField = { label: string; value: string };

export const MARIA_ER_HANDOFF_FIELDS: HandoffField[] = [
  { label: 'Patient', value: 'Maria Alvarez' },
  { label: 'Stage', value: '34 weeks pregnant · first pregnancy' },
  { label: 'New symptoms today', value: 'Severe headache, blurry vision, swollen hands' },
  { label: 'Home BP', value: '164/104 at 2:14 PM (repeat 160/102 at 2:18 PM)' },
  { label: 'Resting HR', value: '96 bpm (baseline 72 bpm, ↑33%)' },
  { label: 'HRV', value: '24 ms (baseline 52 ms, ↓54%)' },
  { label: 'Fetal movement', value: 'Decreased today vs baseline' },
  { label: 'Care Attention Score', value: '96/100 — Red, preeclampsia warning pattern' },
  { label: 'Clinic notified', value: 'Yes · 2:21 PM' },
  { label: 'Timeline attached', value: 'Last 7 days' },
];

// --- 7-day vitals timeline (oldest → newest). Day 7 is demo day.
// Used by the clinic timeline chart and the mobile detail screen.

export type VitalsDay = {
  dayOffset: number; // -6 = 6 days ago, 0 = today
  label: string;
  restingHr: number;
  hrv: number;
  sleepHours: number;
  steps: number;
  systolic: number;
  diastolic: number;
};

export const MARIA_VITALS_TIMELINE: VitalsDay[] = [
  { dayOffset: -6, label: '6d ago', restingHr: 71, hrv: 54, sleepHours: 7.4, steps: 6800, systolic: 110, diastolic: 70 },
  { dayOffset: -5, label: '5d ago', restingHr: 72, hrv: 53, sleepHours: 7.2, steps: 6500, systolic: 112, diastolic: 72 },
  { dayOffset: -4, label: '4d ago', restingHr: 73, hrv: 51, sleepHours: 7.5, steps: 6900, systolic: 114, diastolic: 74 },
  { dayOffset: -3, label: '3d ago', restingHr: 72, hrv: 52, sleepHours: 7.3, steps: 6400, systolic: 110, diastolic: 72 },
  { dayOffset: -2, label: '2d ago', restingHr: 74, hrv: 50, sleepHours: 7.1, steps: 6200, systolic: 116, diastolic: 76 },
  { dayOffset: -1, label: 'Yesterday', restingHr: 75, hrv: 48, sleepHours: 6.9, steps: 5800, systolic: 122, diastolic: 80 },
  { dayOffset: 0, label: 'Today', restingHr: 96, hrv: 24, sleepHours: 3.83, steps: 1100, systolic: 164, diastolic: 104 },
];

// Convenience exports for components that want a flat handle.
export const MARIA = {
  baseline: MARIA_BASELINE,
  demoDay: MARIA_DEMO_DAY,
  careScore: MARIA_CARE_SCORE,
  dialogue: MARIA_HERA_DIALOGUE,
  erHandoffText: MARIA_ER_HANDOFF_TEXT,
  erHandoffFields: MARIA_ER_HANDOFF_FIELDS,
  vitalsTimeline: MARIA_VITALS_TIMELINE,
};

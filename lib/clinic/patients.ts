export type TriageLevel = "red" | "orange" | "yellow" | "green" | "gray";

export const TRIAGE_LABEL: Record<TriageLevel, string> = {
  red: "Urgent",
  orange: "Same-day",
  yellow: "Review",
  green: "Steady",
  gray: "Needs review",
};

export type WearableMetrics = {
  restingHr: number;
  restingHrTrend: "up" | "down" | "steady";
  hrv: number;
  hrvTrend: "up" | "down" | "steady";
  stressScore: number;
  sleepHours: number;
  sleepQuality: "poor" | "fair" | "good";
  steps: number;
  source: string;
};

export type SelfReport = {
  date: string;
  mood: number;
  energy: number;
  pain: number;
  note: string;
};

export type CareEvent = {
  date: string;
  kind: "log" | "message" | "visit" | "triage";
  text: string;
};

export type Patient = {
  id: string;
  name: string;
  stage: string;
  stageDetail: string;
  delivery?: string;
  riskFactors: string[];
  triage: TriageLevel;
  triageReason: string;
  triageContributions: { input: string; reason: string }[];
  recommendedAction: string;
  whenToEscalate: string;
  currentIssue: string;
  latestVitals?: string;
  babySummary?: string;
  moodScreen?: string;
  wearable: WearableMetrics;
  selfReports: SelfReport[];
  recent: CareEvent[];
  qualitative: string;
};

export const PATIENTS: Patient[] = [
  {
    id: "maria",
    name: "Maria Alvarez",
    stage: "Pregnant",
    stageDetail: "34 weeks pregnant",
    riskFactors: ["First pregnancy", "Low-risk through 32wk"],
    triage: "red",
    triageReason:
      "BP 164/104 + severe headache + visual changes + hand swelling + reduced fetal movement at 34wk",
    triageContributions: [
      { input: "BP 164/104 (repeat 160/102)", reason: "Severe hypertension in pregnancy. Preeclampsia warning." },
      { input: "Severe headache", reason: "Preeclampsia red flag in 3rd trimester" },
      { input: "Blurry vision", reason: "Neurologic symptom of preeclampsia" },
      { input: "Hand swelling (new today)", reason: "Acute edema, preeclampsia indicator" },
      { input: "Reduced fetal movement", reason: "3rd-trimester fetal wellbeing concern. Needs same-day NST." },
      { input: "Resting HR 96 vs baseline 72 (+33%)", reason: "Sympathetic load consistent with acute event" },
      { input: "HRV 24ms vs baseline 52ms (-54%)", reason: "Autonomic stress signature" },
    ],
    recommendedAction: "Direct to ER / Labor & Delivery now. ER handoff packet generated.",
    whenToEscalate: "Any seizure, chest pain, fainting, or sudden change in fetal movement. Call 911.",
    currentIssue:
      "Severe headache, blurry vision, swollen hands, and home BP 164/104 at 34wk — preeclampsia warning pattern.",
    latestVitals: "BP 164/104 at 2:14 PM · repeat 160/102 at 2:18 PM · HR 96 · HRV 24ms",
    babySummary: "Fetal movement decreased today vs 7-day baseline. Last NST: normal (1wk ago).",
    moodScreen: "Not screened today (acute presentation)",
    wearable: {
      restingHr: 96,
      restingHrTrend: "up",
      hrv: 24,
      hrvTrend: "down",
      stressScore: 88,
      sleepHours: 3.83,
      sleepQuality: "poor",
      steps: 1100,
      source: "Apple Watch + home BP cuff",
    },
    selfReports: [
      {
        date: "Today · 2:18 PM",
        mood: 3,
        energy: 2,
        pain: 7,
        note: "Bad headache since this morning. Vision feels blurry. Hands look puffy. Baby has been quieter than usual.",
      },
      {
        date: "Yesterday",
        mood: 7,
        energy: 6,
        pain: 1,
        note: "Tired but okay. Slept ~7 hours. Baby active in the evening.",
      },
      {
        date: "3 days ago",
        mood: 8,
        energy: 7,
        pain: 0,
        note: "Felt good. Walked the dog twice. BP was 110/70.",
      },
    ],
    recent: [
      { date: "Today · 2:21 PM", kind: "triage", text: "Cocuna RAD: Red. Preeclampsia warning. ER handoff prepared." },
      { date: "Today · 2:19 PM", kind: "message", text: '"My hands are swollen and the baby has been quieter today."' },
      { date: "Today · 2:18 PM", kind: "log", text: "BP logged 160/102 (repeat)" },
      { date: "Today · 2:14 PM", kind: "log", text: "BP logged 164/104" },
      { date: "Today · 2:11 PM", kind: "message", text: '"I have a bad headache and my vision feels blurry."' },
      { date: "1 week ago", kind: "visit", text: "33wk OB visit · BP 118/74 · NST reactive · baby measuring on curve" },
    ],
    qualitative:
      "First pregnancy, no chronic conditions, has tracked her BP daily for the last 18 days. Today's reading is her highest by 40 points and her first symptomatic presentation. Tone in the chat is calm but worried; she's at home, asked if it was normal before mentioning the vision changes. Partner is at work; she's alone right now.",
  },
  {
    id: "jane",
    name: "Jane Park",
    stage: "Postpartum",
    stageDetail: "12 weeks postpartum",
    delivery: "Emergency C-section, 39w",
    riskFactors: ["Emergency C-section", "Limited family support", "Partner returned to work at 8wk"],
    triage: "orange",
    triageReason:
      "Passive signals trending down across 7 days: sleep -47%, activity -86%, no baby logs for 5d, no app opens for 4d, depressive language in last message",
    triageContributions: [
      { input: "Activity collapse (600 steps vs 4,200 baseline, -86%)", reason: "Withdrawal pattern, possible PPD" },
      { input: "Sleep deterioration (3h10m vs 6h baseline, -47%)", reason: "Postpartum sleep collapse" },
      { input: "No baby logs for 5 days (was 5-7/day)", reason: "Caregiver engagement drop" },
      { input: "No app opens for 4 days", reason: "Withdrawal from usual support behaviors" },
      { input: '"I feel like I\'m failing" (5d ago)', reason: "Depressive language pattern. EPDS at risk." },
    ],
    recommendedAction:
      "Same-day perinatal mental health video visit booked with Dr. Lena Park (4:30 PM). Cocuna joins start of visit to hand off context.",
    whenToEscalate:
      "Any answer of self-harm or harm-to-baby thoughts on the safety screen. Any 'cannot care for self or baby today' on consecutive days.",
    currentIssue:
      "7-day passive decline pattern consistent with worsening postpartum depression. Mother responded to gentle check-in; safety screen negative for self-harm, positive for 'some days I really can't' and accepted same-day support.",
    latestVitals: "BP 118/76 (last logged 8d ago) · HR 78",
    babySummary: "Baby Leo (3mo). Feeding and weight on curve at 8wk visit. No baby logs in app for 5 days.",
    moodScreen: "Safety screen today: no self-harm thoughts. 'Some days I really can't.' Accepted same-day support.",
    wearable: {
      restingHr: 78,
      restingHrTrend: "up",
      hrv: 38,
      hrvTrend: "down",
      stressScore: 64,
      sleepHours: 3.17,
      sleepQuality: "poor",
      steps: 600,
      source: "Apple Watch (passive)",
    },
    selfReports: [
      {
        date: "Today · 3:42 PM",
        mood: 3,
        energy: 2,
        pain: 2,
        note: "Tapped Cocuna's check-in. Said 'some days I really can't' and accepted a video visit today.",
      },
      {
        date: "5 days ago",
        mood: 2,
        energy: 2,
        pain: 3,
        note: '"I feel like I\'m failing. Leo cries and I don\'t know what to do."',
      },
      {
        date: "10 days ago",
        mood: 5,
        energy: 4,
        pain: 2,
        note: "Tired but okay. Logged a feed at 7am and a diaper at 9am.",
      },
      {
        date: "3 weeks ago",
        mood: 7,
        energy: 6,
        pain: 1,
        note: "Good day. Walked with Leo. Slept ~6h fragmented.",
      },
    ],
    recent: [
      { date: "Today · 3:45 PM", kind: "triage", text: "Cocuna RAD: Orange. Passive decline pattern. Video visit accepted." },
      { date: "Today · 3:43 PM", kind: "message", text: 'Jane: "yes, please" (to same-day support offer)' },
      { date: "Today · 3:42 PM", kind: "message", text: "Cocuna safety screen: no self-harm thoughts. 'Some days I really can't.'" },
      { date: "Today · 3:40 PM", kind: "message", text: "Cocuna proactive check-in sent (push)." },
      { date: "5 days ago", kind: "message", text: 'Jane: "I feel like I\'m failing."' },
      { date: "5 days ago", kind: "log", text: "Last baby log (feed at 8:14 AM)" },
      { date: "6 weeks ago", kind: "visit", text: "6wk postpartum visit · cleared · EPDS 9" },
    ],
    qualitative:
      "Jane finished her 6wk visit clean. Since then she's quietly tapered: fewer logs, then no logs, then no app opens. Her last message 5 days ago was the only direct signal. She didn't escalate, didn't message the clinic, didn't miss anything technically. Today she opened a Cocuna push and answered the safety screen honestly. She is the patient the clinic would have missed.",
  },
  {
    id: "amara",
    name: "Amara Okafor",
    stage: "Postpartum",
    stageDetail: "6 weeks postpartum",
    delivery: "Vaginal, 39w3d",
    riskFactors: [],
    triage: "yellow",
    triageReason: "Painful feeds (5/10) + supply worry + low sleep, no fever",
    triageContributions: [
      { input: "Nipple pain 5/10 across 4 days", reason: "Possible latch issue or early mastitis pattern" },
      { input: "Self-rated low supply", reason: "Common 6wk concern. Warrants lactation review." },
      { input: "Sleep 4.8h fragmented", reason: "Common postpartum but compounds feeding stress" },
    ],
    recommendedAction: "Lactation video consult within 24–48 hours.",
    whenToEscalate: "Fever, breast redness, hard lump, or flu-like symptoms → urgent.",
    currentIssue: "Painful breastfeeding and supply worry at 6 weeks; no fever, no red flags.",
    latestVitals: "BP 116/72 · HR 74 · no fever",
    babySummary: "Baby on weight curve, 8–10 feeds/day, normal output.",
    moodScreen: "EPDS 6",
    wearable: {
      restingHr: 74,
      restingHrTrend: "steady",
      hrv: 46,
      hrvTrend: "steady",
      stressScore: 44,
      sleepHours: 4.8,
      sleepQuality: "fair",
      steps: 3680,
      source: "Apple Watch",
    },
    selfReports: [
      {
        date: "Today",
        mood: 6,
        energy: 5,
        pain: 5,
        note: '"Feeds hurt. I keep wondering if I am doing it wrong."',
      },
      {
        date: "2 days ago",
        mood: 7,
        energy: 6,
        pain: 4,
        note: "Good day with baby. Feeds still tender on the left side.",
      },
      {
        date: "5 days ago",
        mood: 7,
        energy: 6,
        pain: 3,
        note: "Sister visited. Slept a longer stretch.",
      },
    ],
    recent: [
      { date: "Today · 11:24 AM", kind: "triage", text: "Cocuna RAD: Yellow. Lactation review recommended." },
      { date: "Today · 11:20 AM", kind: "message", text: '"Feeding hurts again. Is my supply low?"' },
      { date: "Yesterday", kind: "log", text: "Mood logged 6/10" },
      { date: "2 days ago", kind: "log", text: "Feed logged · left side tender" },
      { date: "6 weeks ago", kind: "visit", text: "6wk postpartum visit · cleared" },
    ],
    qualitative:
      "Quietly capable. Reports calmly even when something hurts. Pain is real but her tone hides it. A lactation consult that examines the latch is what she needs this week.",
  },
  {
    id: "sophia",
    name: "Sophia Chen",
    stage: "Pregnant",
    stageDetail: "28 weeks pregnant",
    riskFactors: [],
    triage: "green",
    triageReason: "All vitals in range. Logging consistently. Mood EPDS 3.",
    triageContributions: [
      { input: "BP 114/72 (7d average)", reason: "Within range" },
      { input: "Movement counts steady (5d)", reason: "Within range for 28wk" },
      { input: "Sleep 7.1h average", reason: "Healthy for 3rd trimester" },
      { input: "EPDS 3", reason: "No depression indicators" },
    ],
    recommendedAction: "Routine follow-up at 30wk visit. No clinical action needed.",
    whenToEscalate: "Any new headache, vision change, swelling, decreased movement, or BP ≥140/90.",
    currentIssue: "No active concerns. Routine engagement.",
    latestVitals: "BP 114/72 · HR 70 · last fasting glucose 86",
    babySummary: "Movement counts steady. Last anatomy scan normal at 20wk.",
    moodScreen: "EPDS 3",
    wearable: {
      restingHr: 70,
      restingHrTrend: "steady",
      hrv: 54,
      hrvTrend: "steady",
      stressScore: 28,
      sleepHours: 7.1,
      sleepQuality: "good",
      steps: 7240,
      source: "Apple Watch",
    },
    selfReports: [
      {
        date: "Today",
        mood: 8,
        energy: 7,
        pain: 1,
        note: '"Feeling good. Baby is active in the evenings."',
      },
      {
        date: "2 days ago",
        mood: 8,
        energy: 7,
        pain: 1,
        note: "Walked 30 minutes. Slept well.",
      },
      {
        date: "5 days ago",
        mood: 7,
        energy: 7,
        pain: 1,
        note: "Routine day. Logged kicks.",
      },
    ],
    recent: [
      { date: "Today · 8:12 AM", kind: "triage", text: "Cocuna RAD: Green. Routine engagement, all within range." },
      { date: "Today · 8:10 AM", kind: "log", text: "Kick count logged · within range" },
      { date: "Yesterday", kind: "log", text: "BP logged 114/72" },
      { date: "1 week ago", kind: "visit", text: "28wk OB visit · all normal" },
    ],
    qualitative:
      "Confident, consistent logger. Asks clarifying questions early. The kind of patient the clinic rarely worries about — and Cocuna helps keep it that way without adding load to either side.",
  },
];

export function patientById(id: string): Patient | undefined {
  return PATIENTS.find((p) => p.id === id);
}

export function generateClinicianSummary(p: Patient): string {
  const risk = p.riskFactors.length ? `, history of ${p.riskFactors.join(" + ")}` : "";
  const baby = p.babySummary ? ` Baby: ${p.babySummary.toLowerCase()}.` : "";
  const mood = p.moodScreen ? ` Mood screen: ${p.moodScreen}.` : "";
  const action = p.recommendedAction.toLowerCase();
  return `${p.name}, ${p.stageDetail.toLowerCase()}${p.delivery ? ` after ${p.delivery.toLowerCase()}` : ""}${risk}. Current issue: ${p.currentIssue.toLowerCase()}.${p.latestVitals ? ` ${p.latestVitals}.` : ""}${baby}${mood} Cocuna triage: ${TRIAGE_LABEL[p.triage]}. ${p.triageReason}. Recommended action: ${action}.`;
}

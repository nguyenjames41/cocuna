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
    id: "maria-s",
    name: "Maria S.",
    stage: "Postpartum",
    stageDetail: "6 weeks postpartum",
    delivery: "Vaginal, 39w2d",
    riskFactors: ["Gestational hypertension"],
    triage: "red",
    triageReason: "BP 158/102 + headache + vision changes at 6wk postpartum",
    triageContributions: [
      { input: "BP 158/102", reason: "Severe hypertension postpartum" },
      { input: "Severe headache", reason: "Postpartum red flag" },
      { input: "Visual symptoms (spots)", reason: "Possible preeclampsia indicator" },
      { input: "Gestational hypertension history", reason: "Risk factor amplifies BP signal" },
    ],
    recommendedAction: "Call now / send to L&D",
    whenToEscalate: "Any new neurologic symptoms — call 911",
    currentIssue: "Severe headache, visual spots, BP 158/102 at home",
    latestVitals: "BP 158/102 · repeated 154/100 · HR 92",
    babySummary: "Feeding normally, 7 wet diapers/day",
    moodScreen: "EPDS 8, no self-harm",
    wearable: {
      restingHr: 92,
      restingHrTrend: "up",
      hrv: 28,
      hrvTrend: "down",
      stressScore: 78,
      sleepHours: 4.2,
      sleepQuality: "poor",
      steps: 1840,
      source: "Apple Watch",
    },
    selfReports: [
      {
        date: "Today",
        mood: 3,
        energy: 2,
        pain: 6,
        note: "Head feels like pressure behind my eyes. Couldn't sleep through it.",
      },
      {
        date: "Yesterday",
        mood: 5,
        energy: 4,
        pain: 3,
        note: "Dull headache on and off. Baby fed well.",
      },
      {
        date: "2 days ago",
        mood: 6,
        energy: 5,
        pain: 1,
        note: "Felt okay today. Did a short walk.",
      },
    ],
    recent: [
      { date: "08:14 today", kind: "triage", text: "Cocuna RAD: Red — postpartum HTN red flags" },
      { date: "08:11 today", kind: "log", text: "BP logged 158/102" },
      { date: "07:42 today", kind: "message", text: '"I have a bad headache and I\'m seeing spots…"' },
      { date: "Yesterday 21:30", kind: "log", text: "BP logged 142/94" },
      { date: "3 days ago", kind: "visit", text: "Phone check-in with Nurse Lee · stable" },
    ],
    qualitative:
      "Most days she feels stretched thin but proud. Wrote yesterday: \"I don't know if this is the headache talking, or just the not-sleeping.\" Doesn't ask for help unless asked first.",
  },
  {
    id: "ana-r",
    name: "Ana R.",
    stage: "Pregnant",
    stageDetail: "28 weeks pregnant",
    riskFactors: ["GDM diet-controlled", "Anxiety hx"],
    triage: "orange",
    triageReason: "PHQ-9 elevated + insomnia + GDM tracking dropping",
    triageContributions: [
      { input: "PHQ-9 = 14", reason: "Moderate depression — same-day behavioural review" },
      { input: "Sleep <5h × 5 nights", reason: "Persistent insomnia, third trimester" },
      { input: "Glucose log gap (3 days)", reason: "GDM adherence concern" },
    ],
    recommendedAction: "Same-day behavioural review · GDM nurse follow-up",
    whenToEscalate: "If any self-harm ideation or vital sign deterioration",
    currentIssue: "Mood scoring high, sleep collapsed, missing GDM checks",
    latestVitals: "BP 124/78 · HR 76 · last fasting glucose 98 (3d ago)",
    babySummary: "Movement counts within range, last NST normal",
    moodScreen: "PHQ-9 14 · GAD-7 11",
    wearable: {
      restingHr: 76,
      restingHrTrend: "up",
      hrv: 35,
      hrvTrend: "down",
      stressScore: 68,
      sleepHours: 4.8,
      sleepQuality: "poor",
      steps: 5210,
      source: "WHOOP",
    },
    selfReports: [
      {
        date: "Today",
        mood: 3,
        energy: 3,
        pain: 2,
        note: '"I keep crying for no reason. I love this baby but I am scared of everything."',
      },
      {
        date: "2 days ago",
        mood: 4,
        energy: 4,
        pain: 2,
        note: "Better day, but didn't sleep well again.",
      },
    ],
    recent: [
      { date: "Today 09:02", kind: "triage", text: "Cocuna RAD: Orange — mood + sleep + GDM gap" },
      { date: "Yesterday", kind: "log", text: "Mood logged 3/10" },
      { date: "3 days ago", kind: "log", text: "Glucose 98 fasting" },
      { date: "1 week ago", kind: "visit", text: "Antenatal visit · BP normal" },
    ],
    qualitative:
      "She describes herself as \"holding it together for everyone\" but her self-reports say otherwise. Loves the baby, but the third trimester is wearing through her usual coping. Has not asked for mental-health support — would likely accept if offered gently.",
  },
  {
    id: "emily-t",
    name: "Emily T.",
    stage: "Postpartum",
    stageDetail: "4 weeks postpartum",
    delivery: "C-section, 38w1d",
    riskFactors: [],
    triage: "yellow",
    triageReason: "Breastfeeding pain + low supply worry · no fever",
    triageContributions: [
      { input: "Nipple pain (5/10)", reason: "Possible latch issue or early mastitis" },
      { input: "Supply self-rated low", reason: "Common 4wk concern · lactation review" },
    ],
    recommendedAction: "Lactation video consult within 24-48 hours",
    whenToEscalate: "Fever, breast redness, hard lump → urgent",
    currentIssue: "Painful feeds, worried about supply",
    latestVitals: "BP 118/74 · HR 72 · no fever",
    babySummary: "Weight gain on track, 8-10 feeds/day",
    moodScreen: "EPDS 6",
    wearable: {
      restingHr: 72,
      restingHrTrend: "steady",
      hrv: 48,
      hrvTrend: "steady",
      stressScore: 42,
      sleepHours: 5.6,
      sleepQuality: "fair",
      steps: 3920,
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
        note: "Good day with baby. Feeds still tender.",
      },
    ],
    recent: [
      { date: "Today 11:24", kind: "triage", text: "Cocuna RAD: Yellow — lactation review" },
      { date: "Today 11:20", kind: "message", text: '"Feeding hurts again. Is my supply low?"' },
      { date: "Yesterday", kind: "log", text: "Mood logged 6/10" },
    ],
    qualitative:
      "Quietly capable. Reports calmly even when something is hurting. Pain is real but her tone hides it — worth a lactation consult who'll examine the latch.",
  },
  {
    id: "jordan-b",
    name: "Jordan B.",
    stage: "Postpartum",
    stageDetail: "6 weeks postpartum · baby 6w",
    delivery: "Vaginal, 40w",
    riskFactors: [],
    triage: "green",
    triageReason: "Normal spit-up, feeding well, no red flags",
    triageContributions: [
      { input: "Spit-up after feeds", reason: "Normal infant reflux pattern" },
      { input: "Diaper output normal", reason: "Adequate hydration" },
    ],
    recommendedAction: "Education sent · no clinical action needed",
    whenToEscalate: "Fever, decreased feeding, projectile vomiting",
    currentIssue: "Baby spit-up after most feeds, mom unsure if normal",
    latestVitals: "Mom BP 116/72 · baby weight on curve",
    babySummary: "Spit-up normal, feeding well, 8 wet diapers",
    moodScreen: "EPDS 4",
    wearable: {
      restingHr: 68,
      restingHrTrend: "steady",
      hrv: 56,
      hrvTrend: "steady",
      stressScore: 28,
      sleepHours: 6.4,
      sleepQuality: "good",
      steps: 6210,
      source: "Apple Watch",
    },
    selfReports: [
      {
        date: "Today",
        mood: 8,
        energy: 7,
        pain: 1,
        note: '"Mostly good. Just want to know spit-up is normal."',
      },
    ],
    recent: [
      { date: "Today 07:48", kind: "triage", text: "Cocuna RAD: Green — education sent" },
      { date: "Today 07:46", kind: "message", text: '"Baby spits up after every feed — should I worry?"' },
      { date: "Yesterday", kind: "log", text: "Feed logged · 7am" },
    ],
    qualitative:
      "Confident and asking the right questions early. Loves having someone to check normal-vs-not-normal with — that's most of what she needs from us this month.",
  },
];

export function patientById(id: string): Patient | undefined {
  return PATIENTS.find((p) => p.id === id);
}

export function generateClinicianSummary(p: Patient): string {
  const risk = p.riskFactors.length ? `, history of ${p.riskFactors.join(" + ")}` : "";
  const baby = p.babySummary ? ` Baby: ${p.babySummary.toLowerCase()}.` : "";
  const mood = p.moodScreen ? ` Mood screen ${p.moodScreen}.` : "";
  const action = p.recommendedAction.toLowerCase();
  return `${p.name}, ${p.stageDetail.toLowerCase()}${p.delivery ? ` after ${p.delivery.toLowerCase()}` : ""}${risk}. Current issue: ${p.currentIssue.toLowerCase()}.${p.latestVitals ? ` ${p.latestVitals}.` : ""}${baby}${mood} Cocuna triage: ${TRIAGE_LABEL[p.triage]} — ${p.triageReason}. Recommended action: ${action}.`;
}

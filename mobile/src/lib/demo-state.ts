import { Platform } from 'react-native';

import { create } from './tiny-store';
import type { Stage, TriageLevel } from './triage';

export type LogKind = 'bp' | 'mood' | 'feeding' | 'diapers' | 'glucose' | 'kicks';

// 'pregnancy-28w' / 'postpartum-6w' kept for backwards compat with the
// pre-demo two-state toggle. The three demo personas (maria/jane/sophia)
// extend this without breaking the existing switch.
export type StageDemo =
  | 'pregnancy-28w'
  | 'postpartum-6w'
  | 'pregnancy-34w-maria'
  | 'postpartum-12w-jane'
  | 'pregnancy-28w-sophia';

export type DemoPersona = 'maria' | 'jane' | 'sophia' | null;

export type DemoState = {
  name: string | null;
  stage: Stage;
  stageDemo: StageDemo;
  persona: DemoPersona;
  weeksPregnant: number;
  daysPostpartum: number;
  babyAgeDays: number;
  momStatus: TriageLevel;
  babyStatus: TriageLevel;
  babyStatusLabel: string;
  nextCheckin: string;
  logsToday: LogKind[];
  bpStreakDays: number;
  kickStreakDays: number;
  hasOnboarded: boolean;
  // Optional passive-decline signal trail. Surfaced on jane-silence screen.
  silenceSignals?: SilenceSignal[];
};

export type SilenceSignal = {
  id: string;
  label: string;
  value: string;
  trend: 'down' | 'up' | 'flat';
  hint: string;
};

const PREGNANCY_28W: DemoState = {
  name: null,
  stage: 'pregnant',
  stageDemo: 'pregnancy-28w',
  persona: null,
  weeksPregnant: 28,
  daysPostpartum: 0,
  babyAgeDays: 0,
  momStatus: 'green',
  babyStatus: 'green',
  babyStatusLabel: 'Baby',
  nextCheckin: 'Thursday · 2:30 PM (28wk visit)',
  logsToday: ['kicks'],
  bpStreakDays: 5,
  kickStreakDays: 4,
  hasOnboarded: false,
};

const POSTPARTUM_6W: DemoState = {
  name: null,
  stage: 'postpartum',
  stageDemo: 'postpartum-6w',
  persona: null,
  weeksPregnant: 0,
  daysPostpartum: 42,
  babyAgeDays: 42,
  momStatus: 'green',
  babyStatus: 'green',
  babyStatusLabel: 'Baby',
  nextCheckin: 'Tomorrow · 9:00 AM (6wk visit)',
  logsToday: ['bp', 'feeding'],
  bpStreakDays: 12,
  kickStreakDays: 0,
  hasOnboarded: false,
};

// Maria — 34w pregnant, gestational hypertension history.
// Demo arc: she'll send the preeclampsia opener that flips Mom badge to red.
const PREGNANCY_34W_MARIA: DemoState = {
  name: 'Maria',
  stage: 'pregnant',
  stageDemo: 'pregnancy-34w-maria',
  persona: 'maria',
  weeksPregnant: 34,
  daysPostpartum: 0,
  babyAgeDays: 0,
  momStatus: 'green',
  babyStatus: 'green',
  babyStatusLabel: 'Baby',
  nextCheckin: 'In 9 days · OB visit',
  logsToday: ['kicks', 'bp'],
  bpStreakDays: 8,
  kickStreakDays: 7,
  hasOnboarded: true,
};

// Jane — 12w postpartum after C-section, in the "silence" state.
// Demo arc: passive-decline screen → Hera proactive check-in → video visit.
const POSTPARTUM_12W_JANE: DemoState = {
  name: 'Jane',
  stage: 'postpartum',
  stageDemo: 'postpartum-12w-jane',
  persona: 'jane',
  weeksPregnant: 0,
  daysPostpartum: 84,
  babyAgeDays: 84,
  momStatus: 'gray',
  babyStatus: 'gray',
  babyStatusLabel: 'Baby',
  nextCheckin: 'No upcoming check-in',
  logsToday: [],
  bpStreakDays: 0,
  kickStreakDays: 0,
  hasOnboarded: true,
  silenceSignals: [
    {
      id: 'sleep',
      label: 'Sleep',
      value: '−47% (7-day avg)',
      trend: 'down',
      hint: 'Wearable: 3.8h / night, fragmented.',
    },
    {
      id: 'activity',
      label: 'Activity',
      value: '−86% (7-day avg)',
      trend: 'down',
      hint: 'Steps below 1,200 / day. Was 8,400 baseline.',
    },
    {
      id: 'baby-logs',
      label: 'Baby logs',
      value: 'None for 5 days',
      trend: 'flat',
      hint: 'No feeds, diapers, or sleep entries since Sunday.',
    },
    {
      id: 'app-opens',
      label: 'App opens',
      value: 'None for 4 days',
      trend: 'flat',
      hint: 'Last opened at 2:14 AM on Monday.',
    },
  ],
};

// Sophia — 28w pregnant, stable, routine. Used to anchor the demo as the
// "green" comparison so judges see what calm looks like.
const PREGNANCY_28W_SOPHIA: DemoState = {
  name: 'Sophia',
  stage: 'pregnant',
  stageDemo: 'pregnancy-28w-sophia',
  persona: 'sophia',
  weeksPregnant: 28,
  daysPostpartum: 0,
  babyAgeDays: 0,
  momStatus: 'green',
  babyStatus: 'green',
  babyStatusLabel: 'Baby',
  nextCheckin: 'Monday · 10:30 AM (28wk visit)',
  logsToday: ['kicks', 'glucose'],
  bpStreakDays: 14,
  kickStreakDays: 12,
  hasOnboarded: true,
};

const STAGE_PRESETS: Record<StageDemo, DemoState> = {
  'pregnancy-28w': PREGNANCY_28W,
  'postpartum-6w': POSTPARTUM_6W,
  'pregnancy-34w-maria': PREGNANCY_34W_MARIA,
  'postpartum-12w-jane': POSTPARTUM_12W_JANE,
  'pregnancy-28w-sophia': PREGNANCY_28W_SOPHIA,
};

// Order used by the home demo pill. Cycles Maria → Jane → Sophia → loop.
export const DEMO_PERSONA_CYCLE: StageDemo[] = [
  'pregnancy-34w-maria',
  'postpartum-12w-jane',
  'pregnancy-28w-sophia',
];

const STORAGE_KEY = 'cocuna-demo-state-v2';

function loadPersisted(): DemoState {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return PREGNANCY_34W_MARIA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return PREGNANCY_34W_MARIA;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    const preset = STAGE_PRESETS[parsed.stageDemo ?? 'pregnancy-34w-maria'];
    return { ...preset, ...parsed };
  } catch {
    return PREGNANCY_34W_MARIA;
  }
}

export const demoStore = create<DemoState>(loadPersisted());

function persist(s: DemoState) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

demoStore.subscribe(() => persist(demoStore.get()));

export function useDemoState() {
  return demoStore.useStore();
}

export function logToday(kind: LogKind) {
  const cur = demoStore.get();
  if (cur.logsToday.includes(kind)) return;
  demoStore.set({ logsToday: [...cur.logsToday, kind] });
}

export function completeOnboarding(name: string, stage: Stage) {
  const stageDemo: StageDemo = stage === 'pregnant' ? 'pregnancy-28w' : 'postpartum-6w';
  const preset = STAGE_PRESETS[stageDemo];
  demoStore.set({ ...preset, name, stage, hasOnboarded: true });
}

// Backwards-compat: still flips between the two original presets.
// The home pill now uses `cycleDemoPersona` which walks the canonical
// Maria → Jane → Sophia loop. Keep this so any older callers don't break.
export function switchStageDemo() {
  const cur = demoStore.get();
  const next: StageDemo =
    cur.stageDemo === 'pregnancy-28w' ? 'postpartum-6w' : 'pregnancy-28w';
  const preset = STAGE_PRESETS[next];
  demoStore.set({ ...preset, name: cur.name, hasOnboarded: cur.hasOnboarded });
}

// Cycle Maria → Jane → Sophia → Maria. Used by the demo pill on Home.
export function cycleDemoPersona() {
  const cur = demoStore.get();
  const idx = DEMO_PERSONA_CYCLE.indexOf(cur.stageDemo as StageDemo);
  const next = DEMO_PERSONA_CYCLE[(idx + 1) % DEMO_PERSONA_CYCLE.length];
  const preset = STAGE_PRESETS[next];
  // Preserve onboarded flag so we don't bounce back to onboarding mid-demo.
  demoStore.set({ ...preset, hasOnboarded: true });
}

export function setPersona(persona: 'maria' | 'jane' | 'sophia') {
  const stageDemo: StageDemo =
    persona === 'maria'
      ? 'pregnancy-34w-maria'
      : persona === 'jane'
        ? 'postpartum-12w-jane'
        : 'pregnancy-28w-sophia';
  const preset = STAGE_PRESETS[stageDemo];
  demoStore.set({ ...preset, hasOnboarded: true });
}

export function nextPersonaLabel(stageDemo: StageDemo): string {
  const idx = DEMO_PERSONA_CYCLE.indexOf(stageDemo);
  // If not currently on a canonical persona, advance to the first.
  const nextIdx = idx === -1 ? 0 : (idx + 1) % DEMO_PERSONA_CYCLE.length;
  const next = DEMO_PERSONA_CYCLE[nextIdx];
  if (next === 'pregnancy-34w-maria') return 'Maria · 34w pregnant';
  if (next === 'postpartum-12w-jane') return 'Jane · 12w postpartum';
  return 'Sophia · 28w pregnant';
}

export function isPregnancy(s: DemoState): boolean {
  return s.stage === 'pregnant';
}

export function resetDemo() {
  demoStore.set(PREGNANCY_34W_MARIA);
}

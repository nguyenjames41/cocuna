import { Platform } from 'react-native';

import { create } from './tiny-store';
import type { Stage, TriageLevel } from './triage';

export type LogKind = 'bp' | 'mood' | 'feeding' | 'diapers' | 'glucose' | 'kicks';

export type StageDemo = 'pregnancy-28w' | 'postpartum-6w';

export type DemoState = {
  name: string | null;
  stage: Stage;
  stageDemo: StageDemo;
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
};

const PREGNANCY_28W: DemoState = {
  name: null,
  stage: 'pregnant',
  stageDemo: 'pregnancy-28w',
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

const STAGE_PRESETS: Record<StageDemo, DemoState> = {
  'pregnancy-28w': PREGNANCY_28W,
  'postpartum-6w': POSTPARTUM_6W,
};

const STORAGE_KEY = 'cocuna-demo-state-v2';

function loadPersisted(): DemoState {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return POSTPARTUM_6W;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return POSTPARTUM_6W;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    const preset = STAGE_PRESETS[parsed.stageDemo ?? 'postpartum-6w'];
    return { ...preset, ...parsed };
  } catch {
    return POSTPARTUM_6W;
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

export function switchStageDemo() {
  const cur = demoStore.get();
  const next: StageDemo =
    cur.stageDemo === 'pregnancy-28w' ? 'postpartum-6w' : 'pregnancy-28w';
  const preset = STAGE_PRESETS[next];
  demoStore.set({ ...preset, name: cur.name, hasOnboarded: cur.hasOnboarded });
}

export function isPregnancy(s: DemoState): boolean {
  return s.stage === 'pregnant';
}

export function resetDemo() {
  demoStore.set(POSTPARTUM_6W);
}

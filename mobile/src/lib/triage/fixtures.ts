import type { PatientSignals } from './types';

export type Patient = {
  id: string;
  name: string;
  stage: string;
  delivery?: string;
  riskFactors?: string[];
  signals: PatientSignals;
};

export const PATIENTS: Patient[] = [
  {
    id: 'maria-s',
    name: 'Maria S.',
    stage: '8 days postpartum',
    delivery: 'Vaginal, 39w2d',
    riskFactors: ['gestational-hypertension'],
    signals: {
      daysPostpartum: 8,
      bp: { systolic: 158, diastolic: 102 },
      symptoms: ['severe-headache'],
      visualSymptoms: true,
      riskFactors: ['gestational-hypertension'],
      moodScore: 4,
      alone: true,
    },
  },
  {
    id: 'ana-r',
    name: 'Ana R.',
    stage: '32 weeks pregnant',
    signals: {
      weeksPregnant: 32,
      moodScore: 17,
      symptoms: ['insomnia', 'anxiety'],
    },
  },
  {
    id: 'emily-t',
    name: 'Emily T.',
    stage: '4 weeks postpartum',
    delivery: 'C-section, 38w6d',
    signals: {
      daysPostpartum: 28,
      symptoms: ['breastfeeding-pain', 'low-supply-concern'],
      moodScore: 6,
    },
  },
  {
    id: 'jordan-b',
    name: 'Jordan B.',
    stage: 'baby 6 weeks',
    signals: {
      daysPostpartum: 42,
      babyAgeDays: 42,
      symptoms: ['normal-spit-up'],
      moodScore: 3,
    },
  },
];

export const PATIENT_BY_ID = Object.fromEntries(
  PATIENTS.map((p) => [p.id, p]),
);

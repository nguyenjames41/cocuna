export type TriageLevel = 'red' | 'orange' | 'yellow' | 'green' | 'gray';

export type Stage = 'ttc' | 'pregnant' | 'postpartum' | 'toddler';

export type PatientSignals = {
  daysPostpartum?: number;
  weeksPregnant?: number;
  bp?: { systolic: number; diastolic: number };
  symptoms?: string[];
  moodScore?: number;
  selfHarmIdeation?: boolean;
  babyAgeDays?: number;
  babyTempF?: number;
  riskFactors?: string[];
  visualSymptoms?: boolean;
  chestPain?: boolean;
  breathingIssue?: boolean;
  seizure?: boolean;
  heavyBleeding?: boolean;
  alone?: boolean;
  decreasedFetalMovement?: boolean;
  contractionsPerHour?: number;
  swelling?: boolean;
};

export type TriageContribution = {
  input: string;
  weight: number;
  reason: string;
};

export type TriageDecision = {
  level: TriageLevel;
  score: number;
  reason: string;
  contributions: TriageContribution[];
  recommendedAction: string;
  whenToEscalate: string;
  notifyClinic: boolean;
  sourceProtocol: string;
};

import { triage } from './rules';
import type { PatientSignals } from './types';

export function careAttentionScore(signals: PatientSignals) {
  const decision = triage(signals);
  return {
    score: decision.score,
    level: decision.level,
    contributions: decision.contributions,
  };
}

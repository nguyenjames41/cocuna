// Mother-app demo-data barrel. Scripted Hera dialogue + Care Attention Score
// fixtures for the two demo personas. Imported by the Chat screen and the
// new passive-decline / proactive check-in screens.
//
// See sibling `lib/demo-data/` on the clinic side for the same numbers
// rendered for the clinic dashboard.

import type { RADResponse, ChatMessage } from '@/lib/claude/schema';

// Re-export Maria's exports verbatim.
export {
  MARIA,
  MARIA_SEED_ID,
  MARIA_SEED_PROMPT,
  MARIA_SEED_LABEL,
  MARIA_SCRIPT,
  MARIA_ER_HANDOFF_TEXT,
  MARIA_ER_HANDOFF_FIELDS,
  MARIA_CARE_SCORE,
  MARIA_BASELINE,
  MARIA_DEMO_DAY,
  matchMariaScript,
} from './maria';

// Re-export Jane's exports verbatim. `CareScoreDriver` and `ScriptedTurn`
// exist in both modules with identical shapes; re-export Jane's via aliases
// (and the Maria ones via aliases) so consumers can pick a specific one.
export {
  JANE,
  JANE_SEED_ID,
  JANE_SEED_PROMPT,
  JANE_SEED_LABEL,
  JANE_PUSH_NOTIFICATION,
  JANE_SCRIPT,
  JANE_VIDEO_VISIT,
  JANE_VIDEO_VISIT_TEXT,
  JANE_CARE_SCORE,
  JANE_PASSIVE_TIMELINE,
  JANE_BASELINE,
  JANE_THIS_WEEK,
  matchJaneScript,
} from './jane';

// Shared / disambiguated type re-exports.
export type {
  HandoffField,
  ScriptedTurn as MariaScriptedTurn,
  CareScoreDriver as MariaCareScoreDriver,
} from './maria';

export type {
  ScriptedTurn as JaneScriptedTurn,
  CareScoreDriver as JaneCareScoreDriver,
  PassiveDay,
  VideoVisitCard,
} from './jane';

import { matchMariaScript } from './maria';
import { matchJaneScript } from './jane';

/**
 * Convenience: try Maria's script first, then Jane's. Returns the first
 * scripted match, or null if nothing scripted applies (caller falls back to
 * the live Anthropic path via lib/claude/client.ts).
 */
export function matchScriptedResponse(input: {
  lastUserMessage?: string;
  lastFollowupOptionId?: string;
  history?: ChatMessage[];
}): RADResponse | null {
  return matchMariaScript(input) ?? matchJaneScript(input);
}

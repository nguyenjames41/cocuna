// Demo-data barrel. Source of truth for Maria + Jane numbers and dialogue
// on the clinic dashboard side. The mobile app has its own mirrors under
// mobile/src/demo-data/ that share the same numbers but tune the Hera text
// to the Edge-Function voice rules (no em dashes, no hyphenated compounds).

// Maria — named exports (avoid `export *` collisions on shared type names
// like Baseline, CareScore, etc. that exist in both modules).
export {
  MARIA,
  MARIA_BASELINE,
  MARIA_DEMO_DAY,
  MARIA_CARE_SCORE,
  MARIA_HERA_DIALOGUE,
  MARIA_ER_HANDOFF_TEXT,
  MARIA_ER_HANDOFF_FIELDS,
  MARIA_VITALS_TIMELINE,
} from './maria';

export type {
  Baseline as MariaBaseline,
  DemoDay as MariaDemoDay,
  CareScore as MariaCareScore,
  CareScoreDriver as MariaCareScoreDriver,
  HeraDialogue as MariaHeraDialogue,
  HeraFollowup as MariaHeraFollowup,
  HeraFollowupOption as MariaHeraFollowupOption,
  HeraMessage as MariaHeraMessage,
  HandoffField,
  VitalsDay,
} from './maria';

// Jane — named exports.
export {
  JANE,
  JANE_BASELINE,
  JANE_THIS_WEEK,
  JANE_CARE_SCORE,
  JANE_PUSH_NOTIFICATION,
  JANE_HERA_DIALOGUE,
  JANE_VIDEO_VISIT,
  JANE_VIDEO_VISIT_TEXT,
  JANE_PASSIVE_TIMELINE,
} from './jane';

export type {
  Baseline as JaneBaseline,
  DemoWeek as JaneDemoWeek,
  CareScore as JaneCareScore,
  CareScoreDriver as JaneCareScoreDriver,
  HeraFollowup as JaneHeraFollowup,
  HeraFollowupOption as JaneHeraFollowupOption,
  HeraMessage as JaneHeraMessage,
  VideoVisitCard,
  PassiveDay,
} from './jane';

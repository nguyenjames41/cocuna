import type { TriageDecision } from '@/lib/triage';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type FollowupOption = {
  id: string;
  label: string;
};

export type FollowupQuestion = {
  question: string;
  options?: FollowupOption[];
};

export type RADResponse = {
  acknowledgement: string;
  followup: FollowupQuestion | null;
  decision: TriageDecision | null;
};

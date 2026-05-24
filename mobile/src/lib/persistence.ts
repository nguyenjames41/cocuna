import { ensureAnonSession, supabase } from './supabase';
import type { LogKind } from './demo-state';
import type { TriageDecision } from './triage';

/**
 * Best-effort writes to Supabase. Never throw — demo continues offline.
 */

const THREAD_ID_KEY = 'cocuna-thread-id';

function getOrMakeThreadId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  try {
    let id = window.localStorage.getItem(THREAD_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(THREAD_ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export async function persistTriageDecision(
  decision: TriageDecision,
  userText: string,
  stageDetail: string,
): Promise<void> {
  if (!supabase) return;
  try {
    const userId = await ensureAnonSession();
    if (!userId) return;
    const threadId = getOrMakeThreadId();

    // Store the user's message
    await supabase.from('chat_messages').insert({
      user_id: userId,
      thread_id: threadId,
      role: 'user',
      content: userText,
    });

    // Store the triage decision
    await supabase.from('triage_decisions').insert({
      user_id: userId,
      thread_id: threadId,
      level: decision.level,
      score: decision.score ?? 0,
      reason: decision.reason ?? '',
      contributions: decision.contributions ?? [],
      recommended_action: decision.recommendedAction ?? '',
      when_to_escalate: decision.whenToEscalate ?? '',
      notify_clinic: decision.notifyClinic ?? false,
      source_protocol: decision.sourceProtocol ?? `Cocuna RAD v0.1 · ${stageDetail}`,
    });
  } catch (err) {
    console.warn('[cocuna] persistTriageDecision failed', err);
  }
}

export async function persistLog(
  kind: LogKind,
  fields: {
    systolic?: number;
    diastolic?: number;
    moodScore?: number;
    glucoseMgDl?: number;
    kicksInHour?: number;
    note?: string;
  } = {},
): Promise<void> {
  if (!supabase) return;
  try {
    const userId = await ensureAnonSession();
    if (!userId) return;
    await supabase.from('logs').insert({
      user_id: userId,
      kind,
      systolic: fields.systolic ?? null,
      diastolic: fields.diastolic ?? null,
      mood_score: fields.moodScore ?? null,
      glucose_mg_dl: fields.glucoseMgDl ?? null,
      kicks_in_hour: fields.kicksInHour ?? null,
      note: fields.note ?? null,
    });
  } catch (err) {
    console.warn('[cocuna] persistLog failed', err);
  }
}

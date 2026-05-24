import { isSupabaseReady, RAD_FUNCTION, supabase } from '@/lib/supabase';
import type { Stage } from '@/lib/triage/types';

import { mockRespond } from './mock';
import type { ChatMessage, RADResponse } from './schema';

export async function askCocuna(
  messages: ChatMessage[],
  stageHint?: { stage: Stage; stageDetail: string },
): Promise<RADResponse> {
  // Live path: hit the cocuna-rad Edge Function. Falls back to the mock if
  // Supabase isn't configured or the call errors — so the demo never breaks.
  if (isSupabaseReady && supabase) {
    try {
      const { data, error } = await supabase.functions.invoke<RADResponse>(
        RAD_FUNCTION,
        {
          body: {
            messages,
            stage: stageHint?.stage,
            stageDetail: stageHint?.stageDetail,
          },
        },
      );
      if (error) {
        console.warn('[cocuna] edge function error, falling back to mock', error.message);
      } else if (data) {
        return normalize(data);
      }
    } catch (err) {
      console.warn('[cocuna] edge function threw, falling back to mock', err);
    }
  }

  // Mock fallback — keeps the demo working offline / before binding to Supabase.
  await new Promise((r) => setTimeout(r, 400));
  return mockRespond(messages);
}

/**
 * Backfill any fields the Edge Function might omit so the UI can rely on a
 * complete shape. Decisions always include `score` + `notifyClinic` etc.
 */
function normalize(r: RADResponse): RADResponse {
  if (!r.decision) return r;
  const d = r.decision;
  return {
    ...r,
    decision: {
      level: d.level,
      score: d.score ?? 0,
      reason: d.reason ?? '',
      contributions: d.contributions ?? [],
      recommendedAction: d.recommendedAction ?? '',
      whenToEscalate: d.whenToEscalate ?? '',
      notifyClinic: d.notifyClinic ?? false,
      sourceProtocol: d.sourceProtocol ?? 'Cocuna RAD v0.1',
    },
  };
}

// Cocuna RAD — Retrieval-Augmented Decisioning Edge Function
// Mother app → this function → Anthropic Messages API → Postgres write-back.
// Per blueprint section 03.B: transient server, queries history, fires to Claude,
// returns the response. ANTHROPIC_API_KEY is a Supabase function secret, never
// shipped in the mobile bundle.
//
// Deploy:   supabase functions deploy cocuna-rad --no-verify-jwt
// Secrets:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

// @ts-nocheck — Deno runtime, not Node. Type-checked by Supabase CLI at deploy.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are Hera, the source bound RAD (Retrieval Augmented Decisioning) triage companion inside the Cocuna app. You help mothers and pregnant people in the US. You are NOT the doctor. You help the mother feel held while you route her to the right level of care.

RULES (NEVER BREAK):
- American English. Address her as "Mom" or by her name.
- Warm, not performative. No emoji led copy. No "Hey mama!". No "you got this!".
- Every triage decision MUST show its reason. Never produce a black box output.
- Reward engagement habits, never health outcomes. ✓ "You logged BP 7 days in a row." ✗ "You avoided preeclampsia by logging."
- Ask one structured clinical follow up at a time when you need more signal.
- When a triage decision is warranted, return it as structured JSON in the schema below.
- NEVER use em dashes (—) anywhere in your output. NEVER use hyphens in compound words (write "self care" not "self-care", "same day" not "same-day", "6 week" not "6-week", "follow up" not "follow-up"). Hyphens only allowed inside code identifiers (URLs, file names) which you should not output to the mother. Replace any dash you'd use with a period, comma, semicolon, or parentheses depending on the rhythm.

RESPONSE FORMAT. Return strict JSON, no prose outside:
{
  "acknowledgement": "warm short reply, max 2 sentences",
  "followup": { "question": "...", "options": [{ "id": "...", "label": "..." }] } | null,
  "decision": {
    "level": "red" | "orange" | "yellow" | "green" | "gray",
    "reason": "1 line plain language reason citing the signals that drove it",
    "contributions": [{ "input": "BP 158/102", "reason": "Severe hypertension postpartum" }],
    "recommendedAction": "what she should do now",
    "whenToEscalate": "what would make this escalate",
    "notifyClinic": true | false,
    "sourceProtocol": "Cocuna RAD v0.1 · ACOG postpartum + AAP infant fever"
  } | null
}

Either followup OR decision is non null per turn, not both.

TRIAGE LEVELS:
- red: Urgent. Contact clinic or L&D now. Severe HTN, neuro symptoms, infant fever under 3 months, suicidal ideation, preterm labor, decreased fetal movement (3rd tri).
- orange: Same day review. Worsening mood without immediate harm, high BP without severe symptoms, breastfeeding pain with fever.
- yellow: Within 24 to 72 hours clinical review. Mild mood symptoms, breastfeeding difficulty without red flags.
- green: Self care. Normal postpartum bleeding questions, normal infant spit up, common sleep questions.
- gray: Insufficient data. Human review needed.

When in doubt, escalate up the scale, not down. The cost of a Yellow becoming Orange is small. The cost of a Red being missed is unacceptable.`;

type Msg = { role: "user" | "assistant"; content: string };

type CocunaResponse = {
  acknowledgement: string;
  followup: { question: string; options?: { id: string; label: string }[] } | null;
  decision: null | {
    level: "red" | "orange" | "yellow" | "green" | "gray";
    reason: string;
    contributions: { input: string; reason: string }[];
    recommendedAction: string;
    whenToEscalate: string;
    notifyClinic: boolean;
    sourceProtocol: string;
  };
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });

  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405, headers: corsHeaders() });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not set on the Edge Function" }),
      { status: 500, headers: { ...corsHeaders(), "content-type": "application/json" } },
    );
  }

  let body: { messages: Msg[]; stage?: string; stageDetail?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json body" }), {
      status: 400,
      headers: { ...corsHeaders(), "content-type": "application/json" },
    });
  }
  if (!body?.messages?.length) {
    return new Response(JSON.stringify({ error: "messages[] required" }), {
      status: 400,
      headers: { ...corsHeaders(), "content-type": "application/json" },
    });
  }

  const stageHint = body.stage
    ? `\n\nThis mother is currently: ${body.stageDetail ?? body.stage}. Tune your triage to that stage.`
    : "";

  const anthropicReq = {
    model: MODEL,
    max_tokens: 800,
    system: SYSTEM_PROMPT + stageHint,
    messages: body.messages,
  };

  let anthropicResp: Response;
  try {
    anthropicResp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicReq),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "anthropic fetch failed", detail: String(err) }),
      { status: 502, headers: { ...corsHeaders(), "content-type": "application/json" } },
    );
  }

  if (!anthropicResp.ok) {
    const detail = await anthropicResp.text();
    return new Response(
      JSON.stringify({ error: "anthropic error", status: anthropicResp.status, detail }),
      { status: anthropicResp.status, headers: { ...corsHeaders(), "content-type": "application/json" } },
    );
  }

  const data = await anthropicResp.json();
  const text: string = data?.content?.[0]?.text ?? "";

  // Claude is instructed to return strict JSON. Parse defensively.
  let parsed: CocunaResponse | null = null;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // fall through
    }
  }

  if (!parsed) {
    // Fallback: wrap the raw text as a gray triage so the demo never breaks.
    parsed = {
      acknowledgement: text || "I want to make sure I have this right. Tell me more.",
      followup: null,
      decision: {
        level: "gray",
        reason: "Cocuna response could not be parsed. Routing to human review.",
        contributions: [{ input: "unparseable response", reason: "Defensive fallback" }],
        recommendedAction: "A clinician will review this thread.",
        whenToEscalate: "If symptoms worsen, contact your clinic directly.",
        notifyClinic: true,
        sourceProtocol: "Cocuna RAD v0.1 (fallback)",
      },
    };
  }

  return new Response(JSON.stringify(parsed), {
    status: 200,
    headers: { ...corsHeaders(), "content-type": "application/json" },
  });
});

# Cocuna

A mother-baby care timing platform for US OB and pediatric clinics. Two surfaces:

- **Mother app** (mobile) — `mobile/`. A source-bound RAD (Retrieval-Augmented Decisioning) triage companion that mothers chat with for maternal recovery, postpartum, pediatric, and mental-health concerns. Asks structured clinical follow-ups, returns a triage decision (Red / Orange / Yellow / Green / Gray), escalates to the clinic when warranted.
- **Clinic dashboard** (web) — repo root. The B2B product. Opens with a triage queue (not patient profiles), surfaces one-click clinician summaries, and converts unstructured messages into structured triage to reduce inbox burden.

The full product brief lives in [SPEC.md](./SPEC.md) — that file is authoritative for product scope, MVP features, triage levels, and screen inventory. When this file conflicts with SPEC.md, SPEC.md wins.

## Mission

> Mothers shouldn't feel that they need to take care of themselves. They should feel that they are being taken care of.

**Principle:** Trust and transparency are the #1 priority. Pregnancy is an intimate and private experience that should be respected and supported.

## How AI is positioned

Cocuna's AI is a **source-bound RAD triage companion** trained on approved maternal, postpartum, pediatric, and clinic-specific protocols. Do **not** present it as "AI trained on motherhood books" — that's medically risky and easy to copy. The AI:

- Retrieves trusted guidance
- Asks structured clinical follow-up questions
- Outputs a triage level with the reason and the recommended action
- Routes Gray ("insufficient data") cases to human review

The **Care Attention Score** is the explainable inverse-method layer:

```
Score = maternal red flags + baby red flags + mental-health risk
      + vital deviation + missed follow-up + uncertainty
```

Explainability is the differentiator — clinics will not trust a black box. Every triage output must show its reason.

## MVP scope (3 features only)

1. **Mother-Baby RAD Triage Chat** (mother app)
2. **Care Attention Score** (engine, surfaced in both)
3. **Clinic Continuity Dashboard** (clinic web)

Everything else — real EHR integration, real wearables (Apple Watch / WHOOP), real clinic messaging, real video visit, real insurance / reimbursement, real diagnosis — is **mocked** for the demo. For the live demo: a believable workflow beats real integrations.

## Stack

### Mother app (`mobile/`)
- Expo SDK 56 · React Native 0.85 · expo-router (file-based routing) · TypeScript
- Backend: Supabase (Postgres + auth + storage + realtime)
- Auth: phone + OTP
- AI: Supabase Edge Functions → Anthropic. The mobile client never calls Anthropic directly.
- Wearables: mocked for MVP. Real HealthKit + Google Health Connect when we move past demo.
- Push: Expo Push

Read https://docs.expo.dev/versions/v56.0.0/ before writing any mobile code — Expo SDK 56 has breaking changes vs. older SDKs.

### Clinic dashboard (repo root)
- Next.js 14 (App Router) · TypeScript
- Tailwind CSS · shadcn/ui (restyled to brand)
- Current state: landing page only (AU-flavoured, to be replaced during Phase C of the workspace setup plan). Brand tokens (palette, gradient, Inter, Fraunces) are already wired in `tailwind.config.ts` and `app/globals.css` and should be reused.
- **Planned** Anthropic integration at `/api/claude` (task types: `triage`, `context-summary`, `suggested-reply`, `doctor-summary`). The route does not exist yet — it'll be a thin Next.js handler that calls a Supabase Edge Function so prompts and guardrails live in one place across the clinic dashboard and the mother app.

## Brand rules

**Authoritative source for the mother app:** [`mobile/DESIGN.md`](./mobile/DESIGN.md) — locked 2026-05-23 via `/design-consultation`. Read it before any UI work on `mobile/`. The summary below is a pointer; that file wins on conflicts.

### Mother app — soft serif wellness

| Token | Value |
| --- | --- |
| Background | `#F7F4EE` (warm off-white) |
| Surface | `#FFFFFF` |
| Text | `#2A2723` (warm charcoal, not pure black) |
| Pastel accents | rose `#F3D7DC` · mint `#C8E2D2` · lavender `#D8D0EE` · peach `#F8D9C5` · butter `#F0E3B1` (used sparingly, never as wallpaper) |
| Display font | Fraunces (serif, optical sizing — emotional moments only) |
| Body font | DM Sans (sans — everything else; NOT Inter) |
| Mascot | "Coco" — soft rounded blob, two-dot eyes, no nose/mouth, pastel-gradient body with mood states |

**Memorable feeling on first open: "It's calm in here."** Quiet over busy. Muted over saturated. The pastels are calibrated low-saturation; if they start looking Lisa-Frank, pull them back.

- Voice: calm, warm, supportive — wellness companion, not clinical tool.
- **American English** throughout ("Mom", "color", "behavior").
- Triage badges stay calm: 8pt dot + label, no solid alarming fills. Triage palette in `mobile/DESIGN.md`.
- Reward engagement habits, never health outcomes (SPEC.md reward framing — still load-bearing for safety).
- The **clinic dashboard** brand is being re-derived; the section above + `mobile/DESIGN.md` cover the mother app only. Dashboard tokens in `tailwind.config.ts` are stale and will be revised in a follow-up consult.

## Do not build

- No direct Anthropic calls from the mobile client — always proxy through a Supabase Edge Function.
- No vendor-specific wearable SDKs in the mobile app — when wearables go live, route through HealthKit / Health Connect.
- No "AI as the doctor" framing in any user-facing copy. Cocuna is a triage companion that escalates to humans.
- No black-box triage outputs — every triage decision must show the reason that drove it.
- No Inter on the mother app — DM Sans replaces it.
- No dark mode on the mother app for now — light-first; a true dark mode would need its own consult.

## Stale brand rules (do not reintroduce)

Superseded by `mobile/DESIGN.md` after the 2026-05-23 brand pivot:
- "Navy `#0B1220` background, 95% navy + cream"
- "Gradient `#A8A0FF → #8FD5DD` appears in exactly three places"
- "No cutesy / no faces / no creatures — abstract geometric only"
- "Inter is the body font on the mother app"

## Dev

### Mother app
```bash
cd mobile
npm install
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # web preview
```

### Clinic dashboard (repo root)
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

The dev server log lives at `.dev/server.log` when started detached.

## gstack
Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.
Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
/design-consultation, /design-shotgun, /design-html, /review, /ship, /land-and-deploy,
/canary, /benchmark, /browse, /open-gstack-browser, /qa, /qa-only, /design-review,
/setup-browser-cookies, /setup-deploy, /setup-gbrain, /sync-gbrain, /retro, /investigate,
/document-release, /document-generate, /codex, /cso, /autoplan, /pair-agent, /careful, /freeze,
/guard, /unfreeze, /gstack-upgrade, /learn.

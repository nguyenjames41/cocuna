# Cocuna

> Mothers shouldn't feel that they need to take care of themselves. They should feel that they are being taken care of.

Cocuna is the mother-baby care timing platform for US OB and pediatric clinics. Two surfaces:

- **Mother app** ([`mobile/`](./mobile)) — a source-bound RAD (Retrieval-Augmented Decisioning) triage companion mothers chat with for pregnancy, postpartum, baby, and mental-health concerns. Asks structured clinical follow-ups, returns a triage decision (Red / Orange / Yellow / Green / Gray), escalates to the clinic when warranted.
- **Clinic dashboard** (repo root, Next.js) — B2B continuity tool. Opens with the triage queue, surfaces a one-click chart-ready clinician summary, converts unstructured messages into structured triage to reduce inbox burden.

Full product brief in [SPEC.md](./SPEC.md). Mother-app brand in [mobile/DESIGN.md](./mobile/DESIGN.md).

---

## Demo modes

| Mode | URL / how to launch | What it shows |
| --- | --- | --- |
| **Mother — pregnancy 28w** | `mobile/` Expo · onboard or hit the demo switcher | Greeting tuned to 28wk, kick counts, glucose log, preeclampsia chat seeds, third-trimester care plan |
| **Mother — postpartum 6w** | `mobile/` Expo · default after onboarding | Greeting tuned to 6wk postpartum, BP + mood + feeding logs, postpartum chat seeds, 6-week visit care plan |
| **Clinic** | `/` (Next.js) | Triage queue → patient profile with HR/HRV/stress/sleep + qualitative self-reports + Care Attention Score → one-click clinician summary |
| **Investor** | `/investor` (Next.js) | Pitch walkthrough: problem · how-it-works · live patient example · differentiator · pilot targets |

The mother app's stage switcher (dashed pill at the bottom of Home) flips between pregnancy and postpartum demo state without re-onboarding.

---

## Stack

| Layer | Tech | Where |
| --- | --- | --- |
| Mother app | Expo SDK 56 · React Native 0.85 · expo-router · Reanimated 4 | [`mobile/`](./mobile) |
| Clinic dashboard | Next.js 14 (App Router) · Tailwind · shadcn primitives | repo root |
| Database & auth | Supabase Postgres · anonymous sign-in · RLS on every user table | [`supabase/migrations`](./supabase/migrations) |
| Serverless AI | Supabase Edge Function (Deno) → Anthropic Messages API | [`supabase/functions/cocuna-rad`](./supabase/functions/cocuna-rad) |
| AI engine | Claude Sonnet 4.6 | system prompt baked into the Edge Function |
| Mother app deploy | Expo web · `npm run web` (local dev) | — |
| Clinic deploy | Vercel | — |

The mother app **never** calls Anthropic directly. It calls the `cocuna-rad` Edge Function, which holds the key as a Supabase secret. Per blueprint section 03.C.

---

## Local dev

```bash
# Clinic dashboard
npm install
npm run dev                  # http://localhost:3000

# Mother app (in a separate terminal)
cd mobile
npm install
npm run web                  # http://localhost:8090
```

Without `.env` files, both apps run against the mock Claude responses and a localStorage demo state — nothing breaks, just no live AI.

---

## Wiring the backend

Per the [Claude Code App Development Blueprint](https://github.com/) — **never paste API keys into the chat with Claude Code.** Always drop them into `.env` files.

```bash
# 1. Copy env templates
cp .env.example .env
cp mobile/.env.example mobile/.env

# 2. Fill in your Supabase URL / anon key / service role key + Anthropic key
$EDITOR .env mobile/.env

# 3. Auth the CLIs (each opens a browser)
gh auth login
vercel login
supabase login

# 4. Bind to Supabase + deploy the Edge Function
supabase link --project-ref <YOUR_REF>
supabase db push                                          # applies migration with RLS
supabase functions deploy cocuna-rad --no-verify-jwt
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...         # key lives only on Supabase

# 5. Push to GitHub + deploy clinic to Vercel
gh repo create <USER>/cocuna --public --source=. --push
vercel link
vercel --prod
```

Full automated path lives in [`ops/deploy.sh`](./ops/deploy.sh) — reads from your `.env`, runs all of the above.

---

## Triage levels

Defined in [SPEC.md](./SPEC.md). Every Cocuna decision must show its reason — explainability is the differentiator.

| Level | When | Default clinic notify |
| --- | --- | --- |
| Red — urgent | Severe HTN, neuro symptoms, infant fever <3mo, suicidal ideation, preterm labor, decreased fetal movement (3rd tri) | On |
| Orange — same-day | Worsening mood, high BP without severe symptoms, infection signs | On |
| Yellow — 24-72h review | Breastfeeding difficulty, mild mood symptoms, persistent sleep loss | Off |
| Green — self-care | Normal postpartum bleeding questions, normal infant spit-up | Off |
| Gray — insufficient data | Vague symptom, conflicting answers, low model confidence | On (always human-reviewed) |

---

## Repo layout

```
├── app/                       # Clinic dashboard (Next.js App Router)
│   ├── page.tsx               # Triage queue
│   ├── investor/page.tsx      # Investor walkthrough
│   └── patient/[id]/page.tsx  # Patient profile
├── components/clinic/         # Clinic UI primitives
├── lib/clinic/patients.ts     # Mock patient fixtures
├── lib/supabase.ts            # Clinic Supabase client (public + service-role)
├── mobile/                    # Mother app (Expo)
│   ├── src/app/               # Onboarding, Home, Chat, Care plan, Companion
│   ├── src/components/        # Coco mascot, PastelCTA, Surface, StatusBadge, etc.
│   ├── src/lib/claude/        # Edge Function client + mock fallback
│   ├── src/lib/triage/        # Triage rules (postpartum + pregnancy)
│   ├── src/lib/supabase.ts    # Mobile Supabase client
│   └── DESIGN.md              # Mother-app brand (soft serif wellness)
├── supabase/
│   ├── config.toml            # Local Supabase config (RLS on, anon sign-in on)
│   ├── migrations/0001_initial.sql  # profiles + logs + chat_messages + triage_decisions
│   └── functions/cocuna-rad/  # RAD Edge Function (Deno → Anthropic)
├── ops/deploy.sh              # Idempotent deploy script for hackathon
├── CLAUDE.md                  # Build instructions for Claude Code
├── SPEC.md                    # Product brief (authoritative)
└── README.md                  # This file
```

---

## Brand

Mother app and clinic dashboard have different visual systems by design.

**Mother app — soft serif wellness.** Cream `#F7F4EE` background, muted pastels (rose / mint / lavender / peach / butter), Fraunces for emotional moments, DM Sans for everything else, a soft mascot ("Coco") with two-dot eyes and four mood states. Memorable feeling on first open: *"It's calm in here."* Locked via `/design-consultation` 2026-05-23. Full spec in [`mobile/DESIGN.md`](./mobile/DESIGN.md).

**Clinic dashboard — pastel sage.** Warm off-white background, sage-green primary accent, white cards with dense data layouts. Same triage palette as the mother app so the visual language for Red/Orange/Yellow/Green/Gray is consistent across surfaces.

Both surfaces share the brand mark (purple→teal gradient mother-and-baby silhouette) and the wordmark in Fraunces.

---

## License & credits

Built by James Nguyen with Claude Code (Opus 4.7 1M context).

Clinical references: ACOG postpartum guidance, AAP infant fever protocols, 2025 AHA postpartum HTN review, 2025 KLAS Arch Collaborative on EHR message burden.

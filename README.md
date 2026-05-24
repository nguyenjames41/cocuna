# Cocuna

> Mothers shouldn't feel that they need to take care of themselves.
> They should feel that they are being taken care of.

Cocuna is a mother-baby care continuity platform for US OB and pediatric clinics. Families get a calm, source-bound chat companion (Hera) for pregnancy, postpartum, and baby care. Clinics get an explainable triage queue that turns unstructured messages into ranked, contextual cases — so the right patient reaches the right clinician with no extra inbox.

---

## Live demos · click straight in

The hackathon submission is three working surfaces, all live on the web. No login or install — open and click around.

| | Surface | Live URL | What it is |
| --- | --- | --- | --- |
| 🌿 | **Landing page** | https://cocuna-care.lovable.app/ | The public site. Tells the story for mothers and clinics. "Book a demo" routes to the surface a visitor wants to see. |
| 💗 | **Mother app** | https://cocuna-mobile.vercel.app/ | The chat companion families use. Hera the calm AI companion, persona-aware (pregnancy / postpartum), soft check-ins, escalation to the clinic. |
| 🩺 | **Clinic dashboard** | https://cocuna.vercel.app/ | The triage queue care teams use. Ranked cases, explainable summaries, copilot, ROI view. |
| ↪ | **Demo router** | https://cocuna.vercel.app/go | The "Who's it for?" page reached from the landing's "Book a demo" button — picks mother or clinic and forwards. |

**GitHub:** https://github.com/nguyenjames41/cocuna · public, this repo.

> Tip for judges: open the **mother app** first, hit the "Demo · switch to Jane" pill at the bottom of Home to flip personas, then open the **clinic dashboard** to see what those interactions look like from the care team's side.

---

## What you're looking at (60 seconds)

Most mother-baby care happens between visits — the spotting question at 11pm, the BP that creeps up across the week, the silence from a mother who used to log every day. Today those signals either get lost in a portal inbox, get answered with generic web search, or escalate to a 2am ER trip that didn't need to happen.

Cocuna sits between visits and turns those moments into structured care:

1. **Mothers chat with Hera** in the mother app. Hera retrieves from approved clinical protocols (ACOG, AAP, ABM, your clinic's playbook) — never the open web — and asks structured follow-ups instead of giving generic answers.
2. **Every conversation becomes a triage decision** with a level (Red / Orange / Yellow / Green / Gray), a reason, recommended action, and the source. Low-acuity questions resolve in-app on protocol; anything urgent or unclear escalates.
3. **The clinic dashboard surfaces the escalations** as a ranked queue with full context — vitals trend, prior chats, baseline deviation, suggested next step. One click produces a chart-ready clinician summary.

The differentiator is **explainability**. Every triage decision shows its reason. Clinicians don't have to trust a black box; they can see what the model saw, why it decided, and what it cited.

---

## What to try in each demo

### Mother app · https://cocuna-mobile.vercel.app/

- Open the app. You land as **Maria** (34 weeks pregnant, gestational hypertension).
- Tap **Ask Hera** in the hero. Try "my head still hurts from yesterday" — watch Hera ask the right structured follow-ups and reach a triage decision with citations.
- Scroll down to the **demo switcher pill** ("Switch to Jane") and tap it. You're now **Jane**, 3 months postpartum, who hasn't logged in for a few days.
- See how Home shifts — the persona illustration changes to a smiling 3-month baby, the silence becomes a soft "It's been quiet" card, and Hera's mood register shifts from attentive to leaning-in.
- Open the **Care plan** and **Companion** screens to see the persona-specific guidance and the meditation library.

### Clinic dashboard · https://cocuna.vercel.app/

- You arrive in the **triage queue** — patients ranked by acuity, color-coded R/O/Y/G/Gray.
- Click the top patient. The profile shows the **timeline**, vitals trend, the explainable triage banner ("BP 158/102 + headache + vision spots → ACOG severe HTN protocol → urgent care"), and the AI-drafted clinician summary.
- Open the **copilot** to see Hera's chain of retrieval and reasoning for that case.
- The **analytics** view shows weekly hours saved, deflected low-acuity asks, and follow-ups recovered.

### Landing page · https://cocuna-care.lovable.app/

- The marketing front door. Read the value props for mothers and clinics, then click any **Book a demo** button — it opens the `/go` router on cocuna.vercel.app, which lets the visitor pick which side they want to see.

---

## Repo structure

```
cocuna/
├── README.md                # This file
├── SPEC.md                  # Product brief — features, triage levels, screens
├── DESIGN.md                # Brand system overview
│
├── mobile/                  # Mother app
│   ├── src/                 # React Native source (Expo, native iOS/Android)
│   │   ├── app/             # expo-router screens: Home, Chat, Care, Companion, etc.
│   │   ├── components/      # Hera mascot, persona illustrations, mood blobs
│   │   ├── lib/             # Claude client + mock, triage rules, demo state
│   │   └── ...
│   ├── web/                 # The live web demo — what cocuna-mobile.vercel.app serves
│   │   ├── index.html       # Entry — the single Aurora-direction prototype
│   │   ├── screens-*.jsx    # All screens: home, ask, care plan, companion, etc.
│   │   ├── data.jsx         # Personas (Maria, Jane), experts, BP, care plans
│   │   └── *.png            # Logo, womb baby, doctor portraits
│   ├── assets/images/       # Native asset bundle
│   ├── vercel.json          # Deploys mobile/web as a static site
│   └── DESIGN.md            # Mother-app brand (soft serif wellness)
│
├── clinic-web/              # Clinic dashboard — what cocuna.vercel.app serves
│   ├── index.html           # Entry — shell + queue + patient + copilot
│   ├── go.html              # The /go demo-router page reached from the landing
│   ├── shell.jsx            # Sidebar + topbar
│   ├── queue.jsx            # Triage queue
│   ├── patient.jsx          # Patient profile with explainable triage
│   ├── copilot.jsx          # Hera copilot panel
│   ├── analytics.jsx        # Weekly ROI view
│   └── data.jsx             # Patient fixtures, signals, summaries
│
├── supabase/                # Backend (Postgres + Edge Function)
│   ├── migrations/          # Schema: profiles, logs, chats, triage decisions
│   ├── functions/           # Edge Function that proxies the Anthropic API
│   └── config.toml
│
├── app/, components/, lib/  # Earlier Next.js dashboard, kept for reference —
│                            # the live dashboard is clinic-web/ above
├── design-export/           # Static HTML preview of the mother app
├── ops/                     # Deploy scripts
├── public/                  # Brand assets
└── vercel.json              # Root config — deploys clinic-web/ to cocuna.vercel.app
```

---

## Stack

| Layer | What | Where |
| --- | --- | --- |
| Mother app (native) | Expo SDK 56 · React Native 0.85 · expo-router · Reanimated 4 | `mobile/src/` |
| Mother app (web demo) | Static HTML + React via CDN | `mobile/web/` |
| Clinic dashboard (web demo) | Static HTML + React via CDN | `clinic-web/` |
| Landing | Built and hosted on Lovable | https://cocuna-care.lovable.app/ |
| Database & auth | Supabase Postgres · anonymous sign-in · row-level security on every user table | `supabase/migrations/` |
| AI proxy | Supabase Edge Function (Deno) → Anthropic Messages API | `supabase/functions/cocuna-rad/` |
| Hosting | Vercel (both demos) · Lovable (landing) · Supabase (data + AI proxy) | — |

The mother app never calls the model directly. It calls the `cocuna-rad` Edge Function, which holds the API credentials as Supabase secrets. This is intentional — keys never leave the server side.

---

## Triage levels

Every triage decision shows its level, reason, and source. Defined in [SPEC.md](./SPEC.md).

| Level | When | Default clinic notify |
| --- | --- | --- |
| **Red** — urgent | Severe HTN, neuro symptoms, infant fever <3mo, suicidal ideation, preterm labor, decreased fetal movement (3rd tri) | On |
| **Orange** — same-day | Worsening mood, high BP without severe symptoms, infection signs | On |
| **Yellow** — 24–72h review | Breastfeeding difficulty, mild mood symptoms, persistent sleep loss | Off |
| **Green** — self-care | Normal postpartum bleeding questions, normal infant spit-up | Off |
| **Gray** — insufficient data | Vague symptom, conflicting answers, low model confidence | On (always human-reviewed) |

---

## Run locally

The two demos in this repo are static — they need no install, no API keys, no backend to view as-is. Open the HTML files directly in a browser:

```bash
# Mother app demo
open mobile/web/index.html

# Clinic dashboard demo
open clinic-web/index.html
```

For the native mother app (Expo, iOS/Android):

```bash
cd mobile
npm install
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # browser preview at http://localhost:8090
```

The mother app falls back to mock AI responses when no backend is configured — so it runs end-to-end without any secrets or external services. Onboarding works, persona switching works, the scripted demo flows (Maria's preeclampsia escalation, Jane's silence flow) all work locally with zero setup.

---

## Brand

The mother app and clinic dashboard have different visual systems by design.

**Mother app — soft serif wellness.** Cream backdrop, muted pastels (rose, mint, lavender, peach, butter), Fraunces for emotional moments, DM Sans for everything else. Hera the calm AI companion. Memorable feeling on first open: *"It's calm in here."* Full spec in [`mobile/DESIGN.md`](./mobile/DESIGN.md).

**Clinic dashboard — calm professional.** Same cream + pastel palette but with denser data, sage-green accents, and a clinical layout. Same triage colors so the visual language for Red/Orange/Yellow/Green/Gray is consistent across both surfaces.

Both surfaces share the brand mark (gradient mother-and-baby silhouette) and the Fraunces wordmark.

---

## Clinical references

Triage rules and protocol guidance draw from:
- ACOG postpartum care guidance
- AAP infant fever and pediatric triage protocols
- 2025 AHA postpartum hypertension review
- 2025 KLAS Arch Collaborative on EHR message burden
- ABM lactation protocols
- EPDS perinatal depression screening

---

## License

All rights reserved · © 2026 Cocuna Health · Built for the hackathon.

# Cocuna

Real experts. Real answers. In minutes, not weeks.

A Next.js prototype for **Cocuna** — a B2B2C marketplace that connects first-time mums with credentialed perinatal experts (midwives, GPs, lactation consultants, perinatal psychologists, doulas) for on-demand, short-form Q&A.

> Cocuna is **not** an AI companion app. Every reply is authored by a vetted human expert. Claude acts as a bounded assistant for triage, summarisation, and suggested replies — always reviewed by the expert before anything reaches the mum.

## Stack

- Next.js 14 (App Router) · TypeScript
- Tailwind CSS · shadcn/ui (restyled to brand)
- Inter (UI) + Fraunces (hero/serif)
- Anthropic API integration point at `/api/claude` (added in a later phase)

## Brand at a glance

| Token | Value |
| --- | --- |
| Background | `#0B1220` deep navy |
| Foreground | `#F5F2EE` off-white |
| Signature gradient | `#A8A0FF → #8FD5DD` (purple → teal) |
| UI font | Inter |
| Serif font | Fraunces |
| Voice | Calm, credible, warm, premium. British spelling. |

The gradient is the signature — used sparingly for the logo mark, primary CTAs and a single hero bloom. Never as wallpaper.

## Run locally

```bash
npm install
npm run dev
```

The site runs at <http://localhost:3000>.

Useful scripts:

```bash
npm run build      # production build
npm run start      # serve production build
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
```

## Project structure

```
app/
  layout.tsx          # html shell, fonts, metadata
  globals.css         # Tailwind layers + brand tokens
  page.tsx            # / — public landing page
  app/                # (planned) mum-facing app
  portal/             # (planned) expert portal
  api/claude/         # (planned) Anthropic integration
components/
  brand/              # logo, gradient marks
  landing/            # landing page sections
  ui/                 # shadcn primitives, restyled
lib/
  utils.ts            # cn() helper
```

## Roadmap (this prototype)

- [x] Foundation: tokens, typography, shadcn baseline
- [x] **A.** Public landing page
- [ ] **B.** Mum app — Home (`/app`)
- [ ] **C.** Mum app — Compose (`/app/ask`)
- [ ] **D.** Mum app — Thread (`/app/threads/[id]`)
- [ ] **E.** Expert portal — Inbox (`/portal/inbox`)
- [ ] **F.** Expert portal — Thread (`/portal/inbox/[id]`)
- [ ] **G.** Doctor-ready summary (`/portal/summaries/[id]`)
- [ ] Dev toggle to switch mum ↔ expert view
- [ ] `/api/claude` route with task types: `triage`, `context-summary`, `suggested-reply`, `doctor-summary`

## AI principles in this prototype

Every AI-generated surface carries an **"AI-assisted, reviewed by your expert"** affordance. The human expert can always accept, edit, or dismiss suggested content. The doctor-ready summary is signed off by the expert before it leaves the platform.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project → Import** the repo.
3. Framework preset: **Next.js**. No env vars required for the prototype.
4. Deploy. The first build will warm the Inter and Fraunces font caches.

When the `/api/claude` route lands, add `ANTHROPIC_API_KEY` to the Vercel project's environment variables (Production + Preview).

## Licence

Proprietary — all rights reserved. Code is shared for prototype review only.

# Cocuna clinic dashboard — DESIGN.md

Starter design direction for the clinic continuity dashboard at the repo root. Inherits brand tokens from `tailwind.config.ts` + `app/globals.css` and the memory in `project_cocuna_brand.md`. Reacts to [SPEC.md](./SPEC.md) — specifically Feature 3 (Clinic Continuity Dashboard).

This document is a **starting position**, not a contract. Each pick is opinionated enough to react to; `/design-consultation` should refine, replace, or extend. Each pick includes the reason so the consultation can argue with intent.

---

## North star

**Calm under pressure. Premium, not Epic.**

The dashboard is what an OB sees at 11pm on a Tuesday after their fourth red flag of the shift. It should reduce decision fatigue, not add to it. Density is OK; clutter is not.

---

## Information architecture

### No left sidebar

Sidebars make dashboards feel like Epic, Cerner, Athenahealth. We are not those products. Cocuna is the calm layer between visits, and the chrome should reflect that.

- **Top header** (64px): logo (left) · search (center) · profile menu (right).
- **Filter pills row** below the header (triage colors + stage).
- **Triage queue** below the pills.

### Routes (3 destinations total)

- `/` — triage queue (home). Replaces the existing AU landing page per the approved plan.
- `/patient/[id]` — patient profile.
- `/analytics` — pilot metrics.

Profile menu: Sign out · Org settings · Help. Nothing else.

---

## Triage queue

### Rows, not cards

Cards waste horizontal space; clinicians scan downward. Rows read faster.

- Row height: 68-72px.
- Columns (left to right): Triage dot · Patient · Stage · Reason · Last update · Action.
- Severity is a **4% color wash on the row tint** + the colored dot in column 1. Never a solid red row.
- Default sort: severity desc, then time-since-update desc.
- Hover: subtle 6% navy lift, no shadow.

### The "calm even when escalating" rule

Red rows tint with `rgba(229, 97, 106, 0.04)` — barely visible but readable to a trained eye. The clinician's brain finds the red row through hierarchy, not through being shouted at by the interface.

### Filters

Five filter pills above the queue: Red · Orange · Yellow · Green · Gray. Plus one stage multi-select. All filters compose; no nested menus.

---

## Patient profile

### One scrolling page, not tabs

Tabs cost a click. Clinicians under time pressure shouldn't pay it.

Layout, top-to-bottom:

1. **Header card** — name · stage · delivery · risk factors · current triage level + reason.
2. **Current issue** — the active chat thread or open concern, expandable.
3. **Vitals** — BP timeline, sparkline + numerical readouts.
4. **Mood** — EPDS / PHQ-9 scores with trend.
5. **Baby** — feeding, sleep, diapers (when relevant to stage).
6. **Timeline** — pregnancy → delivery → postpartum milestones with escalation markers.
7. **Previous escalations** — collapsed by default.
8. **Unresolved concerns** — what the mother asked about that hasn't been closed.

Each section gets a section header in Inter Title, content below. Sections separated by 56px vertical space — generous.

### Sticky summary CTA

`Generate clinician summary` button stays sticky bottom-right of the viewport. It is the primary action of this page. Gradient-filled (one of the three sanctioned gradient placements on this surface).

---

## Summary modal

### Set in Fraunces

The clinician summary is a **clinical document**. Serif gives it the gravity of "I would put this in the chart."

- Modal overlay, 720px wide, centered.
- Title: "Clinical summary — [Patient name]" in Inter Title.
- Body: Fraunces 17px / 28px line-height. Justified left.
- Variant tabs at top: OB · Pediatric · Lactation · Mental health · Full history.
- Actions at bottom: Copy to clipboard · Send to chart (mocked) · Close.

The Fraunces choice signals: this is not chat output. This is a document that respects the reader.

---

## Color usage — the rare-gradient rule

The brand gradient (`#A8A0FF → #8FD5DD`) appears in **exactly three places** on the dashboard:

1. The `Generate clinician summary` CTA.
2. The Cocuna wordmark in the header (subtle, via the existing `.text-gradient` utility in `app/globals.css`).
3. The triage queue's Red-row leading edge — a 2px vertical hairline gradient stroke at the row's left edge, on Red rows only.

Everywhere else: navy `#0B1220`, cream `#F5F2EE`, neutral grays. Triage colors used sparingly as dots + 4% washes only.

---

## Typography

### Inter for everything except the summary
- Display: 32px (rare — empty queue state only).
- Section title: 20px / 28px / -0.01em.
- Row body: 15px / 22px / 0em.
- Caption: 13px / 18px.
- Numeric / vitals: 14px mono-tabular.

### Fraunces
Only the clinical summary modal. Nowhere else on this surface.

---

## Analytics

A single page with 4 cards in a 2x2 grid on desktop. Each card is one of the SPEC.md mock metrics.

- Header above the grid: **"Pilot targets — not validated outcomes."** Small, cream at 60% opacity, but unmissable.
- Cards: subtle navy elevation, large number in Inter Title, label below, sparkline trending up (mocked).

Honesty about the mocking is part of the trust contract — clinicians who notice the disclaimer will trust the rest more.

---

## Microcopy register

Different register from the mother app. **Clinically credible, never clinical-cold.** Plain professional language.

Examples:
- Empty queue: "Nothing urgent right now. Last update 3 minutes ago."
- New patient toast: "Maria S. added to the queue — Red, postpartum hypertension."
- Summary generation: "Drafting summary based on the last 48 hours of activity."

Never use the mother app's voice. The clinician is not the mother.

---

## Spacing

Generous for healthcare. Container max-width 1280px. Page padding 32px. Section vertical rhythm 24 / 32 / 56. Row height 68-72.

---

## Open for /design-consultation

1. **Triage row vs. card** — rows are the starting position. Test a card variant if density is hurting scanning.
2. **Single-scroll vs. tabbed patient profile** — single-scroll is the starting position. Validate with 2 clinicians if accessible.
3. **The Cocuna mark in the dashboard header** — same gradient wordmark as the mother app, or a dialed-down monochrome version? Consultation to decide.
4. **Empty / quiet states** — how does the dashboard feel when nothing is urgent? Pleasant, not anxious.
5. **Mobile layout for the dashboard** — should the clinician dashboard be usable on a phone (on-call doctor checks in), or is desktop-only acceptable for MVP?
6. **Analytics page need** — is `/analytics` worth keeping in MVP, or fold the mock metrics into the queue header?
7. **Severity row wash** — 4% is a starting position. May need to bump per actual contrast testing on the navy background.

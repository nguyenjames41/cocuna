# Cocuna mobile — DESIGN.md

Locked via `/design-consultation` on 2026-05-23. Replaces the prior navy-first system.

This document is **authoritative** for visual decisions on the mother app. When SPEC.md, CLAUDE.md, or any older artifact conflicts with this file on brand/visual rules, this file wins. Clinical and safety rules (triage levels, reward framing, explainability) in SPEC.md still apply.

---

## North star

**Soft serif wellness — calm leads, mascot stays quiet.**

The memorable thing a mother should feel on first open: **"It's calm in here."** Every design decision serves that feeling. Quiet over busy. Muted over saturated. Presence over performance.

Cocuna is the room she returns to. The design should feel like morning light through a window.

---

## Information architecture

### No bottom tab bar — Home is the whole product

Tabs imply "separate things." Cocuna is one continuous relationship. Home is always the entry point; the rest opens from it.

- **Home** — always-true surface. Companion, greeting, status, primary CTA, gentle prompts, quick logs.
- **Chat (Ask Cocuna)** — modal sheet sliding from below.
- **Care plan** — modal sheet from below.
- **Companion / progress** — sibling surface (route, swipe-right-able later).
- **Onboarding** — first-launch only; never seen again.

### Screen inventory (5–6, fits SPEC.md surface budget)

1. Onboarding — name + stage.
2. Home.
3. Chat — RAD triage, doctor-picker, calm helper as modes inside the chat.
4. Care plan.
5. Companion / progress.
6. Appointment — sheet, only during a scheduled call. Not in MVP demo.

The Result card lives inside Chat, not a separate screen.

---

## Color

### Palette

Background and surface do 90% of the work. Pastels are placed sparingly on the cards that need to lead. Triage colors are reserved for clinical signaling only — never used for branding or decoration.

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#F7F4EE` | App background (warm off-white) |
| `surface` | `#FFFFFF` | Default card surface |
| `surface-sunken` | `#EFEBE4` | Recessed surface (option groups, secondary fields) |
| `rose` | `#F3D7DC` | Pastel accent — gentle / supportive moments |
| `rose-deep` | `#E7B8C2` | Rose accent (hover, dot, mascot lean-in) |
| `mint` | `#C8E2D2` | Pastel accent — steady / done / okay moments |
| `mint-deep` | `#9DCBB0` | Mint accent (dot, mascot milestone) |
| `lavender` | `#D8D0EE` | Pastel accent — reflective / mood / gentle prompts |
| `lavender-deep` | `#B5A8DC` | Lavender accent (dot, mascot calm) |
| `peach` | `#F8D9C5` | Pastel accent — primary CTAs (Ask Cocuna) |
| `peach-deep` | `#EDB99B` | Peach accent (mascot attentive) |
| `butter` | `#F0E3B1` | Pastel accent — small celebratory moments |
| `text` | `#2A2723` | Primary text (warm charcoal, not pure black) |
| `text-muted` | `#6E6862` | Secondary text |
| `text-faint` | `#A29D95` | Tertiary text (timestamps, meta) |
| `hairline` | `rgba(42, 39, 35, 0.10)` | Card borders |
| `hairline-soft` | `rgba(42, 39, 35, 0.06)` | Subtle dividers |

### Triage palette (clinical signaling only)

| Level | Hex | Pattern |
| --- | --- | --- |
| `red` | `#E5616A` | Urgent — contact your clinic now |
| `orange` | `#F0A152` | Same-day review |
| `yellow` | `#C9B05D` | 24–72 hour review |
| `green` | `#7EC298` | Steady — self-care |
| `gray` | `#9CA6B5` | Insufficient data — human review |

**Triage rule:** an 8pt colored **dot** plus an outline pill. The reason text lives below the badge in body weight, **not inside it**. Solid colored fills read as "alarm" in healthcare apps; we want gravity, not fear. The Companion (Coco) leans in for Red triage — mood, not a flashing pill.

### Card pairing rule

When a screen stacks multiple cards, **alternate** between strong pastel and white-or-sunken. Never two strong pastels back-to-back unless they're a deliberate pair. Peach (Ask Cocuna) is the dominant brand pastel — it appears once per screen, top-of-fold.

---

## Typography

### Family pairing

- **Fraunces** (serif, optical sizing) — emotional moments only: greetings, stage line, primary CTA headlines, Companion-screen title. Used sparingly so it keeps its weight.
- **DM Sans** (sans) — everything else: body copy, captions, labels, numbers (tabular-nums for vitals + dates).

We **do not** use Inter on the mother app. DM Sans pairs warmer with Fraunces and avoids the "I gave up on typography" default.

### Scale (mobile dp/pt)

| Role | Family | Size / line-height | Tracking |
| --- | --- | --- | --- |
| Display (Home greeting name) | Fraunces 600, opsz 96 | 30 / 32 | -0.025em |
| Title (stage line, screen titles) | Fraunces 500, opsz 80 | 22 / 26 | -0.012em |
| CTA headline | Fraunces 600, opsz 80 | 22 / 26 | -0.012em |
| Body | DM Sans 400 | 16 / 24 | 0 |
| Body medium (chip, label) | DM Sans 500 | 14 / 21 | 0 |
| Small | DM Sans 400 | 13 / 18 | 0 |
| Caption / eyebrow | DM Sans 500 | 11 / 14 | 0.16em uppercase |
| Numeric (BP, dates) | DM Sans 500, tabular-nums | 14 / 18 | 0 |

---

## The Companion — "Coco"

A soft rounded creature. Pastel-gradient body, two-dot eyes, no nose, no mouth. The single sanctioned character in Cocuna's visual system — a deliberate shift from the prior "no faces" rule, motivated by the brand pivot to a warmer wellness aesthetic.

### Form
- Shape: blob/squircle hybrid — `border-radius: 38% 42% 40% 44% / 44% 40% 42% 38%` (asymmetric for organic feel).
- Size: ~86 on Home (small, below the greeting), ~220 on the Companion screen.
- Fill: linear gradient between two pastel tokens, mood-dependent (see states below).
- Eyes: two `6px` dots in `text` color. **No nose, no mouth.** Personality lives in motion and color, not features.
- Subtle drop shadow in the matching mood color (e.g., lavender-tinted shadow at rest).

### Mood states
| State | Gradient | When |
| --- | --- | --- |
| Calm (default) | lavender → mint | Default Home state, idle |
| Attentive | peach → rose | User opened chat, mid-conversation |
| Milestone | butter → mint | BP streak hit, week change, triage resolved |
| Lean-in | rose-deep → peach-deep | Red triage entered (warm shift, not red alarm) |

### Motion
- **Breath:** 4-second sine cycle, scale 1.00 ↔ 1.03. Always on.
- **Open pulse:** brighten 600ms on app open (shadow opacity 0 → 0.55 → 0.4).
- **Milestone:** slow 1.5s ripple from center (opacity 12% → 0%).
- **Lean-in:** 800ms warm tint shift on Red triage entry. The Companion is concerned, not alarmed.

### What Coco is NOT
- Not a face — no mouth, no nose, no expressions beyond the two-dot gaze and the color shift.
- Not a creature with a backstory — Coco is a designed object, not a persona. Honesty is part of trust.
- Not a voice — Cocuna has copy, not narrated speech.
- Not a status indicator for clinical state — that's what the triage badges do.

---

## Surfaces

### Card system

- **Default card** — white surface, hairline border, 22–24px radius, 16–20px padding.
- **Pastel card** — strong pastel fill (peach, lavender, rose, mint, butter), no border, 22px radius, 18–22px padding. Used for the lead CTA and one outstanding action per screen, no more.
- **Sunken card** — `surface-sunken` fill, no border, 14–18px radius. Used for nested option groups inside a Followup card.
- **Outline card** — transparent fill, hairline border. Used for grouped lists (warning signs).

### Pills and chips

- 8pt vertical, 14pt horizontal padding minimum.
- 999px radius.
- White surface + hairline border for default state.
- Mint dot at 6×6 when "done."
- No filled-pill states — done = dot present, not present = empty circle outline.

---

## Chat surface

### The asymmetric bubble rule

- **Mother's messages** — right-aligned bubbles. Background `surface` (white), text `text`, 18px radius with the bottom-right corner clipped to 6px. Max-width ~80% of column.
- **Cocuna's replies** — left-aligned plain text. **No bubble.** Leading glyph: a small (12px) pastel gradient square (lavender → mint) sitting at line-height.

Rationale: a bubble would make Cocuna feel like a separate persona — a chatbot. We want the app to feel like the room she's in, not a character. The asymmetry tells her who's speaking without overloading the design.

### Structured follow-ups

The RAD chat asks clinical follow-ups. Each follow-up renders as a tap-to-answer **Followup card**: small caps `QUICK FOLLOW-UP` eyebrow, question in body-medium, 2–4 option pills (sunken card fill, hairline border, tap to send).

---

## Result card

Appears below the latest message once triage resolves; sticky at the top of the conversation once shown.

- Triage dot + level eyebrow (small caps).
- Headline in Fraunces 600 ("Contact your clinic now", "Same-day review", etc.).
- Reason in body, one paragraph max.
- "What to do" — section label + body.
- Primary action button (e.g., "Open care plan") — peach pastel pill.
- "Why this triage" — expandable section showing the contribution breakdown (input + reason per row).
- "When to escalate" — section label + body.
- "Notify your clinic" toggle. Default per level: Red on, Orange on, Yellow off, Green off, Gray on.
- Source / protocol label in `text-faint` at the foot of the card.

For Red triage only: a gradient hairline edge on the top of the card (lavender → mint, not red — the calm-but-attentive signal).

---

## Microcopy register

"The friend who shows up" — per SPEC.md voice rules. Still applies, just now in a warmer setting.

### Hard rules (still load-bearing from SPEC.md)
- Reward engagement habits, not health outcomes. ✅ "BP saved. That's the seventh day in a row." ❌ "You avoided preeclampsia by checking your BP."
- Never imply the app prevented something bad.
- No "AI as the doctor" framing.

### Worked examples
- Greeting (morning): "Good morning, Maria." (Fraunces) → "You're 8 days postpartum." (Fraunces) → "Your body's still doing big work. Rest when you can." (DM Sans muted)
- Post-log: "BP saved. That's the seventh day in a row — you're staying on top of this. Rest when you can."
- Idle prompt: "It's been quiet today. If anything's on your mind, I'm here."
- Gentle action: "Log today's mood — under 15 seconds. No right answer."

---

## Spacing

8pt grid. Generous, not dense.

| Scale | Value | Use |
| --- | --- | --- |
| `1` | 4 | Tight internal gaps |
| `2` | 8 | Inline chips, small gaps |
| `3` | 16 | Card internal padding (small) |
| `4` | 24 | Card internal padding (default), section gap (small) |
| `5` | 32 | Section gap (default) |
| `6` | 48 | Screen-level rhythm |

Touch targets ≥44 minimum. Card radius scale: 14 / 18 / 22 / 28 (no bubble-radius-everything).

---

## Motion

**Intentional, never expressive.**

- **Mascot breath** — always on, 4s sine.
- **Card press** — opacity 1 → 0.92 over 100ms.
- **Sheet open** — slide from below, 320ms ease-out.
- **Page transition (Companion sibling)** — slide from right, 280ms.
- **Milestone ripple** — slow 1.5s, opacity 12 → 0.
- **Triage lean-in** — 800ms warm tint shift on the mascot.

No bouncy easing. No spring physics. Calm.

---

## Stale rules from the prior DESIGN.md (do not apply)

These rules are explicitly **superseded** by this version. Listed so they aren't reintroduced by memory or older docs:

- ~~"Background `#0B1220` deep navy / foreground cream"~~ — now light cream `#F7F4EE`.
- ~~"95% navy + cream, gradient in exactly three places"~~ — now muted pastels carry the system.
- ~~"No face, no expression, no creature reading" on the Companion~~ — Coco has two-dot eyes and mood states.
- ~~"Abstract geometric squircle only"~~ — Coco is a soft asymmetric blob.
- ~~"Inter for body"~~ — DM Sans replaces Inter.

The SPEC.md "Product Loop Framework" content (core function, core loop, accessory features, surface area check, retention hook, reward framing rules) **still applies** — those are product/clinical rules, not visual ones.

---

## Open for follow-up consultation

Defer these until we've used the system across more surfaces:

1. **Dark mode** — TBD. Cocuna is light-first; a true dark mode would need its own consult.
2. **Per-stage Home variation** — TTC, pregnant, postpartum, toddler all share the same Home shell today. We may want per-stage hero treatments.
3. **Coco for stressful states** — the warm lean-in tint is a starting position. Worth A/B testing whether it reassures or destabilizes during Red triage.
4. **Sound design** — the prior Companion had a single pluck sound on log/milestone. Re-decide for Coco.
5. **Onboarding mascot moment** — does Coco appear in onboarding, or only after the first Home arrival? Currently shows during onboarding.

Preview file (for reference / future updates): `~/.gstack/projects/Cocuna/designs/design-system-20260523-1654/cocuna-design-preview.html`

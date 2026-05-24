# Cocuna — Product Spec

Source: business plan PDF provided 2026-05-23. This document is the authoritative product brief for the MVP. Where any other artefact (memories, CLAUDE.md, the older 25-answer Q&A) conflicts with this file, this file wins.

---

## Problem

Cocuna is a dual-layer solution for mothers and OB clinics.

New mothers are expected to monitor both their own recovery and their baby's health at home, but the system gives them only isolated appointments — even though maternal mental-health conditions affect about 1 in 5 mothers, first-time mothers' support calls are mostly about routine baby care and crying, and infants have the highest pediatric emergency-department use of any child age group.

Cocuna is the **mother-baby care timing platform**: it tracks maternal recovery, mental health, and baby concerns, then routes the family to reassurance, coaching, video care, or in-person care at the right time.

On the OB side, US OB and pediatric clinics are being asked to deliver continuous maternity and newborn support through short scheduled visits and unstructured messages, while workforce shortages, postpartum drop-off, and rising parent demand consume scarce clinical time. Our platform gives clinics a mother-baby continuity layer that structures between-visit data, estimates care-attention risk, automates low-risk guidance, and escalates only the right cases to the right clinician.

> Mothers shouldn't feel that they need to take care of themselves. They should feel that they are being taken care of.

## Principle

Trust and transparency are the number-one priority. Pregnancy is an intimate and private experience that should be respected and supported.

## Positioning

**For clinics:** Cocuna saves time by converting unstructured maternal and baby messages into structured triage, risk reasons, and visit-ready summaries. Clinics do not need another communication channel — they need fewer chaotic messages, clearer escalation, and faster chart review.

**For mothers:** Cocuna helps mothers feel watched over between visits, without pretending to replace the doctor. The app gives supportive answers, asks the right follow-up questions, detects red flags, and escalates to the clinic or urgent care when needed.

**Competitive position:** Competitors either replace the care layer, sell broad virtual benefits, or focus on RPM. Cocuna gives existing OB and pediatric clinics a longitudinal mother-baby operating layer that reduces workload and keeps the patient inside the clinic's care system.

---

## MVP surfaces

1. **App (mother side)** — the mobile app under `mobile/`.
2. **Dashboard (clinic)** — the clinic web product.

---

## MVP scope: build only 3 core features

### Feature 1 — Mother-Baby RAD Triage Chat

The mother-facing app.

**Do not present it as** "AI trained on motherhood books." That sounds medically risky and easy to copy.

**Present it as:** a **source-bound RAD triage companion** trained on approved maternal, postpartum, pediatric, and clinic-specific protocols.

RAD = **Retrieval-Augmented Decisioning**: the chatbot retrieves trusted guidance, asks structured clinical questions, and routes the case into a triage layer.

#### Worked example — postpartum hypertension

Mother: "I'm 8 days postpartum. I have a bad headache and I'm seeing spots. My blood pressure is 158/102."

Chatbot follow-ups:
1. How many days postpartum are you?
2. What was your latest blood pressure?
3. Do you have vision changes?
4. Do you have chest pain, shortness of breath, right upper abdominal pain, or swelling?
5. Are you alone right now?
6. Do you want us to notify your clinic?

Output:
- **Red — urgent escalation**
- Reason: postpartum day 8 + high blood pressure + headache + visual symptoms
- Action: contact clinic / labor & delivery immediately; emergency instructions shown
- Clinic notified: yes

Clinically credible: postpartum hypertension / preeclampsia can occur after birth; 2025 AHA review summarises ACOG guidance that BP should be checked within 72 hours and again within 10 days after delivery for patients with hypertensive disorders.

#### Worked example — baby fever

Mother: "My 3-week-old baby has a temperature of 100.5°F."

**Red pediatric escalation** — fever ≥100.4°F in babies under 3 months requires prompt medical evaluation.

#### Worked example — mental health

Mother: "I cry every day, I feel detached from my baby, and I can't sleep even when the baby sleeps."

App asks PHQ-9 / EPDS-style questions and always asks about self-harm or harm-to-baby thoughts.
- No immediate danger → **Orange**: same-day or next-day behavioural health review.
- Suicidal ideation or psychosis-like symptoms → **Red**: immediate escalation.

Perinatal mental health is **central, not a side feature**. ACOG: perinatal mental health conditions include depression, anxiety, bipolar, suicidality, postpartum psychosis, and affect more than 1 in 5 people.

### Feature 2 — Care Attention Score

The hard-to-copy layer.

**Do not say** "the AI predicts danger." **Say:** Cocuna estimates care attention from noisy daily signals using an explainable inverse-method layer.

**Inputs**: mother symptoms · baby symptoms · blood pressure · mood screen · sleep / recovery · feeding logs · wearable trends · appointment status · message history · known risk factors

**Outputs**:
- **Green** — self-care guidance
- **Yellow** — non-urgent clinic review
- **Orange** — same-day nurse / video review
- **Red** — urgent escalation
- **Gray** — insufficient information, human review needed

**The score must always show why.** Example: "Red because: postpartum day 8, BP 158/102, headache, visual symptoms."

Demo-grade visible formula:
```
Care Attention Score = maternal red flags + baby red flags + mental-health risk
                     + vital deviation + missed follow-up + uncertainty
```

Explainability is the differentiator. Clinics will not trust a black box. They might trust a system that says exactly what changed and why the patient moved up the queue.

### Feature 3 — Clinic Continuity Dashboard

The B2B product. Opens with a **triage queue**, not patient profiles.

#### Main dashboard (sorted by urgency)

| Patient | Stage | Triage | Reason | Needed action |
|---|---|---|---|---|
| Maria S. | 8 days postpartum | Red | BP 158/102 + headache + vision changes | Call now / send to L&D |
| Ana R. | 32 weeks pregnant | Orange | PHQ-9 high + insomnia + anxiety | Same-day behavioural review |
| Emily T. | 4 weeks postpartum | Yellow | breastfeeding pain + low supply concern | lactation video consult |
| Jordan B. | baby 6 weeks | Green | normal spit-up, feeding well | education sent |

The physician / nurse does not start from a messy inbox — they start from a prioritised worklist. (Backing context: 2025 KLAS Arch Collaborative — message burden harms physician perception that the EHR enables care. AMA 2024 toolkit specifically addresses EHR inbox burden.)

#### Patient profile (when clinician clicks Maria)

```
Patient: Maria S.
Stage: postpartum day 8
Delivery: vaginal, 39w2d
Risk factors: gestational hypertension
Current issue: headache, visual symptoms, high BP
Latest vitals: 158/102, repeated 154/100
Mood: EPDS 8, no self-harm
Baby: feeding normally, 7 wet diapers/day
System recommendation: urgent escalation
Rationale: postpartum HTN risk + neurologic symptoms
Suggested action: call now / direct to L&D / document escalation
```

#### One-click clinician summary (the killer clinic feature)

Button: **Generate clinician summary**

Output:
> Maria S., postpartum day 8 after vaginal delivery, history of gestational hypertension. Reports severe headache and visual spots today. Home BP readings 158/102 and 154/100. No chest pain reported. Baby feeding normally. Mood screen not elevated. Cocuna triage: Red urgent escalation due to postpartum hypertension red flags. Recommended same-day clinician contact / L&D evaluation.

Physician feel: "I can understand this patient in 30 seconds."

---

## MVP screens

### Mother app

1. **Home**
   - "You are 8 days postpartum"
   - Mother status: Green / Yellow / Orange / Red
   - Baby status: Green / Yellow / Orange / Red
   - Next check-in
   - Ask Cocuna · Log BP · Log mood · Log baby feeding/diapers · Contact clinic

2. **Chat** — warm but clinically structured.
   - Bad: "How can I help?"
   - Better: "Hello Mom! Tell me what is happening. I'm here to take care of you."

3. **Result card** — every answer ends with: triage level · reason · action · when to escalate · clinic notification option · source/protocol label.

4. **Care plan** — today's action · warning signs · scheduled follow-up · educational content · video visit option.

### Clinic dashboard

1. **Triage queue** (main screen). Filters: Red / Orange / Yellow / Green / Gray.
2. **Patient timeline** — pregnancy / postpartum stage · delivery data · maternal symptoms · baby symptoms · BP · mood · feeding · sleep · previous escalations · unresolved concerns.
3. **Summary generator** — OB summary · pediatric summary · lactation summary · mental-health summary · full mother-baby history.
4. **Clinic analytics (mocked for demo, labelled as pilot targets)**:
   - 42% of incoming questions safely handled as Green
   - 31% routed to nurse / lactation instead of physician
   - 18 urgent cases surfaced
   - Average chart-prep time reduced from 8 minutes to 90 seconds

---

## Build real vs. mock

**Build real for the MVP:**
- Mother app (React Native / Expo — see note below) clickable
- Clinic dashboard (React) clickable
- Mock patient database
- Chat interface
- Rule-based triage engine
- Retrieval layer with approved content
- Summary generator
- Triage queue sorting
- Patient timeline

**Mock for the MVP:**
- EHR integration
- Apple Watch / WHOOP data
- Real clinic messaging
- Real video visit
- Real insurance / reimbursement
- Real diagnosis

> For the live demo, you do not need real integrations. You need a believable workflow.

---

## Triage design — 5 levels

### Red — urgent
- Severe headache + vision changes + high BP postpartum
- Chest pain · shortness of breath · seizure · heavy bleeding
- Suicidal thoughts · thoughts of harming baby
- Baby under 3 months with fever ≥100.4°F

### Orange — same-day review
- Worsening depression / anxiety without immediate self-harm
- High BP without severe symptoms · suspected infection
- Breastfeeding pain with fever or worsening redness
- Baby poor feeding but stable

### Yellow — 24-72 hour clinical review
- Breastfeeding difficulty · mild mood symptoms · persistent sleep deprivation
- Incision discomfort without red flags
- Baby rash without fever and feeding normally

### Green — self-care
- Normal postpartum bleeding questions
- Normal spit-up with good feeding and diapers
- Common sleep questions · routine recovery guidance

### Gray — insufficient data
- Vague symptom · conflicting answers · missing age/vitals
- User seems confused · model confidence too low
- **Always goes to human review.** Important for safety.

---

## Product Loop Framework

A separate-but-complementary layer to the clinical spec above. The clinical spec defines *what the app does*. This section defines *how it feels and why people come back*.

Framework: **Raw idea → Core Function → Core Loop → Accessory Features → Surface Area Check → Retention Hook → Shippable MVP.**

### Core Function (one sentence)

> Cocuna connects mothers to clinical experts at the right moment, and reassures them in every moment in between.

If we can't say it in one sentence, we stop and rewrite it.

### Core Loop (action → reward, under 30 seconds)

A mother opens the app with a worry, a log, or just a check-in. Within 30 seconds she gets:

1. **Acknowledgement** — the app sees what she's doing ("You're 8 days postpartum. You logged your BP — well done.")
2. **A clear next action** — triage decision, log saved, appointment ready, or "you're safe; rest."
3. **A small reward** — a soft motion, a sound, the companion presence, a quiet line of recognition.

The reward is **engagement-based, never outcome-based** (see Reward framing rules below). The goal: the mother feels seen, not graded. She comes back tomorrow because the app held her hand today.

### Accessory Features (only what supports the loop)

These are **modes inside existing screens**, not new screens. Each accessory exists to make the core loop feel inevitable.

- **RAD triage** — the source-bound chat decisioner from Feature 1. Lives inside Chat.
- **Note-taker** — silently runs during a doctor video call, captures key points, drafts a follow-up summary for the mother. Lives inside the Appointment screen.
- **Doctor-picker** — when the mother asks "who should I see?", explains which expert type fits her current concern (OB / pediatric / lactation / mental health) and why. Lives inside Chat.
- **Calm helper** — short guided breath / grounding moments triggered by elevated mood-screen scores or self-reported stress. Lives inside Chat (offered) or Home (as a tile).

We do **not** add a feature unless it strengthens action → reward in the core loop. Anything that fails this test gets cut.

### Surface Area Check (max ~5-9 screens per surface)

**Mother app (current count: 5-6, fits budget):**
1. Onboarding (name + stage)
2. Home
3. Chat (RAD triage, doctor-picker, calm helper all live here as modes)
4. Care plan
5. Appointment (with the note-taker minion active during a call)
6. Companion / progress (the recognition surface — "you've logged your BP 7 days in a row")

The Result card is part of Chat, not a separate screen.

**Clinic dashboard (current count: 4, room to grow):**
1. Triage queue (`/`)
2. Patient profile
3. Summary generator
4. Analytics

Rule: any new screen must be justified by the core loop. Headroom is reserved for things we don't know we need yet, not for accidental sprawl.

### Retention Hook (unfinished state that brings the mother back)

Two layers:

- **The Companion** — a single **abstract geometric presence** (no face, no creature, no fruit/bump/pram). Soft motion, gradient pulse, present on Home and Companion screens. It breathes when she's calm, brightens on milestones, softens when she's struggling. Carries a small library of sounds tied to events (log saved, triage resolved, week-milestone reached). The companion is the mascot — restrained, premium, never cutesy.
- **The unfinished state** — Home always shows one outstanding gentle action: "Log today's mood", "It's been 3 days since your last BP check", "Your week 9 check-in is ready." Never alarming, never nagging. The action is always under 15 seconds.

Push notifications use the same restraint. No streak shaming, no "we miss you" copy, no FOMO.

### Voice — "the friend who shows up"

The supportive presence the mother experiences in copy. Stage-aware (different language for pregnant, postpartum, toddler), present without being performative, never assumes a partner or family structure.

Examples:

- Bad: "Hey mama! 🤍 You got this!" (performative, cutesy, emoji-led)
- Bad: "Patient logged BP. Reading within normal range." (clinical-cold, third person)
- Good: "BP saved. That's the seventh day in a row — you're staying on top of this. Rest when you can."
- Good: "It's been quiet today. If anything's on your mind, I'm here."

This voice is the **public** writer's direction. (Internal design metaphor for the team's reference: "the supportive partner who shows up" — the public copy never uses the word *partner* or *husband*.)

### Reward framing rules (hard guardrails)

The "you've done well" loop is powerful and easy to misuse in healthcare. Two rules:

1. **Reward engagement habits, not health outcomes.** Allowed: "You've logged your BP 7 days in a row." Forbidden: "You avoided preeclampsia by checking your BP." We cannot causally attribute outcomes to in-app behavior; doing so is misleading and potentially harmful.
2. **Never imply the app prevented something bad.** Allowed: "Your symptoms have been steady this week." Forbidden: "You're safer because of Cocuna." The mother stayed safe. The app supported her.

Both rules apply to copy, push notifications, the companion screen, and any future analytics export.

### What the loop is NOT

- Not gamification. No points, no streaks shown as numbers, no leaderboards, no badges.
- Not a wellness journal. Reflection prompts are optional, lightweight, and clinically purposeful.
- Not a coach. Cocuna does not push the mother to do more — it acknowledges what she's already doing.
- Not a friend that fakes presence. The companion is a designed object, not a persona pretending to care. Honesty is part of trust.

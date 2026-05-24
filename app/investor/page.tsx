import Image from "next/image";
import Link from "next/link";

import { ClinicHeader } from "@/components/clinic/Header";
import { TriageDot } from "@/components/clinic/TriageDot";
import { PATIENTS, TRIAGE_LABEL } from "@/lib/clinic/patients";

const MOTHER_APP_URL = process.env.NEXT_PUBLIC_MOTHER_APP_URL ?? "http://localhost:8090";

const PROBLEM = [
  {
    stat: "1 in 5",
    label: "Mothers affected by perinatal mental health conditions (ACOG)",
  },
  {
    stat: "Highest",
    label: "Pediatric ED use of any child age group — infants under 1",
  },
  {
    stat: "8 → 90s",
    label: "Chart-prep time minutes → seconds with auto-summaries",
  },
];

const HOW = [
  {
    title: "1 · Mother opens Cocuna",
    body: "She types what's happening, or taps a quick log (BP, mood, kicks, glucose). Coco — the soft mascot — meets her at the door.",
  },
  {
    title: "2 · Cocuna asks the right follow-up",
    body: "Structured clinical questions, not free-form chat. ACOG postpartum + AAP infant fever protocols inform the prompts.",
  },
  {
    title: "3 · Triage decides + escalates",
    body: "Red / Orange / Yellow / Green / Gray. Every decision shows its reason. The clinic gets a queue, not an inbox.",
  },
  {
    title: "4 · Clinician summary in 30 seconds",
    body: "One click generates a chart-ready paragraph from stage + vitals + mood + baby + reason. Paste into the visit note.",
  },
];

export default function InvestorPage() {
  const sorted = [...PATIENTS].sort((a, b) =>
    a.triage === "red" ? -1 : b.triage === "red" ? 1 : 0,
  );
  const red = sorted[0];

  return (
    <div className="min-h-dvh">
      <ClinicHeader subtitle="Investor walkthrough" />

      <main className="container py-12">
        {/* HERO */}
        <section className="mb-16 max-w-3xl">
          <Image
            src="/cocuna-logo.png"
            alt="Cocuna"
            width={160}
            height={160}
            className="mb-6 h-32 w-32 md:h-40 md:w-40"
            priority
          />
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Cocuna · for OB and pediatric clinics
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-tight tracking-tightest text-foreground md:text-6xl">
            Mothers shouldn&rsquo;t feel that they need to take care of themselves.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Cocuna is the mother-baby continuity layer between clinic visits. The mother
            chats with a source-bound triage companion. The clinic gets a prioritized
            worklist with one-click chart-ready summaries. Every triage decision shows its
            reason.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-md bg-sage-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sage-700"
            >
              Open the clinic queue →
            </Link>
            <a
              href={MOTHER_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Open the mother app →
            </a>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="mb-16">
          <p className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            The problem
          </p>
          <h2 className="mb-8 font-serif text-3xl tracking-tightest text-foreground">
            Clinics are asked to deliver continuous care through short visits and chaotic messages.
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PROBLEM.map((p, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6">
                <p className="font-serif text-4xl tracking-tightest text-sage-600">{p.stat}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW */}
        <section className="mb-16">
          <p className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            How it works
          </p>
          <h2 className="mb-8 font-serif text-3xl tracking-tightest text-foreground">
            From a worry at 2am to a chart note in the morning.
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {HOW.map((h, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-serif text-xl tracking-tightest text-foreground">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE EXAMPLE */}
        <section className="mb-16">
          <p className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            Live example · top of today&rsquo;s queue
          </p>
          <h2 className="mb-6 font-serif text-3xl tracking-tightest text-foreground">
            Why this patient moved to the top — explained.
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <TriageDot level={red.triage} />
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {TRIAGE_LABEL[red.triage]}
                </span>
              </div>
              <h3 className="font-serif text-2xl tracking-tightest text-foreground">{red.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{red.stageDetail}</p>
              <p className="mt-4 text-sm text-foreground">{red.triageReason}</p>
              <Link
                href={`/patient/${red.id}`}
                className="mt-5 inline-block text-sm font-medium text-sage-600 hover:text-sage-700"
              >
                Open full profile →
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <p className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                Care Attention Score · explainable
              </p>
              <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 text-xs leading-relaxed text-foreground">
{`Care Attention Score
= maternal red flags
+ baby red flags
+ mental-health risk
+ vital deviation
+ missed follow-up
+ uncertainty`}
              </pre>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Inverse-method scoring. Every contribution is visible to the clinician.
                Clinics will not trust a black box; they trust a system that says exactly
                what changed.
              </p>
            </div>
          </div>
        </section>

        {/* DIFFERENTIATOR */}
        <section className="mb-16">
          <div className="rounded-lg border border-border bg-sage-50 p-8 md:p-12">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              The differentiator
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tightest text-foreground md:text-4xl">
              Every triage shows its reason.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Competitors either replace the care layer, sell broad virtual benefits, or
              focus on remote patient monitoring. Cocuna gives existing OB and pediatric
              clinics a longitudinal mother-baby operating layer that reduces workload and
              keeps the patient inside the clinic&rsquo;s care system.
            </p>
          </div>
        </section>

        {/* PILOT METRICS — labelled as pilot targets per SPEC.md */}
        <section className="mb-12">
          <p className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            Pilot targets
          </p>
          <h2 className="mb-6 font-serif text-3xl tracking-tightest text-foreground">
            What success looks like.
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-serif text-3xl tracking-tightest text-sage-600">42%</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Of incoming questions safely handled as Green
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-serif text-3xl tracking-tightest text-sage-600">31%</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Routed to nurse / lactation instead of physician
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-serif text-3xl tracking-tightest text-sage-600">18</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Urgent cases surfaced per clinic per week
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-serif text-3xl tracking-tightest text-sage-600">8m → 90s</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Average chart-prep time reduction
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-border pt-8 text-xs text-muted-foreground">
          Cocuna · ACOG postpartum + AAP infant fever protocols · every triage shows its reason
        </footer>
      </main>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { ClinicHeader } from "@/components/clinic/Header";
import { ERHandoffCard } from "@/components/clinic/ERHandoffCard";
import { MetricCard } from "@/components/clinic/MetricCard";
import { SummaryDrawer } from "@/components/clinic/SummaryDrawer";
import { TriageDot } from "@/components/clinic/TriageDot";
import { VideoVisitCard } from "@/components/clinic/VideoVisitCard";
import { patientById, TRIAGE_LABEL } from "@/lib/clinic/patients";

const KIND_LABEL: Record<string, string> = {
  triage: "Triage",
  log: "Log",
  message: "Message",
  visit: "Visit",
};

export default async function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = patientById(id);
  if (!patient) notFound();

  const w = patient.wearable;
  const stressTone = w.stressScore >= 70 ? "danger" : w.stressScore >= 50 ? "warn" : "good";
  const sleepTone = w.sleepHours < 5 ? "danger" : w.sleepHours < 6.5 ? "warn" : "good";
  const hrTone = w.restingHr >= 90 ? "danger" : w.restingHr >= 80 ? "warn" : "good";

  // Persona-gated recommended-action cards. These are the headline moves the
  // clinician would take next; sit above the patient header so they read as
  // "this is what to do" before the supporting context.
  const showERHandoff = patient.id === "maria" && patient.triage === "red";
  const showVideoVisit = patient.id === "jane" && patient.triage === "orange";

  return (
    <div className="min-h-dvh">
      <ClinicHeader subtitle="Patient · timeline + summary" />

      <main className="container py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Queue
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            {showERHandoff || showVideoVisit ? (
              <section className="flex flex-col gap-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Recommended action
                </p>
                {showERHandoff ? <ERHandoffCard /> : null}
                {showVideoVisit ? <VideoVisitCard /> : null}
              </section>
            ) : null}

            <header className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <TriageDot level={patient.triage} />
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {TRIAGE_LABEL[patient.triage]}
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl tracking-tightest text-foreground">
                    {patient.name}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {patient.stageDetail}
                    {patient.delivery ? ` · ${patient.delivery}` : ""}
                  </p>
                </div>
                {showERHandoff || showVideoVisit ? null : (
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Recommended action
                    </p>
                    <p className="mt-1 max-w-xs text-sm font-medium text-foreground">
                      {patient.recommendedAction}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Why this triage
                  </p>
                  <p className="mt-1 text-sm text-foreground">{patient.triageReason}</p>
                  <ul className="mt-3 space-y-2">
                    {patient.triageContributions.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-md bg-muted/40 p-3 text-xs">
                        <span className="mt-0.5 font-medium text-foreground">{c.input}</span>
                        <span className="text-muted-foreground">{c.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Current issue
                  </p>
                  <p className="mt-1 text-sm text-foreground">{patient.currentIssue}</p>
                  {patient.latestVitals ? (
                    <>
                      <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
                        Latest vitals
                      </p>
                      <p className="mt-1 text-sm text-foreground">{patient.latestVitals}</p>
                    </>
                  ) : null}
                  {patient.riskFactors.length ? (
                    <>
                      <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
                        Risk factors
                      </p>
                      <ul className="mt-1 flex flex-wrap gap-2">
                        {patient.riskFactors.map((r) => (
                          <li
                            key={r}
                            className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground"
                          >
                            {r}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              </div>
            </header>

            <section>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Wearable signals · {patient.wearable.source}
                  </p>
                  <h2 className="font-serif text-xl tracking-tightest text-foreground">
                    What the body is saying
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">7-day rolling averages</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Resting HR"
                  value={w.restingHr}
                  unit="bpm"
                  trend={w.restingHrTrend}
                  tone={hrTone}
                  hint={w.restingHrTrend === "up" ? "Above her baseline" : "Within baseline"}
                />
                <MetricCard
                  label="HRV"
                  value={w.hrv}
                  unit="ms"
                  trend={w.hrvTrend}
                  tone={w.hrv < 30 ? "danger" : w.hrv < 45 ? "warn" : "good"}
                  hint={w.hrvTrend === "down" ? "Recovery declining" : "Recovery steady"}
                />
                <MetricCard
                  label="Stress index"
                  value={w.stressScore}
                  unit="/100"
                  tone={stressTone}
                  hint={
                    stressTone === "danger"
                      ? "Elevated last 48h"
                      : stressTone === "warn"
                        ? "Moderate"
                        : "Low"
                  }
                />
                <MetricCard
                  label="Sleep"
                  value={w.sleepHours.toFixed(1)}
                  unit="h / night"
                  tone={sleepTone}
                  hint={`Quality · ${w.sleepQuality}`}
                />
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-6">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Mother in her own words
              </p>
              <h2 className="mt-1 font-serif text-xl tracking-tightest text-foreground">
                What the numbers won&rsquo;t tell you
              </h2>
              <p className="mt-3 rounded-md bg-sage-50 p-4 text-sm italic leading-relaxed text-foreground">
                {patient.qualitative}
              </p>

              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Recent self-reports
                </p>
                <div className="mt-3 space-y-3">
                  {patient.selfReports.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-md border border-border bg-muted/30 p-4 text-sm"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-foreground">{r.date}</span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground tabular">
                          <span>mood {r.mood}/10</span>
                          <span>energy {r.energy}/10</span>
                          <span>pain {r.pain}/10</span>
                        </div>
                      </div>
                      <p className="text-foreground">&ldquo;{r.note}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <SummaryDrawer patient={patient} />
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Recent activity
              </p>
              <ol className="mt-3 space-y-3">
                {patient.recent.map((e, i) => (
                  <li key={i} className="text-sm">
                    <p className="text-xs text-muted-foreground">{e.date} · {KIND_LABEL[e.kind] ?? e.kind}</p>
                    <p className="text-foreground">{e.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Next step
              </p>
              <p className="mt-2 text-sm text-foreground">{patient.recommendedAction}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                When to escalate · {patient.whenToEscalate.toLowerCase()}
              </p>
              <button className="mt-4 w-full rounded-md bg-sage-600 px-3 py-2 text-sm font-medium text-white hover:bg-sage-700">
                Call patient
              </button>
              <button className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Send to L&amp;D
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

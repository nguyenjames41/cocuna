import Link from "next/link";

import { ClinicHeader } from "@/components/clinic/Header";
import { TriageDot } from "@/components/clinic/TriageDot";
import { PATIENTS, type TriageLevel } from "@/lib/clinic/patients";

const TRIAGE_ORDER: Record<TriageLevel, number> = {
  red: 0,
  orange: 1,
  gray: 2,
  yellow: 3,
  green: 4,
};

export default function TriageQueue() {
  const sorted = [...PATIENTS].sort((a, b) => TRIAGE_ORDER[a.triage] - TRIAGE_ORDER[b.triage]);
  const counts = sorted.reduce(
    (acc, p) => {
      acc[p.triage] = (acc[p.triage] ?? 0) + 1;
      return acc;
    },
    {} as Record<TriageLevel, number>,
  );

  return (
    <div className="min-h-dvh">
      <ClinicHeader />

      <main className="container py-10">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Today · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
          <h1 className="font-serif text-3xl tracking-tightest text-foreground md:text-4xl">
            Triage queue
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Sorted by urgency. Each row is a real patient with a reason and a one-click summary
            ready to drop into the chart. You start from a worklist, not an inbox.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["red", "orange", "yellow", "green", "gray"] as TriageLevel[]).map((lv) => (
            <span
              key={lv}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] text-foreground"
            >
              <TriageDot level={lv} />
              <span className="capitalize text-muted-foreground">{lv}</span>
              <span className="tabular text-foreground">{counts[lv] ?? 0}</span>
            </span>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="grid grid-cols-[1.4fr_1.2fr_2.4fr_1.3fr_auto] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>Patient</span>
            <span>Stage</span>
            <span>Reason</span>
            <span>Recommended action</span>
            <span />
          </div>

          {sorted.map((p) => (
            <Link
              key={p.id}
              href={`/patient/${p.id}`}
              className="grid grid-cols-[1.4fr_1.2fr_2.4fr_1.3fr_auto] gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <TriageDot level={p.triage} />
                <span className="font-medium text-foreground">{p.name}</span>
              </div>
              <span className="self-center text-sm text-muted-foreground">{p.stageDetail}</span>
              <span className="self-center text-sm text-foreground">{p.triageReason}</span>
              <span className="self-center text-sm text-foreground">{p.recommendedAction}</span>
              <span className="self-center text-muted-foreground" aria-hidden>→</span>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Cocuna RAD v0.1 · ACOG postpartum + AAP infant fever protocols · every triage shows its reason
        </p>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";

import { JANE_VIDEO_VISIT } from "@/lib/demo-data";

/**
 * Sibling of SummaryDrawer + ERHandoffCard. Renders Jane's recommended
 * same-day perinatal-psych video visit with a single CTA to confirm
 * scheduling.
 */
export function VideoVisitCard() {
  const [state, setState] = useState<"idle" | "scheduled">("idle");

  const schedule = () => {
    setState("scheduled");
  };

  const v = JANE_VIDEO_VISIT;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-sage-700">
            Same-day support
          </p>
          <h3 className="mt-1 font-serif text-xl tracking-tightest text-foreground">
            {v.doctor}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Cocuna has held a slot. One tap confirms — your patient will see
            it in her app immediately.
          </p>
        </div>
        <button
          onClick={schedule}
          disabled={state === "scheduled"}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-sage-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sage-600 disabled:bg-sage-500"
        >
          {state === "scheduled" ? "Scheduled ✓" : "Schedule visit"}
        </button>
      </div>

      <dl className="mt-5 divide-y divide-border rounded-md border border-border bg-muted/40">
        <FieldRow label="Clinician" value={v.doctor} />
        <FieldRow label="Specialty" value={v.specialty} />
        <FieldRow label="Earliest available" value={v.earliestAvailable} highlight />
        <FieldRow label="Duration" value={v.duration} />
        <FieldRow label="Clinic notified" value="Yes — your clinic has been notified" />
      </dl>

      <p className="mt-3 text-xs text-muted-foreground">{v.cocunaJoinNote}</p>
    </div>
  );
}

function FieldRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-4 px-4 py-3 text-sm">
      <dt className="font-medium text-foreground">{label}</dt>
      {highlight ? (
        <dd>
          <span className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-1 text-sm font-medium tabular text-sage-700">
            {value}
          </span>
        </dd>
      ) : (
        <dd className="tabular text-foreground">{value}</dd>
      )}
    </div>
  );
}

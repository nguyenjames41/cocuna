"use client";

import { useState } from "react";

import {
  MARIA_ER_HANDOFF_FIELDS,
  MARIA_ER_HANDOFF_TEXT,
} from "@/lib/demo-data";

/**
 * Sibling of SummaryDrawer. Renders Maria's structured ER handoff packet
 * with a one-click copy-to-clipboard so the clinician can drop it straight
 * into the ER referral message.
 */
export function ERHandoffCard() {
  const [state, setState] = useState<"idle" | "copied">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MARIA_ER_HANDOFF_TEXT);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-sage-700">
            ER Handoff
          </p>
          <h3 className="mt-1 font-serif text-xl tracking-tightest text-foreground">
            Maria Alvarez · 34 weeks pregnant
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Structured packet for the receiving ER team. Copies as one block,
            ready to drop into the referral note or read aloud on the phone.
          </p>
        </div>
        <button
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-sage-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sage-600"
        >
          {state === "copied" ? "Copied ✓" : "Copy to clipboard"}
        </button>
      </div>

      <dl className="mt-5 divide-y divide-border rounded-md border border-border bg-muted/40">
        {MARIA_ER_HANDOFF_FIELDS.map((f) => (
          <div
            key={f.label}
            className="grid grid-cols-[180px_1fr] gap-4 px-4 py-3 text-sm"
          >
            <dt className="font-medium text-foreground">{f.label}</dt>
            <dd className="tabular text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-xs text-muted-foreground">
        Cocuna RAD v0.1 · packet timestamped at generation
      </p>
    </div>
  );
}

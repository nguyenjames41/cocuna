"use client";

import { useState } from "react";

import type { Patient } from "@/lib/clinic/patients";
import { generateClinicianSummary } from "@/lib/clinic/patients";

export function SummaryDrawer({ patient }: { patient: Patient }) {
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setGenerated(generateClinicianSummary(patient));
    setCopied(false);
  };

  const copy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Clinician summary
          </p>
          <h3 className="mt-1 font-serif text-xl tracking-tightest text-foreground">
            One-click chart-ready summary
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Generates a 30-second-readable paragraph drawn from stage, vitals, mood, baby status,
            and the triage reason. Paste straight into your visit note.
          </p>
        </div>
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 rounded-md bg-sage-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sage-700"
        >
          Generate summary
        </button>
      </div>

      {generated ? (
        <div className="mt-5 rounded-md border border-border bg-muted/50 p-5">
          <p className="text-sm leading-relaxed text-foreground">{generated}</p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={copy}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              {copied ? "Copied" : "Copy to clipboard"}
            </button>
            <span className="text-xs text-muted-foreground">
              Generated · {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

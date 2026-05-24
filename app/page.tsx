import Link from "next/link";

import { ClinicHeader } from "@/components/clinic/Header";
import { TriageDot } from "@/components/clinic/TriageDot";
import { PATIENTS, TRIAGE_LABEL, type TriageLevel } from "@/lib/clinic/patients";
import { serviceSupabase } from "@/lib/supabase";

// Always re-render for live triage rows. The clinic queue is the moment of truth.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const TRIAGE_ORDER: Record<TriageLevel, number> = {
  red: 0,
  orange: 1,
  gray: 2,
  yellow: 3,
  green: 4,
};

type LiveTriage = {
  id: string;
  level: TriageLevel;
  reason: string;
  recommended: string;
  source: string;
  createdAt: string;
};

async function fetchLiveTriages(): Promise<LiveTriage[]> {
  const sb = serviceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("triage_decisions")
      .select("id, level, reason, recommended_action, source_protocol, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id as string,
      level: r.level as TriageLevel,
      reason: (r.reason as string) ?? "Reason pending",
      recommended: (r.recommended_action as string) ?? "",
      source: (r.source_protocol as string) ?? "",
      createdAt: r.created_at as string,
    }));
  } catch {
    return [];
  }
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function TriageQueue() {
  const live = await fetchLiveTriages();
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

        {live.length > 0 ? (
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-sage-200 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-sage-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-600" />
                </span>
                Live from mothers
              </span>
              <span className="text-xs text-muted-foreground">
                {live.length} triage{live.length === 1 ? "" : "s"} in the last window · auto-refreshes
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-sage-300/40 bg-sage-50/60">
              {live.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-[1.4fr_2.4fr_1.3fr_auto] gap-4 border-b border-sage-200/40 px-5 py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <TriageDot level={t.level} />
                    <span className="font-medium text-foreground">
                      Mother session · {TRIAGE_LABEL[t.level]}
                    </span>
                  </div>
                  <span className="self-center text-sm text-foreground">{t.reason}</span>
                  <span className="self-center text-sm text-foreground">{t.recommended}</span>
                  <span className="self-center text-xs text-muted-foreground">{timeAgo(t.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="grid grid-cols-[1.4fr_1.2fr_2.4fr_1.3fr_auto] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>Patient</span>
            <span>Stage</span>
            <span>Reason</span>
            <span>Recommended action</span>
            <span />
          </div>

          {sorted.map((p) => {
            const w = p.wearable;
            const hrTone =
              w.restingHr >= 90 ? "text-triage-red" : w.restingHr >= 80 ? "text-triage-orange" : "text-foreground";
            const sleepTone =
              w.sleepHours < 5 ? "text-triage-red" : w.sleepHours < 6.5 ? "text-triage-orange" : "text-foreground";
            const stressTone =
              w.stressScore >= 70 ? "text-triage-red" : w.stressScore >= 50 ? "text-triage-orange" : "text-foreground";
            return (
            <Link
              key={p.id}
              href={`/patient/${p.id}`}
              className="grid grid-cols-[1.4fr_1.2fr_2.4fr_1.3fr_auto] gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <TriageDot level={p.triage} />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <div className="mt-1 flex items-center gap-2 text-[11px] tabular text-muted-foreground">
                    <span className={hrTone}>HR {w.restingHr}{w.restingHrTrend === "up" ? "↑" : w.restingHrTrend === "down" ? "↓" : ""}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className={sleepTone}>{w.sleepHours.toFixed(1)}h sleep</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className={stressTone}>stress {w.stressScore}</span>
                  </div>
                </div>
              </div>
              <span className="self-center text-sm text-muted-foreground">{p.stageDetail}</span>
              <span className="self-center text-sm text-foreground">{p.triageReason}</span>
              <span className="self-center text-sm text-foreground">{p.recommendedAction}</span>
              <span className="self-center text-muted-foreground" aria-hidden>→</span>
            </Link>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Cocuna RAD v0.1 · ACOG postpartum + AAP infant fever protocols · every triage shows its reason
        </p>
      </main>
    </div>
  );
}

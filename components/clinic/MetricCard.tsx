export function MetricCard({
  label,
  value,
  unit,
  hint,
  trend,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  trend?: "up" | "down" | "steady";
  tone?: "neutral" | "warn" | "danger" | "good";
}) {
  const toneClass =
    tone === "warn"
      ? "text-triage-orange"
      : tone === "danger"
        ? "text-triage-red"
        : tone === "good"
          ? "text-triage-green"
          : "text-foreground";
  const trendGlyph = trend === "up" ? "↑" : trend === "down" ? "↓" : trend === "steady" ? "→" : null;
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`tabular font-serif text-3xl tracking-tightest ${toneClass}`}>{value}</span>
        {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
        {trendGlyph ? <span className="text-sm text-muted-foreground">{trendGlyph}</span> : null}
      </div>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

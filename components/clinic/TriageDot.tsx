import { type TriageLevel, TRIAGE_LABEL } from "@/lib/clinic/patients";

export function TriageDot({ level, withLabel = false }: { level: TriageLevel; withLabel?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`block h-2 w-2 rounded-full bg-triage-${level}`} aria-hidden />
      {withLabel ? (
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {TRIAGE_LABEL[level]}
        </span>
      ) : null}
    </span>
  );
}

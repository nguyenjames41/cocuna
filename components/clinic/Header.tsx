import Link from "next/link";

export function ClinicHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-sage-200 font-serif text-base text-sage-700">
            c
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg leading-none tracking-tightest text-foreground">
              cocuna
            </span>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {subtitle ?? "Clinic continuity"}
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <Link href="/" className="hover:text-foreground">Queue</Link>
          <Link href="/analytics" className="hover:text-foreground">Analytics</Link>
          <span className="text-muted-foreground/60">·</span>
          <span className="text-foreground">Dr. Patel</span>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-sage-100 text-xs font-medium text-sage-700">
            DP
          </div>
        </nav>
      </div>
    </header>
  );
}

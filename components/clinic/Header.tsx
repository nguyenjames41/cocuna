import Image from "next/image";
import Link from "next/link";

export function ClinicHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/cocuna-logo.png"
            alt="Cocuna"
            width={44}
            height={44}
            className="h-11 w-11"
            priority
          />
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {subtitle ?? "Clinic continuity"}
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground/80">
            Private by design · Clinician built · HIPAA aligned
          </span>
          <span className="text-muted-foreground/40">·</span>
          <Link href="/" className="hover:text-foreground">Queue</Link>
          <span className="text-foreground">Dr. Patel</span>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-sage-100 text-xs font-medium text-sage-700">
            DP
          </div>
        </nav>
      </div>
    </header>
  );
}

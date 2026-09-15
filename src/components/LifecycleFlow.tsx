import { cn } from "@/lib/utils";

const STAGES = [
  "Report",
  "Understand",
  "Detect Duplicates",
  "Cluster Community Issue",
  "Prioritize",
  "Route",
  "Authority Action",
  "Submit Proof",
  "Citizen Verification",
  "Resolved / Reopened",
] as const;

/**
 * Flowing lifecycle ribbon: a continuous line with a travelling dash that
 * visually carries a complaint through its stages.
 */
export function LifecycleFlow({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 1000 90"
        role="presentation"
        aria-hidden="true"
        className="h-16 w-full sm:h-20"
      >
        <defs>
          <linearGradient id="niv-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#274c77" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#4b95c9" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#eaf2f8" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path
          d="M10 62 C 150 62, 180 20, 320 20 S 500 66, 640 66 S 830 22, 990 30"
          fill="none"
          stroke="url(#niv-flow)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 62 C 150 62, 180 20, 320 20 S 500 66, 640 66 S 830 22, 990 30"
          fill="none"
          stroke="#7fc0e8"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="flow-dash opacity-70"
        />
      </svg>

      <ol className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
        {STAGES.map((stage, i) => (
          <li key={stage} className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full bg-soft/70 px-3 py-1 text-xs font-semibold text-soft-foreground ring-1 ring-inset ring-border">
              <span className="size-1.5 rounded-full bg-accent" />
              {stage}
            </span>
            {i < STAGES.length - 1 && (
              <span className="hidden h-px w-5 bg-border sm:block" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Soft, slow-moving abstract blue field used behind dark sections. */
export function AmbientBlue() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="animate-drift absolute -top-32 -left-24 size-[28rem] rounded-full bg-slate-blue/30 blur-3xl" />
      <div
        className="animate-drift absolute -top-16 right-0 size-[22rem] rounded-full bg-accent/15 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-drift absolute bottom-0 left-1/3 size-[20rem] rounded-full bg-navy/60 blur-3xl"
        style={{ animationDelay: "-11s" }}
      />
    </div>
  );
}

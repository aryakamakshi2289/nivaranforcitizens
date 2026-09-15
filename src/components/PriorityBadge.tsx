import { useState } from "react";

import { cn } from "@/lib/utils";
import { PRIORITY_DOT, PRIORITY_TONE, type Priority } from "@/lib/nivaran-intelligence";

export function PriorityPill({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const tone = PRIORITY_TONE[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tone.bg,
        tone.text,
        tone.ring,
        className,
      )}
    >
      <span aria-hidden="true">{PRIORITY_DOT[priority]}</span>
      {priority}
    </span>
  );
}

/** Priority pill with an explainable "Why?" disclosure — rule-based, not a black box. */
export function PriorityBadge({
  priority,
  factors,
  className,
}: {
  priority: Priority;
  factors: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const tone = PRIORITY_TONE[priority];

  return (
    <div className={cn("inline-block", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <PriorityPill priority={priority} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-full border border-input px-2.5 py-1 text-xs font-medium text-secondary transition duration-300 hover:border-accent/60 hover:text-primary"
        >
          {open ? "Hide" : `Why ${priority.toLowerCase()}?`}
        </button>
      </div>

      {open && (
        <div
          className={cn(
            "animate-in fade-in slide-in-from-top-1 mt-3 max-w-sm rounded-xl bg-navy-deep/80 p-4 ring-1 ring-inset duration-300",
            tone.ring,
          )}
        >
          <p className="label-caps">Why this is {priority}</p>
          <ul className="mt-2 space-y-1.5">
            {factors.map((factor) => (
              <li key={factor} className="flex gap-2 text-sm text-secondary/90">
                <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", tone.text, "bg-current")} />
                {factor}
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
            Priority recommendation:{" "}
            <span className={cn("font-semibold", tone.text)}>{priority.toUpperCase()}</span> · rule-based
            for this prototype.
          </p>
        </div>
      )}
    </div>
  );
}

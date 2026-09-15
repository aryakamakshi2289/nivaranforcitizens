import { useState } from "react";

import { PriorityPill } from "@/components/PriorityBadge";
import { SectionLabel } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import { PRIORITY_TONE } from "@/lib/nivaran-intelligence";
import type { CommunityIssue } from "@/lib/nivaran-store";

/**
 * Civic Pulse — a lightweight prototype visualisation of where complaints
 * concentrate. Sketch coordinates only; no map service is involved.
 */
export function CivicPulse({ issues }: { issues: CommunityIssue[] }) {
  const [openId, setOpenId] = useState<string | null>(issues[0]?.id ?? null);
  const open = issues.find((i) => i.id === openId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <SectionLabel>Civic Pulse</SectionLabel>
          <p className="mt-1 text-sm text-muted-foreground">
            Where reports are concentrating right now. Sketch view, not a live map.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-navy-deep ring-1 ring-inset ring-border">
          {/* abstract district lines */}
          <svg
            viewBox="0 0 100 75"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full opacity-40"
          >
            <path d="M0 22 H100" stroke="#263b73" strokeWidth="0.4" />
            <path d="M0 50 H100" stroke="#263b73" strokeWidth="0.4" />
            <path d="M26 0 V75" stroke="#263b73" strokeWidth="0.4" />
            <path d="M58 0 V75" stroke="#263b73" strokeWidth="0.4" />
            <path
              d="M4 60 C 24 60, 26 32, 44 32 S 66 20, 96 14"
              fill="none"
              stroke="#3b6ea8"
              strokeWidth="0.6"
              className="flow-dash"
            />
          </svg>

          {issues.map((issue, i) => {
            const tone = PRIORITY_TONE[issue.priority];
            const active = issue.id === openId;
            return (
              <button
                key={issue.id}
                type="button"
                onClick={() => setOpenId(issue.id)}
                aria-label={`${issue.area}: ${issue.title}`}
                style={{ left: `${issue.pulse.x}%`, top: `${issue.pulse.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span className="relative grid place-items-center">
                  <span
                    style={{ ["--pulse-delay" as string]: `${i * 600}ms` }}
                    className={cn(
                      "pulse-ring absolute size-8 rounded-full",
                      tone.bg,
                      tone.text,
                    )}
                  />
                  <span
                    className={cn(
                      "relative size-4 rounded-full bg-current ring-4 transition duration-300",
                      tone.text,
                      active ? "ring-primary/40 scale-110" : "ring-transparent",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "mt-1.5 block rounded-md bg-navy/90 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ring-1 ring-inset ring-border transition duration-300",
                    active ? "text-primary" : "text-secondary/80",
                  )}
                >
                  {issue.area}
                </span>
              </button>
            );
          })}
        </div>

        <div>
          {open ? (
            <div
              key={open.id}
              className="animate-in fade-in slide-in-from-bottom-2 panel-deep p-5 duration-500"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-accent">{open.id}</span>
                <PriorityPill priority={open.priority} />
              </div>
              <h3 className="mt-2 font-display text-base font-bold text-primary">{open.title}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ["Related reports", `${open.reportCount}`],
                  ["Issue", open.category],
                  ["Area", `${open.area}, ${open.city}`],
                  ["Routed to", open.department],
                  ["Cluster status", open.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a hotspot to see its details.</p>
          )}

          <ul className="mt-4 space-y-2">
            {issues.map((issue) => (
              <li key={issue.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(issue.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition duration-300",
                    issue.id === openId
                      ? "bg-soft/80 text-primary"
                      : "bg-navy-deep/60 text-secondary hover:bg-soft/50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full bg-current", PRIORITY_TONE[issue.priority].text)} />
                    {issue.area}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {issue.reportCount} reports · {issue.priority}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

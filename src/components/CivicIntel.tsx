import { useState } from "react";

import { Timeline } from "@/components/Timeline";
import { PriorityBadge, PriorityPill } from "@/components/PriorityBadge";
import { SectionLabel } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import type { Analysis } from "@/lib/nivaran-intelligence";
import type { CommunityIssue, TimelineEvent } from "@/lib/nivaran-store";

/* ---------- department routing ---------- */

export function RoutingPanel({
  department,
  reason,
  className,
}: {
  department: string;
  reason: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-indigo/25 p-4 ring-1 ring-inset ring-indigo/50",
        className,
      )}
    >
      <SectionLabel>Routed to</SectionLabel>
      <p className="mt-1 font-display text-base font-bold text-primary">{department}</p>
      <p className="mt-2 label-caps">Reason</p>
      <p className="mt-0.5 text-sm text-secondary/90">{reason}</p>
    </div>
  );
}

/* ---------- complaint understanding ---------- */

export function AnalysisPanel({ analysis }: { analysis: Analysis }) {
  const rows: [string, string][] = [
    ["Category", analysis.category],
    ["Location", analysis.location],
    ["Urgency", analysis.urgency],
    ["Evidence", analysis.evidence],
  ];

  return (
    <div className="panel-deep p-5">
      <SectionLabel>Complaint Analysis</SectionLabel>
      <p className="mt-2 rounded-lg bg-field/95 px-3.5 py-2.5 text-sm font-medium text-ink">
        “{analysis.issue}”
      </p>
      <dl className="mt-4 space-y-2.5">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            className="animate-in fade-in slide-in-from-left-2 flex items-baseline gap-2 duration-500"
          >
            <span className="text-accent" aria-hidden="true">
              →
            </span>
            <dt className="text-sm text-muted-foreground">{label}:</dt>
            <dd className="text-sm font-semibold text-primary">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        Read using simple rules over the text, category and evidence you submitted — no AI model is
        connected in this prototype.
      </p>
    </div>
  );
}

/* ---------- duplicate detection + clustering ---------- */

const FLOW_STEPS = (count: number) => [
  `${count} Individual Reports`,
  "Detected Similarity",
  "Community Issue Cluster",
  "Prioritized Issue",
];

export function ClusterFlow({ count }: { count: number }) {
  return (
    <ol className="space-y-0">
      {FLOW_STEPS(count).map((step, i, arr) => (
        <li key={step} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              style={{ ["--tl-delay" as string]: `${i * 130}ms` }}
              className="timeline-dot mt-1.5 size-2 shrink-0 rounded-full bg-accent"
            />
            {i < arr.length - 1 && (
              <span
                style={{ ["--tl-delay" as string]: `${i * 130 + 90}ms` }}
                className="timeline-grow w-px flex-1 bg-gradient-to-b from-accent/50 to-border"
              />
            )}
          </div>
          <p
            style={{ ["--tl-delay" as string]: `${i * 130}ms` }}
            className={cn(
              "timeline-dot text-sm font-medium text-primary",
              i < arr.length - 1 ? "pb-4" : "pb-0",
            )}
          >
            {step}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function CommunityIssuePanel({
  issue,
  showReports = true,
}: {
  issue: CommunityIssue;
  showReports?: boolean;
}) {
  const [openReports, setOpenReports] = useState(false);

  return (
    <div className="panel-deep p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>Community Issue · {issue.id}</SectionLabel>
        <PriorityPill priority={issue.priority} />
      </div>

      <h3 className="mt-2 font-display text-lg font-bold text-primary">{issue.title}</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          `${issue.reportCount} related reports`,
          `${issue.daysActive} days active`,
          `${issue.populationAffected} population affected`,
          issue.risk,
        ].map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-soft/70 px-3 py-1 text-xs font-medium text-soft-foreground ring-1 ring-inset ring-border"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="label-caps mb-3">How this was grouped</p>
          <ClusterFlow count={issue.reportCount} />
        </div>
        <div className="space-y-4">
          <RoutingPanel
            department={issue.department}
            reason={`Category: ${issue.category === "Garbage" ? "Garbage Collection" : issue.category}`}
          />
          <PriorityBadge priority={issue.priority} factors={issue.priorityFactors} />
        </div>
      </div>

      {showReports && (
        <div className="mt-5 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setOpenReports((v) => !v)}
            aria-expanded={openReports}
            className="text-sm font-semibold text-accent transition hover:text-primary"
          >
            {openReports ? "Hide individual reports" : `View ${issue.reportCount} individual reports`}
          </button>
          <p className="mt-1 text-xs text-muted-foreground">
            Grouping never deletes a report. Each one stays traceable on its own.
          </p>

          {openReports && (
            <ul className="animate-in fade-in mt-4 max-h-72 space-y-2 overflow-y-auto pr-1 duration-300">
              {issue.relatedReports.map((report) => (
                <li
                  key={report.id}
                  className="rounded-lg bg-navy/70 px-3.5 py-2.5 ring-1 ring-inset ring-border"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-accent">{report.id}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {report.reportedAt}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-secondary/90">{report.snippet}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- view history ---------- */

export function HistoryDisclosure({
  events,
  defaultOpen = false,
}: {
  events: TimelineEvent[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <SectionLabel>Complaint History</SectionLabel>
          <p className="mt-1 text-sm text-muted-foreground">
            Updates become history. They don't disappear.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-xl border border-input px-3.5 py-2 text-sm font-semibold text-primary transition duration-300 hover:border-accent/60 hover:bg-soft/60"
        >
          {open ? "Hide History" : "View History"}
        </button>
      </div>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 mt-6 duration-500">
          <Timeline events={events} />
        </div>
      )}
    </div>
  );
}

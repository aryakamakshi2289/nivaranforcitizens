import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/nivaran-store";

const dotTone: Record<TimelineEvent["tone"], string> = {
  neutral: "bg-secondary ring-secondary/20",
  accent: "bg-accent ring-accent/25",
  awaiting: "bg-awaiting ring-awaiting/25",
  verified: "bg-verified ring-verified/25",
  challenged: "bg-challenged ring-challenged/25",
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-0">
      {events.map((event, index) => {
        const last = index === events.length - 1;
        const delay = index * 110;
        return (
          <li key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                style={{ ["--tl-delay" as string]: `${delay}ms` }}
                className={cn(
                  "timeline-dot mt-1 size-3 shrink-0 rounded-full ring-4",
                  dotTone[event.tone],
                )}
              />
              {!last && (
                <span
                  style={{ ["--tl-delay" as string]: `${delay + 90}ms` }}
                  className="timeline-grow w-px flex-1 bg-gradient-to-b from-accent/45 to-border"
                />
              )}
            </div>
            <div
              style={{ ["--tl-delay" as string]: `${delay}ms` }}
              className={cn("timeline-dot min-w-0", last ? "pb-1" : "pb-6")}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-sm font-semibold text-primary">{event.label}</h3>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {event.timestamp}
                </span>
              </div>
              <p className="mt-1 text-sm text-secondary/75">{event.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

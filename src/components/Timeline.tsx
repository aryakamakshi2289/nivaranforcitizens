import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/nivaran-store";

const dotTone: Record<TimelineEvent["tone"], string> = {
  neutral: "bg-primary ring-primary/12",
  accent: "bg-accent ring-accent/15",
  awaiting: "bg-awaiting ring-awaiting/20",
  verified: "bg-verified ring-verified/20",
  challenged: "bg-challenged ring-challenged/20",
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-0">
      {events.map((event, index) => {
        const last = index === events.length - 1;
        return (
          <li key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={cn("mt-1 size-3 shrink-0 rounded-full ring-4", dotTone[event.tone])} />
              {!last && <span className="w-px flex-1 bg-border" />}
            </div>
            <div className={cn("min-w-0", last ? "pb-1" : "pb-6")}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-sm font-semibold text-primary">{event.label}</h3>
                <span className="font-mono text-[11px] text-muted-foreground">{event.timestamp}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

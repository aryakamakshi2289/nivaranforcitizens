import { cn } from "@/lib/utils";
import type { ComplaintStatus } from "@/lib/nivaran-store";

const styles: Record<ComplaintStatus, string> = {
  Open: "bg-soft text-secondary ring-secondary/20",
  "Awaiting Citizen Verification": "bg-awaiting/12 text-awaiting ring-awaiting/30",
  Resolved: "bg-verified/12 text-verified ring-verified/30",
  Reopened: "bg-challenged/12 text-challenged ring-challenged/30",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ComplaintStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

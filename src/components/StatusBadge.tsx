import { cn } from "@/lib/utils";
import type { ComplaintStatus } from "@/lib/nivaran-store";

const styles: Record<ComplaintStatus, string> = {
  Open: "bg-soft/80 text-soft-foreground ring-border",
  "Awaiting Citizen Verification": "bg-awaiting/15 text-awaiting ring-awaiting/40",
  Resolved: "bg-verified/15 text-verified ring-verified/40",
  Reopened: "bg-challenged/15 text-challenged ring-challenged/40",
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition duration-300",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

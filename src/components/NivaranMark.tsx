import { cn } from "@/lib/utils";

/**
 * Nivaran mark: an unresolved node on the left, a flowing path that rises,
 * and a resolved node on the right — change moving from broken to fixed.
 * Simple enough to work as an app icon / favicon later.
 */
export function NivaranMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Nivaran"
      className={cn("block", className)}
    >
      <defs>
        <linearGradient id="niv-mark-flow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#263b73" />
          <stop offset="55%" stopColor="#3b6ea8" />
          <stop offset="100%" stopColor="#8fb9e2" />
        </linearGradient>
      </defs>

      {/* the pathway from unresolved to resolved */}
      <path
        d="M10 35 C 18 35, 20 13, 30 13 C 36 13, 38 19, 38 19"
        fill="none"
        stroke="url(#niv-mark-flow)"
        strokeWidth="4.5"
        strokeLinecap="round"
        style={animated ? { ["--intro-delay" as string]: "120ms" } : undefined}
        className={animated ? "intro-trail" : undefined}
      />

      {/* unresolved node */}
      <circle cx="10" cy="35" r="4.5" fill="#8fb9e2" opacity="0.55" />
      {/* resolved node */}
      <circle cx="38" cy="19" r="5" fill="#5fb489" />
    </svg>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useReveal } from "@/components/Reveal";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("card-surface card-lift reveal", shown && "reveal-in", className)}>
      {children}
    </div>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("label-caps", className)}>{children}</p>;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-primary">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

/* Contained light element: off-white field on the dark navy surface. */
export const inputClass =
  "w-full rounded-xl border border-transparent bg-field px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-blue/55 outline-none transition duration-300 focus:border-accent focus:ring-4 focus:ring-accent/25";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-300 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const buttonVariants = {
  primary: `${buttonBase} bg-accent text-primary shadow-[0_10px_28px_-14px_rgb(75_149_201/0.9)] hover:bg-accent/90 hover:-translate-y-0.5`,
  accent: `${buttonBase} bg-accent/15 text-accent ring-1 ring-inset ring-accent/40 hover:bg-accent/25 hover:-translate-y-0.5`,
  outline: `${buttonBase} border border-input bg-soft/40 text-primary hover:border-accent/60 hover:bg-soft/70`,
  verified: `${buttonBase} bg-verified/18 text-verified ring-1 ring-inset ring-verified/45 hover:bg-verified/28 hover:-translate-y-0.5`,
  challenged: `${buttonBase} border border-challenged/40 bg-challenged/10 text-challenged hover:bg-challenged/18`,
};

export function MetaGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl bg-navy-deep/70 p-3.5 ring-1 ring-inset ring-border transition duration-300 hover:ring-accent/35"
        >
          <dt className="label-caps">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EvidenceFrame({
  src,
  alt,
  emptyLabel,
}: {
  src: string | null;
  alt: string;
  emptyLabel: string;
}) {
  if (!src) {
    return (
      <div className="grid aspect-4/3 w-full place-items-center rounded-xl border border-dashed border-input bg-navy-deep/60 text-center">
        <span className="label-caps px-6">{emptyLabel}</span>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl bg-field p-1.5 ring-1 ring-inset ring-border">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={1024}
        height={768}
        className="aspect-4/3 w-full rounded-lg object-cover transition duration-500 ease-out hover:scale-[1.02]"
      />
    </div>
  );
}

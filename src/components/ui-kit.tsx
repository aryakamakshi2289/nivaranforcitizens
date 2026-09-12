import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card-surface", className)}>{children}</div>;
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

export const inputClass =
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/25";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const buttonVariants = {
  primary: `${buttonBase} bg-primary text-primary-foreground hover:bg-secondary`,
  accent: `${buttonBase} bg-accent text-accent-foreground hover:bg-accent/90`,
  outline: `${buttonBase} border border-input bg-card text-primary hover:border-accent hover:text-accent`,
  verified: `${buttonBase} bg-verified text-primary-foreground hover:bg-verified/90`,
  challenged: `${buttonBase} border border-challenged/40 bg-card text-challenged hover:bg-challenged/8`,
};

export function MetaGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-soft/70 p-3.5">
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
      <div className="grid aspect-4/3 w-full place-items-center rounded-xl border border-dashed border-input bg-soft/60 text-center">
        <span className="label-caps px-6">{emptyLabel}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={1024}
      height={768}
      className="aspect-4/3 w-full rounded-xl object-cover ring-1 ring-inset ring-border"
    />
  );
}

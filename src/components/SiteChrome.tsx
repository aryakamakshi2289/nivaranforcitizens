import { Link } from "@tanstack/react-router";

import { NivaranMark } from "@/components/NivaranMark";

const links = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report" },
  { to: "/track", label: "Track" },
  { to: "/verify", label: "Verify" },
  { to: "/authority", label: "Authority" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-navy-deep/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <NivaranMark className="size-8 transition duration-300 group-hover:scale-105" />
          <span className="font-display text-lg font-bold text-primary">Nivaran</span>
        </Link>

        <nav className="flex items-center gap-0.5 overflow-x-auto text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="relative rounded-lg px-3 py-1.5 font-medium whitespace-nowrap text-secondary/80 transition duration-300 hover:bg-soft/60 hover:text-primary data-[status=active]:bg-soft/80 data-[status=active]:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-navy-deep/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-primary">Nivaran</span>
          <span className="label-caps">Report it. Track it. Verify it.</span>
        </div>
        <p className="text-muted-foreground">
          Don't just mark it resolved. Prove it. · Demo prototype, fictional data only.
        </p>
      </div>
    </footer>
  );
}

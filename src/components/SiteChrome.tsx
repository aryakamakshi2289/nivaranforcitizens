import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report" },
  { to: "/track", label: "Track" },
  { to: "/verify", label: "Verify" },
  { to: "/authority", label: "Authority" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
            N
          </span>
          <span className="font-display text-lg font-bold text-primary">Nivaran</span>
        </Link>

        <nav className="flex items-center gap-0.5 overflow-x-auto text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-lg px-3 py-1.5 font-medium whitespace-nowrap text-secondary/80 transition hover:bg-soft hover:text-primary data-[status=active]:bg-soft data-[status=active]:text-primary"
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
    <footer className="mt-16 border-t border-border">
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

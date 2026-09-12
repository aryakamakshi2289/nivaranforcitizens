import { createFileRoute, Link } from "@tanstack/react-router";

import { Card } from "@/components/ui-kit";
import { buttonVariants } from "@/components/ui-kit";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nivaran — Report it. Track it. Verify it." },
      {
        name: "description",
        content:
          "A civic complaint platform where every complaint leaves a trace and no issue is closed without proof and citizen verification.",
      },
      { property: "og:title", content: "Nivaran — Report it. Track it. Verify it." },
      {
        property: "og:description",
        content: "Every complaint leaves a trace. Every resolution requires proof.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  {
    n: "01",
    title: "Report",
    body: "Submit the problem with evidence and location.",
  },
  {
    n: "02",
    title: "Track",
    body: "Follow every important action through a clear timeline.",
  },
  {
    n: "03",
    title: "Verify",
    body: "Review resolution evidence before accepting that the issue is fixed.",
  },
];

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 lg:px-8">
      <section className="grid items-start gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-soft px-3 py-1.5 text-xs font-semibold text-secondary">
            <span className="size-1.5 rounded-full bg-accent" />
            Don't just mark it resolved. Prove it.
          </span>

          <h1 className="mt-6 font-display text-4xl leading-[1.05] font-extrabold text-primary sm:text-5xl lg:text-6xl">
            Report it.
            <br />
            Track it.
            <br />
            <span className="text-accent">Verify it.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-secondary/85">
            Every complaint leaves a trace. Every resolution requires proof.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/report" className={buttonVariants.primary}>
              Report a Problem
            </Link>
            <Link to="/track" className={buttonVariants.outline}>
              Track a Complaint
            </Link>
          </div>
        </div>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              Record · <span className="text-primary">NIV-1047</span>
            </span>
            <StatusBadge status="Awaiting Citizen Verification" />
          </div>
          <p className="mt-4 font-display text-lg font-bold text-primary">
            Large pothole on Sector 15 road
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Pothole · Sector 15 · Reported 12 Sept</p>

          <div className="mt-5 space-y-4">
            {[
              ["Complaint submitted", "12 Sept · 10:32 AM"],
              ["Assigned to authority", "13 Sept · 09:15 AM"],
              ["Resolution evidence submitted", "15 Sept · 04:20 PM"],
              ["Awaiting citizen verification", "15 Sept · 04:21 PM"],
            ].map(([label, time], i, arr) => (
              <div key={label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 size-2.5 shrink-0 rounded-full ${i === arr.length - 1 ? "bg-awaiting" : "bg-accent"}`}
                  />
                  {i < arr.length - 1 && <span className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-1">
                  <p className="text-sm font-medium text-primary">{label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{time}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
            Nothing is silently overwritten. Each action is added as its own event.
          </p>
        </Card>
      </section>

      <section className="grid gap-4 pb-6 md:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="p-6">
            <span className="font-mono text-xs text-accent">{step.n}</span>
            <h2 className="mt-3 font-display text-xl font-bold text-primary">{step.title}</h2>
            <p className="mt-2 text-sm text-secondary/80">{step.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

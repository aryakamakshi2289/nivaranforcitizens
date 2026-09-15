import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { Card, EvidenceFrame, MetaGrid, SectionLabel, buttonVariants, inputClass } from "@/components/ui-kit";
import { CommunityIssuePanel, HistoryDisclosure, RoutingPanel } from "@/components/CivicIntel";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useNivaran } from "@/lib/nivaran-store";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Complaint — Nivaran" },
      {
        name: "description",
        content:
          "Look up a complaint by its ID and follow every action on it through a permanent, append-only timeline.",
      },
      { property: "og:title", content: "Track Complaint — Nivaran" },
      {
        property: "og:description",
        content: "Follow every important action on a civic complaint through a clear timeline.",
      },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { activeId, setActiveId, getComplaint, getCluster, complaints } = useNivaran();
  const [query, setQuery] = useState(activeId);
  const [notFound, setNotFound] = useState(false);

  const complaint = getComplaint(activeId);
  const cluster = getCluster(complaint?.clusterId ?? null);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const match = getComplaint(query);
    if (match) {
      setActiveId(match.id);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-primary">Track Complaint</h1>
          <p className="mt-2 max-w-xl text-secondary/85">
            Enter a complaint ID to see its full history. Earlier actions always remain part of the
            record.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full max-w-sm gap-2">
          <input
            className={inputClass}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="NIV-1047"
            aria-label="Complaint ID"
          />
          <button type="submit" className={buttonVariants.accent}>
            Find
          </button>
        </form>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {complaints.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActiveId(c.id);
              setQuery(c.id);
              setNotFound(false);
            }}
            className={`rounded-full px-3 py-1.5 font-mono text-xs transition ${
              c.id === activeId
                ? "bg-primary text-primary-foreground"
                : "bg-soft text-secondary hover:text-accent"
            }`}
          >
            {c.id}
          </button>
        ))}
      </div>

      {notFound && (
        <p className="mt-4 text-sm text-challenged">No complaint found with that ID.</p>
      )}

      {complaint && (
        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          <Card className="p-6 sm:p-8 lg:col-span-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-xl font-bold text-primary">{complaint.id}</span>
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {complaint.category} · Reported {complaint.reportedAt}
                </p>
              </div>
              {complaint.resolution && (
                <Link to="/verify" className={buttonVariants.accent}>
                  Review Resolution
                </Link>
              )}
            </div>

            <h2 className="mt-5 font-display text-lg font-bold text-primary">{complaint.title}</h2>
            <p className="mt-2 text-secondary/85">{complaint.description}</p>

            <div className="mt-6">
              <SectionLabel>Original Evidence</SectionLabel>
              <div className="mt-2">
                <EvidenceFrame
                  src={complaint.image}
                  alt={`Original evidence for ${complaint.id}`}
                  emptyLabel="No photo attached to this complaint"
                />
              </div>
            </div>

            <div className="mt-6">
              <MetaGrid
                items={[
                  { label: "Category", value: complaint.analysis.category },
                  { label: "Location", value: complaint.location },
                  { label: "Date Reported", value: complaint.reportedAt },
                ]}
              />
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <RoutingPanel
                department={complaint.department}
                reason={`Category: ${complaint.analysis.category}`}
              />
              <div className="panel-deep p-4">
                <SectionLabel>Priority</SectionLabel>
                <div className="mt-3">
                  <PriorityBadge
                    priority={complaint.priority}
                    factors={complaint.priorityFactors}
                  />
                </div>
              </div>
            </div>

            {cluster && (
              <div className="mt-6">
                <CommunityIssuePanel issue={cluster} />
              </div>
            )}
          </Card>

          <Card className="p-6 sm:p-8 lg:col-span-2">
            <HistoryDisclosure events={complaint.events} defaultOpen />
          </Card>
        </div>
      )}
    </div>
  );
}

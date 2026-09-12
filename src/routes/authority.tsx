import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import {
  Card,
  EvidenceFrame,
  Field,
  MetaGrid,
  SectionLabel,
  buttonVariants,
  inputClass,
} from "@/components/ui-kit";
import { useNivaran } from "@/lib/nivaran-store";

export const Route = createFileRoute("/authority")({
  head: () => ({
    meta: [
      { title: "Authority Dashboard — Nivaran" },
      {
        name: "description",
        content:
          "Authority workspace for reviewing civic complaints and submitting resolution evidence for citizen verification.",
      },
      { property: "og:title", content: "Authority Dashboard — Nivaran" },
      {
        property: "og:description",
        content: "Review complaints and submit proof for citizen verification, not a resolved flag.",
      },
    ],
  }),
  component: AuthorityPage,
});

function AuthorityPage() {
  const { complaints, submitResolution } = useNivaran();
  const [openId, setOpenId] = useState<string | null>("NIV-1047");

  const selected = complaints.find((c) => c.id === openId) ?? null;

  const summary = [
    {
      label: "Open Complaints",
      value: complaints.filter((c) => c.status === "Open" || c.status === "Reopened").length,
      tone: "text-secondary",
    },
    {
      label: "Awaiting Verification",
      value: complaints.filter((c) => c.status === "Awaiting Citizen Verification").length,
      tone: "text-awaiting",
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
      tone: "text-verified",
    },
    {
      label: "Reopened",
      value: complaints.filter((c) => c.status === "Reopened").length,
      tone: "text-challenged",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold text-primary">Authority Dashboard</h1>
      <p className="mt-2 max-w-2xl text-secondary/85">
        Resolution requires evidence. Submitting proof sends the complaint to the citizen for
        verification instead of closing it.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((card) => (
          <Card key={card.label} className="p-5">
            <p className="label-caps">{card.label}</p>
            <p className={`mt-2 font-display text-3xl font-extrabold ${card.tone}`}>{card.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="hidden grid-cols-[110px_1.4fr_1fr_110px_190px] gap-4 border-b border-border px-5 py-3 md:grid">
          {["ID", "Issue", "Location", "Date", "Status"].map((h) => (
            <span key={h} className="label-caps">
              {h}
            </span>
          ))}
        </div>
        {complaints.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setOpenId(c.id)}
            className={`grid w-full gap-2 border-b border-border px-5 py-4 text-left text-sm transition last:border-b-0 hover:bg-soft/60 md:grid-cols-[110px_1.4fr_1fr_110px_190px] md:items-center md:gap-4 ${
              c.id === openId ? "bg-soft/70" : ""
            }`}
          >
            <span className="font-mono text-primary">{c.id}</span>
            <span className="font-medium text-primary">{c.title}</span>
            <span className="text-muted-foreground">{c.location}</span>
            <span className="font-mono text-xs text-muted-foreground">{c.reportedAt}</span>
            <span>
              <StatusBadge status={c.status} />
            </span>
          </button>
        ))}
      </Card>

      {selected && (
        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          <Card className="p-6 sm:p-8 lg:col-span-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-xl font-bold text-primary">{selected.id}</span>
              <StatusBadge status={selected.status} />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-primary">{selected.title}</h2>
            <p className="mt-2 text-secondary/85">{selected.description}</p>

            <div className="mt-6">
              <SectionLabel>Original Evidence</SectionLabel>
              <div className="mt-2">
                <EvidenceFrame
                  src={selected.image}
                  alt={`Original evidence for ${selected.id}`}
                  emptyLabel="No photo attached to this complaint"
                />
              </div>
            </div>

            <div className="mt-6">
              <MetaGrid
                items={[
                  { label: "Category", value: selected.category },
                  { label: "Location", value: selected.location },
                  { label: "Date Reported", value: selected.reportedAt },
                ]}
              />
            </div>

            <ResolutionForm
              key={selected.id + selected.status}
              defaultLocation={selected.location}
              status={selected.status}
              onSubmit={(input) => submitResolution(selected.id, input)}
            />
          </Card>

          <Card className="p-6 sm:p-8 lg:col-span-2">
            <SectionLabel>Complaint Timeline</SectionLabel>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              Every action is recorded as its own event.
            </p>
            <Timeline events={selected.events} />
          </Card>
        </div>
      )}
    </div>
  );
}

function ResolutionForm({
  defaultLocation,
  status,
  onSubmit,
}: {
  defaultLocation: string;
  status: string;
  onSubmit: (input: {
    description: string;
    location: string;
    timestamp: string;
    image: string | null;
  }) => void;
}) {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [timestamp, setTimestamp] = useState("");
  const [image, setImage] = useState<string | null>(null);

  if (status === "Awaiting Citizen Verification") {
    return (
      <div className="mt-7 rounded-xl bg-awaiting/8 p-5 ring-1 ring-inset ring-awaiting/25">
        <h3 className="font-display text-base font-bold text-awaiting">
          Awaiting Citizen Verification
        </h3>
        <p className="mt-1.5 text-sm text-secondary/85">
          Proof has been submitted. The citizen now reviews the evidence and either verifies or
          challenges it.
        </p>
      </div>
    );
  }

  if (status === "Resolved") {
    return (
      <div className="mt-7 rounded-xl bg-verified/8 p-5 ring-1 ring-inset ring-verified/25">
        <h3 className="font-display text-base font-bold text-verified">
          Resolved by citizen verification
        </h3>
      </div>
    );
  }

  return (
    <form
      className="mt-7 space-y-5 border-t border-border pt-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          description,
          location,
          timestamp: timestamp
            ? new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).format(new Date(timestamp))
            : "Just now",
          image,
        });
      }}
    >
      <div>
        <h3 className="font-display text-lg font-bold text-primary">Submit Resolution</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Evidence, location and timestamp are all required before a citizen can review the fix.
        </p>
      </div>

      <Field label="Resolution Description">
        <textarea
          required
          rows={3}
          className={inputClass}
          placeholder="Pothole backfilled and resurfaced with hot-mix asphalt."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Field label="After / Fix Evidence">
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImage(URL.createObjectURL(file));
          }}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Resolution Location">
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>
        <Field label="Resolution Timestamp">
          <input
            type="datetime-local"
            className={inputClass}
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
        </Field>
      </div>

      <button type="submit" className={buttonVariants.primary}>
        Submit Proof for Verification
      </button>
    </form>
  );
}

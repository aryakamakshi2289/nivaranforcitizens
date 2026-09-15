import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { Card, Field, SectionLabel, buttonVariants, inputClass } from "@/components/ui-kit";
import { EvidenceCapture } from "@/components/EvidenceCapture";
import { LocationPicker, type LocationValue } from "@/components/LocationPicker";
import { AnalysisPanel, CommunityIssuePanel, RoutingPanel } from "@/components/CivicIntel";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CATEGORIES, useNivaran } from "@/lib/nivaran-store";
import { formatLocation } from "@/lib/nivaran-locations";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Problem — Nivaran" },
      {
        name: "description",
        content:
          "Report a civic problem with a description, location and photo evidence, then see how Nivaran understands, groups and routes it.",
      },
      { property: "og:title", content: "Report a Problem — Nivaran" },
      {
        property: "og:description",
        content: "Submit a civic problem with evidence and location, then track it end to end.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { submitComplaint, getComplaint, getCluster } = useNivaran();
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<LocationValue>({
    state: "Uttar Pradesh",
    city: "Noida",
    area: "Sector 15",
    landmark: "near the bus stop",
  });
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const id = submitComplaint({
      category,
      description,
      location: formatLocation(location),
      area: location.area,
      city: location.city,
      image,
    });
    setSubmittedId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const submitted = submittedId ? getComplaint(submittedId) : undefined;
  const cluster = submitted ? getCluster(submitted.clusterId) : undefined;

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        <Card className="p-6 text-center sm:p-8">
          <span className="grid mx-auto size-12 place-items-center rounded-full bg-verified/12 text-verified">
            <span className="block h-2.5 w-5 -translate-y-0.5 rotate-[-45deg] border-b-2 border-l-2 border-current" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-primary">Complaint Submitted</h1>
          <p className="mt-2 font-mono text-3xl font-medium text-accent">{submitted.id}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <StatusBadge status="Open" />
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            Your complaint is on the record. Here is exactly what Nivaran did with it.
          </p>
        </Card>

        <div className="mt-5 space-y-5">
          <AnalysisPanel analysis={submitted.analysis} />

          {cluster ? (
            <CommunityIssuePanel issue={cluster} />
          ) : (
            <div className="panel-deep p-5">
              <SectionLabel>Duplicate Check</SectionLabel>
              <p className="mt-2 text-sm text-secondary/90">
                No other open reports match this issue in {submitted.area}, {submitted.city} yet. If
                more arrive, they will be grouped into a community issue and your report stays
                traceable on its own.
              </p>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <RoutingPanel
              department={submitted.department}
              reason={`Category: ${submitted.analysis.category}`}
            />
            <div className="panel-deep p-5">
              <SectionLabel>Recommended priority</SectionLabel>
              <div className="mt-3">
                <PriorityBadge
                  priority={submitted.priority}
                  factors={submitted.priorityFactors}
                />
              </div>
            </div>
          </div>

          <Card className="p-6 text-center">
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/track" className={buttonVariants.primary}>
                Track this complaint
              </Link>
              <button
                type="button"
                className={buttonVariants.outline}
                onClick={() => {
                  setSubmittedId(null);
                  setDescription("");
                  setImage(null);
                  setFileName("");
                }}
              >
                Report another problem
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold text-primary">Report a Problem</h1>
      <p className="mt-2 max-w-xl text-secondary/85">
        Describe the issue, set a location and attach a photo. Your evidence becomes the first entry
        in a permanent record.
      </p>

      <Card className="mt-8 p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Field label="Issue Category">
            <select
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Description" hint="What is wrong, and how is it affecting people?">
            <textarea
              required
              rows={5}
              className={inputClass}
              placeholder="Garbage has not been collected for several days near the market gate and the smell is spreading."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Field
            label="Location"
            hint="Search, choose a city and area, use your current location or drop a pin. Demo location data."
          >
            <LocationPicker value={location} onChange={setLocation} />
          </Field>

          <div className="rounded-xl bg-soft/50 px-4 py-3 ring-1 ring-inset ring-border">
            <span className="label-caps">Selected location</span>
            <p className="mt-0.5 text-sm font-medium text-primary">{formatLocation(location)}</p>
          </div>

          <Field label="Evidence" hint="Take a photo now or upload one from your device.">
            <EvidenceCapture
              image={image}
              fileName={fileName}
              onImage={(file) => {
                setFileName(file.name);
                setImage(URL.createObjectURL(file));
              }}
              onClear={() => {
                setImage(null);
                setFileName("");
              }}
            />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Personal details are never shown on complaint pages.
            </p>
            <button type="submit" className={buttonVariants.primary}>
              Submit Complaint
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { Card, Field, buttonVariants, inputClass } from "@/components/ui-kit";
import { CATEGORIES, useNivaran } from "@/lib/nivaran-store";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Problem — Nivaran" },
      {
        name: "description",
        content:
          "Report a civic problem with a description, location and photo evidence, and receive a complaint ID you can track.",
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

const SAMPLE_LOCATIONS: string[] = [
  "Sector 15 Road, near the bus stop",
  "Park Avenue, Block 4",
  "Market Street, Gate 2",
  "Colony 9, Lane 3",
];

function ReportPage() {
  const { submitComplaint } = useNivaran();
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(SAMPLE_LOCATIONS[0] ?? "");
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    setImage(URL.createObjectURL(file));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const id = submitComplaint({ category, description, location, image });
    setSubmittedId(id);
  }

  if (submittedId) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
        <Card className="p-8 text-center">
          <span className="grid mx-auto size-12 place-items-center rounded-full bg-verified/12 text-verified">
            <span className="block h-2.5 w-5 -translate-y-0.5 rotate-[-45deg] border-b-2 border-l-2 border-current" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-primary">Complaint Submitted</h1>
          <p className="mt-2 font-mono text-3xl font-medium text-accent">{submittedId}</p>
          <div className="mt-4 flex justify-center">
            <StatusBadge status="Open" />
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            Your complaint is now on the record. You can track every action taken on it, review the
            resolution evidence when it arrives, and challenge it if the issue still exists.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
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
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold text-primary">Report a Problem</h1>
      <p className="mt-2 max-w-xl text-secondary/85">
        Describe the issue, add a location and attach a photo. Your evidence becomes the first entry
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
              placeholder="Large pothole near the bus stop, about 40 cm across, fills with water after rain."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Field label="Location" hint="Demo locations are provided for this prototype.">
            <div className="space-y-2">
              <input
                className={inputClass}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {SAMPLE_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-secondary transition hover:text-accent"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </Field>

          <Field label="Evidence" hint="Attach a photo showing the problem.">
            <div className="rounded-xl border border-dashed border-input bg-soft/50 p-5">
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {image && (
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={image}
                    alt="Selected evidence preview"
                    className="size-16 rounded-lg object-cover ring-1 ring-border"
                  />
                  <span className="text-sm text-muted-foreground">{fileName}</span>
                </div>
              )}
            </div>
          </Field>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
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

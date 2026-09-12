import { createFileRoute, Link } from "@tanstack/react-router";
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
import { CHALLENGE_REASONS, useNivaran } from "@/lib/nivaran-store";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Resolution Verification — Nivaran" },
      {
        name: "description",
        content:
          "Compare original and resolution evidence side by side, then verify the fix or challenge it to reopen the complaint.",
      },
      { property: "og:title", content: "Resolution Verification — Nivaran" },
      {
        property: "og:description",
        content: "Proof before resolved: review the evidence, verify the fix, or challenge it.",
      },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { activeId, getComplaint, verifyResolution, challengeResolution } = useNivaran();
  const complaint = getComplaint(activeId);

  const [showChallenge, setShowChallenge] = useState(false);
  const [reason, setReason] = useState<string>(CHALLENGE_REASONS[0]);
  const [explanation, setExplanation] = useState("");
  const [challengeImage, setChallengeImage] = useState<string | null>(null);

  if (!complaint) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <Card className="p-8 text-center">
          <h1 className="font-display text-xl font-bold text-primary">No complaint selected</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a complaint on the tracking page first.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/track" className={buttonVariants.primary}>
              Go to Track Complaint
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const resolution = complaint.resolution;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-sm text-muted-foreground">{complaint.id}</span>
        <StatusBadge status={complaint.status} />
      </div>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-primary sm:text-4xl">
        Proof before "Resolved"
      </h1>
      <p className="mt-3 max-w-2xl text-secondary/85">
        An authority cannot close this complaint on its own. Compare the original record with the
        resolution evidence and decide whether the issue is genuinely fixed.
      </p>

      {!resolution ? (
        <Card className="mt-8 p-8">
          <h2 className="font-display text-lg font-bold text-primary">
            No resolution evidence yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This complaint is still with the authority. You'll be able to review before-and-after
            evidence once proof is submitted.
          </p>
        </Card>
      ) : (
        <>
          <Card className="mt-8 p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionLabel>Evidence Comparison</SectionLabel>
              <span className="font-mono text-xs text-muted-foreground">before / after</span>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <figure>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-lg bg-soft px-2.5 py-1 text-xs font-semibold tracking-wide text-secondary uppercase">
                    Original Evidence
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {complaint.reportedAt}
                  </span>
                </div>
                <EvidenceFrame
                  src={complaint.image}
                  alt={`Original evidence for ${complaint.id}`}
                  emptyLabel="No original photo on record"
                />
                <figcaption className="mt-2 text-sm text-muted-foreground">
                  {complaint.location} — as reported
                </figcaption>
              </figure>

              <figure>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-lg bg-accent/12 px-2.5 py-1 text-xs font-semibold tracking-wide text-accent uppercase ring-1 ring-inset ring-accent/25">
                    Resolution Evidence
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {resolution.timestamp}
                  </span>
                </div>
                <EvidenceFrame
                  src={resolution.image}
                  alt={`Resolution evidence for ${complaint.id}`}
                  emptyLabel="No resolution photo submitted"
                />
                <figcaption className="mt-2 text-sm text-muted-foreground">
                  {resolution.location} — after the reported fix
                </figcaption>
              </figure>
            </div>

            <div className="mt-7">
              <MetaGrid
                items={[
                  { label: "Resolution", value: resolution.description },
                  { label: "Resolution Location", value: resolution.location },
                  { label: "Resolution Timestamp", value: resolution.timestamp },
                ]}
              />
            </div>

            {complaint.status === "Resolved" ? (
              <div className="mt-7 rounded-xl bg-verified/8 p-5 ring-1 ring-inset ring-verified/25">
                <h2 className="font-display text-lg font-bold text-verified">
                  Resolved through citizen verification
                </h2>
                <p className="mt-1.5 text-sm text-secondary/85">
                  You confirmed the issue is fixed. The full evidence trail stays on the record.
                </p>
              </div>
            ) : complaint.status === "Reopened" ? (
              <div className="mt-7 rounded-xl bg-challenged/8 p-5 ring-1 ring-inset ring-challenged/25">
                <h2 className="font-display text-lg font-bold text-challenged">
                  Resolution Challenged · Complaint Reopened
                </h2>
                <p className="mt-1.5 text-sm text-secondary/85">
                  {complaint.challenge?.reason}
                  {complaint.challenge?.explanation ? ` — ${complaint.challenge.explanation}` : ""}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  The original resolution evidence above is preserved and remains visible.
                </p>
                {complaint.challenge?.image && (
                  <img
                    src={complaint.challenge.image}
                    alt="Citizen challenge evidence"
                    className="mt-4 size-24 rounded-lg object-cover ring-1 ring-border"
                  />
                )}
              </div>
            ) : (
              <div className="mt-7 border-t border-border pt-6">
                <h2 className="font-display text-lg font-bold text-primary">
                  Is the issue actually fixed?
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={buttonVariants.verified}
                    onClick={() => {
                      setShowChallenge(false);
                      verifyResolution(complaint.id);
                    }}
                  >
                    Yes, it's fixed
                  </button>
                  <button
                    type="button"
                    className={buttonVariants.challenged}
                    onClick={() => setShowChallenge(true)}
                  >
                    No, it's still there
                  </button>
                </div>
              </div>
            )}
          </Card>

          {showChallenge && complaint.status === "Awaiting Citizen Verification" && (
            <Card className="mt-5 p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold text-challenged">Challenge Resolution</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Why are you challenging this resolution?
              </p>

              <form
                className="mt-6 space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  challengeResolution(complaint.id, {
                    reason,
                    explanation,
                    image: challengeImage,
                  });
                  setShowChallenge(false);
                }}
              >
                <fieldset className="space-y-2">
                  {CHALLENGE_REASONS.map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                        reason === option
                          ? "border-challenged/40 bg-challenged/8 text-primary"
                          : "border-border bg-soft/40 text-secondary hover:border-input"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        className="accent-current"
                        checked={reason === option}
                        onChange={() => setReason(option)}
                      />
                      {option}
                    </label>
                  ))}
                </fieldset>

                <Field label="Explanation" hint="Add any detail that helps the authority understand.">
                  <textarea
                    rows={4}
                    className={inputClass}
                    placeholder="The patch covers a different stretch of road; the pothole near the bus stop is unchanged."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                  />
                </Field>

                <Field label="Supporting Evidence" hint="Optional photo showing the current state.">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setChallengeImage(URL.createObjectURL(file));
                    }}
                  />
                </Field>

                <button type="submit" className={buttonVariants.primary}>
                  Submit Challenge
                </button>
              </form>
            </Card>
          )}

          <Card className="mt-5 p-6 sm:p-8">
            <SectionLabel>Complaint Timeline</SectionLabel>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              Your response is added as a new event. Nothing before it is removed.
            </p>
            <Timeline events={complaint.events} />
          </Card>
        </>
      )}
    </div>
  );
}

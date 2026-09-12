import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import evidenceBefore from "@/assets/evidence-before.jpg";
import evidenceAfter from "@/assets/evidence-after.jpg";

export type ComplaintStatus = "Open" | "Awaiting Citizen Verification" | "Resolved" | "Reopened";

export type TimelineEvent = {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
  tone: "neutral" | "accent" | "awaiting" | "verified" | "challenged";
};

export type Resolution = {
  description: string;
  location: string;
  timestamp: string;
  image: string | null;
};

export type Challenge = {
  reason: string;
  explanation: string;
  image: string | null;
  timestamp: string;
};

export type Complaint = {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  reportedAt: string;
  status: ComplaintStatus;
  image: string | null;
  events: TimelineEvent[];
  resolution: Resolution | null;
  challenge: Challenge | null;
};

export const CATEGORIES = [
  "Pothole",
  "Garbage",
  "Streetlight",
  "Water",
  "Road Damage",
  "Other",
] as const;

export const CHALLENGE_REASONS = [
  "The issue still exists",
  "The evidence does not match the location",
  "The evidence appears outdated",
  "The issue was only partially fixed",
  "Other",
] as const;

let eventSeq = 0;
const nextId = () => `ev-${++eventSeq}`;

function nowLabel() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

const demoComplaint: Complaint = {
  id: "NIV-1047",
  category: "Pothole",
  title: "Large pothole on Sector 15 road",
  description:
    "Large pothole on the Sector 15 road near the bus stop, roughly 40 cm across. Water pools in it after rain and two vehicles have already been damaged.",
  location: "Sector 15 Road, near the bus stop",
  reportedAt: "12 Sept · 10:32 AM",
  status: "Awaiting Citizen Verification",
  image: evidenceBefore,
  resolution: {
    description: "Pothole backfilled and resurfaced with hot-mix asphalt. Lane reopened to traffic.",
    location: "Sector 15 Road, near the bus stop",
    timestamp: "15 Sept · 04:20 PM",
    image: evidenceAfter,
  },
  challenge: null,
  events: [
    {
      id: nextId(),
      label: "Complaint Submitted",
      detail: "Large pothole on Sector 15 road reported by a citizen.",
      timestamp: "12 Sept · 10:32 AM",
      tone: "neutral",
    },
    {
      id: nextId(),
      label: "Evidence Added",
      detail: "Photograph of the pothole attached to the record.",
      timestamp: "12 Sept · 10:32 AM",
      tone: "neutral",
    },
    {
      id: nextId(),
      label: "Assigned to Authority",
      detail: "Routed to Roads & Streets Maintenance.",
      timestamp: "13 Sept · 09:15 AM",
      tone: "accent",
    },
    {
      id: nextId(),
      label: "Resolution Evidence Submitted",
      detail: "After photo, resolution location and timestamp submitted for review.",
      timestamp: "15 Sept · 04:20 PM",
      tone: "accent",
    },
    {
      id: nextId(),
      label: "Awaiting Citizen Verification",
      detail: "The complaint stays open until the citizen reviews the evidence.",
      timestamp: "15 Sept · 04:21 PM",
      tone: "awaiting",
    },
  ],
};

const otherComplaints: Complaint[] = [
  {
    id: "NIV-1052",
    category: "Streetlight",
    title: "Streetlight out on Park Avenue",
    description: "Three consecutive streetlights have been dark for over a week, making the footpath unsafe at night.",
    location: "Park Avenue, Block 4",
    reportedAt: "14 Sept · 07:48 PM",
    status: "Open",
    image: null,
    resolution: null,
    challenge: null,
    events: [
      {
        id: nextId(),
        label: "Complaint Submitted",
        detail: "Streetlight outage reported by a citizen.",
        timestamp: "14 Sept · 07:48 PM",
        tone: "neutral",
      },
      {
        id: nextId(),
        label: "Assigned to Authority",
        detail: "Routed to Street Lighting.",
        timestamp: "15 Sept · 10:05 AM",
        tone: "accent",
      },
    ],
  },
  {
    id: "NIV-1061",
    category: "Garbage",
    title: "Uncollected garbage pile at Market Street",
    description: "Waste has not been collected from the Gate 2 bins for four days.",
    location: "Market Street, Gate 2",
    reportedAt: "15 Sept · 08:10 AM",
    status: "Open",
    image: null,
    resolution: null,
    challenge: null,
    events: [
      {
        id: nextId(),
        label: "Complaint Submitted",
        detail: "Garbage pile reported by a citizen.",
        timestamp: "15 Sept · 08:10 AM",
        tone: "neutral",
      },
    ],
  },
  {
    id: "NIV-1039",
    category: "Water",
    title: "Water leak in Colony 9",
    description: "Continuous leak from a supply line flooding the lane entrance.",
    location: "Colony 9, Lane 3",
    reportedAt: "09 Sept · 11:20 AM",
    status: "Resolved",
    image: null,
    resolution: {
      description: "Supply line joint replaced and lane cleared.",
      location: "Colony 9, Lane 3",
      timestamp: "11 Sept · 02:05 PM",
      image: null,
    },
    challenge: null,
    events: [
      {
        id: nextId(),
        label: "Complaint Submitted",
        detail: "Water leak reported by a citizen.",
        timestamp: "09 Sept · 11:20 AM",
        tone: "neutral",
      },
      {
        id: nextId(),
        label: "Resolution Evidence Submitted",
        detail: "Repair photo and location submitted for review.",
        timestamp: "11 Sept · 02:05 PM",
        tone: "accent",
      },
      {
        id: nextId(),
        label: "Citizen Verified Resolution",
        detail: "Citizen confirmed the leak was fixed.",
        timestamp: "11 Sept · 06:40 PM",
        tone: "verified",
      },
    ],
  },
];

type NewComplaintInput = {
  category: string;
  description: string;
  location: string;
  image: string | null;
};

type ResolutionInput = Resolution;

type ChallengeInput = {
  reason: string;
  explanation: string;
  image: string | null;
};

type StoreValue = {
  complaints: Complaint[];
  activeId: string;
  setActiveId: (id: string) => void;
  getComplaint: (id: string) => Complaint | undefined;
  submitComplaint: (input: NewComplaintInput) => string;
  submitResolution: (id: string, input: ResolutionInput) => void;
  verifyResolution: (id: string) => void;
  challengeResolution: (id: string, input: ChallengeInput) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function NivaranProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([demoComplaint, ...otherComplaints]);
  const [activeId, setActiveId] = useState("NIV-1047");
  const [nextNumber, setNextNumber] = useState(1063);

  const patch = useCallback((id: string, fn: (c: Complaint) => Complaint) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
  }, []);

  const submitComplaint = useCallback(
    (input: NewComplaintInput) => {
      const id = `NIV-${nextNumber}`;
      const stamp = nowLabel();
      const complaint: Complaint = {
        id,
        category: input.category,
        title: input.description.split("\n")[0]?.slice(0, 70) || `${input.category} reported`,
        description: input.description,
        location: input.location,
        reportedAt: stamp,
        status: "Open",
        image: input.image,
        resolution: null,
        challenge: null,
        events: [
          {
            id: nextId(),
            label: "Complaint Submitted",
            detail: `${input.category} reported at ${input.location}.`,
            timestamp: stamp,
            tone: "neutral",
          },
          ...(input.image
            ? [
                {
                  id: nextId(),
                  label: "Evidence Added",
                  detail: "Photograph attached to the record.",
                  timestamp: stamp,
                  tone: "neutral" as const,
                },
              ]
            : []),
        ],
      };
      setComplaints((prev) => [complaint, ...prev]);
      setNextNumber((n) => n + 1);
      setActiveId(id);
      return id;
    },
    [nextNumber],
  );

  const submitResolution = useCallback(
    (id: string, input: ResolutionInput) => {
      patch(id, (c) => ({
        ...c,
        status: "Awaiting Citizen Verification",
        resolution: input,
        events: [
          ...c.events,
          {
            id: nextId(),
            label: "Resolution Evidence Submitted",
            detail: input.description,
            timestamp: input.timestamp,
            tone: "accent",
          },
          {
            id: nextId(),
            label: "Verification Requested",
            detail: "Sent to the citizen for review. Nothing is resolved until they respond.",
            timestamp: input.timestamp,
            tone: "awaiting",
          },
        ],
      }));
    },
    [patch],
  );

  const verifyResolution = useCallback(
    (id: string) => {
      const stamp = nowLabel();
      patch(id, (c) => ({
        ...c,
        status: "Resolved",
        events: [
          ...c.events,
          {
            id: nextId(),
            label: "Citizen Verified Resolution",
            detail: "The citizen reviewed the resolution evidence and confirmed the issue is fixed.",
            timestamp: stamp,
            tone: "verified",
          },
          {
            id: nextId(),
            label: "Complaint Resolved",
            detail: "Closed through citizen verification, not by an authority declaration.",
            timestamp: stamp,
            tone: "verified",
          },
        ],
      }));
    },
    [patch],
  );

  const challengeResolution = useCallback(
    (id: string, input: ChallengeInput) => {
      const stamp = nowLabel();
      patch(id, (c) => ({
        ...c,
        status: "Reopened",
        challenge: { ...input, timestamp: stamp },
        events: [
          ...c.events,
          {
            id: nextId(),
            label: "Resolution Challenged — Complaint Reopened",
            detail: `${input.reason}${input.explanation ? ` — ${input.explanation}` : ""}`,
            timestamp: stamp,
            tone: "challenged",
          },
        ],
      }));
    },
    [patch],
  );

  const value = useMemo<StoreValue>(
    () => ({
      complaints,
      activeId,
      setActiveId,
      getComplaint: (id: string) => complaints.find((c) => c.id.toLowerCase() === id.trim().toLowerCase()),
      submitComplaint,
      submitResolution,
      verifyResolution,
      challengeResolution,
    }),
    [complaints, activeId, submitComplaint, submitResolution, verifyResolution, challengeResolution],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useNivaran() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useNivaran must be used inside NivaranProvider");
  return ctx;
}

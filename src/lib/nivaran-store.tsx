import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import evidenceBefore from "@/assets/evidence-before.jpg";
import evidenceAfter from "@/assets/evidence-after.jpg";
import {
  analyseComplaint,
  assessPriority,
  issueLabel,
  routeDepartment,
  type Analysis,
  type Department,
  type Priority,
} from "@/lib/nivaran-intelligence";

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
  area: string;
  city: string;
  reportedAt: string;
  status: ComplaintStatus;
  image: string | null;
  events: TimelineEvent[];
  resolution: Resolution | null;
  challenge: Challenge | null;
  analysis: Analysis;
  priority: Priority;
  priorityFactors: string[];
  department: Department;
  clusterId: string | null;
  relatedReports: number;
};

export type RelatedReport = {
  id: string;
  snippet: string;
  reportedAt: string;
};

export type CommunityIssue = {
  id: string;
  title: string;
  category: string;
  area: string;
  city: string;
  reportCount: number;
  daysActive: number;
  populationAffected: "High" | "Medium" | "Low";
  risk: string;
  priority: Priority;
  priorityFactors: string[];
  department: Department;
  status: "Active" | "In Progress" | "Resolved";
  reportIds: string[];
  relatedReports: RelatedReport[];
  /* position on the Civic Pulse visualisation, in percent */
  pulse: { x: number; y: number };
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

export type Role = "citizen" | "authority";

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

/* ---------- demo community clusters ---------- */

const GARBAGE_SNIPPETS = [
  "Bins near the market gate have not been emptied for days.",
  "Waste is spilling onto the footpath outside the school.",
  "Strong smell from the garbage pile at the corner.",
  "Stray animals scattering rubbish across the lane.",
  "Garbage truck has not come this week at all.",
  "Overflowing bin beside the bus stop.",
  "Wet waste collecting water and mosquitoes.",
  "Rubbish blocking half the service road.",
  "Collection skipped again in our block.",
  "Pile has grown to the height of the wall.",
  "Children walk past the waste heap every morning.",
  "Sweepers came but nothing was taken away.",
  "Bad smell reaching the first-floor flats.",
  "Waste dumped outside the community park.",
  "Same problem as last month, still unresolved.",
  "Bins broken and waste lying loose.",
  "Please send a collection vehicle urgently.",
];

function makeRelatedReports(prefix: string, snippets: string[], startDay: number): RelatedReport[] {
  return snippets.map((snippet, i) => ({
    id: `${prefix}-${String(i + 1).padStart(2, "0")}`,
    snippet,
    reportedAt: `${startDay + Math.floor(i / 2)} Sept · ${8 + (i % 9)}:${String((i * 7) % 60).padStart(2, "0")} AM`,
  }));
}

const garbageReports = makeRelatedReports("NIV-9", GARBAGE_SNIPPETS, 6);

const streetlightReports = makeRelatedReports(
  "NIV-8",
  [
    "Three lights out on the main stretch.",
    "Footpath completely dark after 7 pm.",
    "Lights flicker and then go off.",
    "Dark corner feels unsafe for women walking home.",
    "Pole light out since last week.",
    "No lighting near the crossing.",
    "Reported earlier, still dark.",
    "Whole lane unlit at night.",
  ],
  8,
);

const resolvedReports = makeRelatedReports(
  "NIV-7",
  [
    "Waste piling near the temple lane.",
    "Bin not emptied for two days.",
    "Litter across the parking area.",
    "Rubbish near the shop row.",
  ],
  4,
);

const garbageCluster: CommunityIssue = {
  id: "CI-01",
  title: "Garbage Collection Problem — Sector 15",
  category: "Garbage",
  area: "Sector 15",
  city: "Noida",
  reportCount: garbageReports.length,
  daysActive: 9,
  populationAffected: "High",
  risk: "Health risk",
  priority: "Critical",
  priorityFactors: [
    "17 related reports",
    "High population density",
    "Health-related risk",
    "9 days unresolved",
    "Reports increasing",
  ],
  department: "Sanitation Department",
  status: "Active",
  reportIds: garbageReports.map((r) => r.id),
  relatedReports: garbageReports,
  pulse: { x: 30, y: 34 },
};

const streetlightCluster: CommunityIssue = {
  id: "CI-02",
  title: "Streetlight Outage — Sector 18",
  category: "Streetlight",
  area: "Sector 18",
  city: "Noida",
  reportCount: streetlightReports.length,
  daysActive: 5,
  populationAffected: "Medium",
  risk: "Safety risk after dark",
  priority: "High",
  priorityFactors: [
    "8 related reports",
    "Medium population density",
    "Safety-related risk",
    "5 days unresolved",
  ],
  department: "Electrical Department",
  status: "In Progress",
  reportIds: streetlightReports.map((r) => r.id),
  relatedReports: streetlightReports,
  pulse: { x: 63, y: 25 },
};

const resolvedCluster: CommunityIssue = {
  id: "CI-03",
  title: "Waste Overflow — Sector 12",
  category: "Garbage",
  area: "Sector 12",
  city: "Noida",
  reportCount: resolvedReports.length,
  daysActive: 0,
  populationAffected: "Low",
  risk: "Cleared after citizen verification",
  priority: "Low",
  priorityFactors: [
    "4 related reports",
    "Low population density",
    "Verified as fixed by citizens",
  ],
  department: "Sanitation Department",
  status: "Resolved",
  reportIds: resolvedReports.map((r) => r.id),
  relatedReports: resolvedReports,
  pulse: { x: 46, y: 66 },
};

const initialClusters = [garbageCluster, streetlightCluster, resolvedCluster];

/* ---------- demo complaints ---------- */

const demoComplaint: Complaint = {
  id: "NIV-1047",
  category: "Pothole",
  title: "Large pothole on Sector 15 road",
  description:
    "Large pothole on the Sector 15 road near the bus stop, roughly 40 cm across. Water pools in it after rain and two vehicles have already been damaged.",
  location: "Sector 15, Noida, Uttar Pradesh (near the bus stop)",
  area: "Sector 15",
  city: "Noida",
  reportedAt: "12 Sept · 10:32 AM",
  status: "Awaiting Citizen Verification",
  image: evidenceBefore,
  analysis: {
    issue: "Large pothole on the Sector 15 road near the bus stop",
    category: "Road Surface Damage",
    location: "Sector 15, Noida",
    urgency: "High",
    evidence: "Photo uploaded",
  },
  priority: "High",
  priorityFactors: [
    "3 related reports",
    "High population density",
    "Safety-related risk",
    "3 days unresolved",
    "Reported urgency: High",
  ],
  department: "Roads / Public Works Department",
  clusterId: null,
  relatedReports: 3,
  resolution: {
    description: "Pothole backfilled and resurfaced with hot-mix asphalt. Lane reopened to traffic.",
    location: "Sector 15, Noida (near the bus stop)",
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
      label: "Complaint Understood",
      detail: "Read as Road Surface Damage in Sector 15, Noida with high urgency.",
      timestamp: "12 Sept · 10:33 AM",
      tone: "accent",
    },
    {
      id: nextId(),
      label: "Priority Recommended — High",
      detail: "3 related reports, safety risk and high urgency.",
      timestamp: "12 Sept · 10:33 AM",
      tone: "accent",
    },
    {
      id: nextId(),
      label: "Routed to Roads / Public Works Department",
      detail: "Reason — Category: Road Surface Damage.",
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
    category: "Garbage",
    title: "Garbage not collected near Sector 15 market",
    description:
      "Garbage has not been collected for several days near the Sector 15 market gate. The pile is spreading onto the footpath and the smell is very strong.",
    location: "Sector 15, Noida, Uttar Pradesh (market gate)",
    area: "Sector 15",
    city: "Noida",
    reportedAt: "14 Sept · 07:48 PM",
    status: "Open",
    image: null,
    analysis: {
      issue: "Garbage has not been collected for several days",
      category: "Garbage Collection",
      location: "Sector 15, Noida",
      urgency: "High",
      evidence: "No photo attached",
    },
    priority: "Critical",
    priorityFactors: garbageCluster.priorityFactors,
    department: "Sanitation Department",
    clusterId: "CI-01",
    relatedReports: garbageCluster.reportCount,
    resolution: null,
    challenge: null,
    events: [
      {
        id: nextId(),
        label: "Complaint Submitted",
        detail: "Garbage collection issue reported by a citizen.",
        timestamp: "14 Sept · 07:48 PM",
        tone: "neutral",
      },
      {
        id: nextId(),
        label: "Duplicate Reports Detected",
        detail: "17 reports from Sector 15 describe essentially the same problem.",
        timestamp: "14 Sept · 07:49 PM",
        tone: "accent",
      },
      {
        id: nextId(),
        label: "Added to Community Issue CI-01",
        detail: "Grouped as Garbage Collection Problem — Sector 15. Individual reports kept intact.",
        timestamp: "14 Sept · 07:49 PM",
        tone: "accent",
      },
      {
        id: nextId(),
        label: "Priority Recommended — Critical",
        detail: "17 related reports, high population density, health risk, 9 days unresolved.",
        timestamp: "14 Sept · 07:49 PM",
        tone: "challenged",
      },
      {
        id: nextId(),
        label: "Routed to Sanitation Department",
        detail: "Reason — Category: Garbage Collection.",
        timestamp: "15 Sept · 10:05 AM",
        tone: "accent",
      },
    ],
  },
  {
    id: "NIV-1061",
    category: "Streetlight",
    title: "Streetlights out along Sector 18 main road",
    description:
      "Three consecutive streetlights have been dark for over a week, making the footpath unsafe at night.",
    location: "Sector 18, Noida, Uttar Pradesh (main road)",
    area: "Sector 18",
    city: "Noida",
    reportedAt: "15 Sept · 08:10 AM",
    status: "Open",
    image: null,
    analysis: {
      issue: "Three consecutive streetlights have been dark for over a week",
      category: "Streetlight Outage",
      location: "Sector 18, Noida",
      urgency: "High",
      evidence: "No photo attached",
    },
    priority: "High",
    priorityFactors: streetlightCluster.priorityFactors,
    department: "Electrical Department",
    clusterId: "CI-02",
    relatedReports: streetlightCluster.reportCount,
    resolution: null,
    challenge: null,
    events: [
      {
        id: nextId(),
        label: "Complaint Submitted",
        detail: "Streetlight outage reported by a citizen.",
        timestamp: "15 Sept · 08:10 AM",
        tone: "neutral",
      },
      {
        id: nextId(),
        label: "Added to Community Issue CI-02",
        detail: "Grouped with 7 other reports from Sector 18.",
        timestamp: "15 Sept · 08:11 AM",
        tone: "accent",
      },
      {
        id: nextId(),
        label: "Routed to Electrical Department",
        detail: "Reason — Category: Streetlight Outage.",
        timestamp: "15 Sept · 09:40 AM",
        tone: "accent",
      },
    ],
  },
  {
    id: "NIV-1039",
    category: "Water",
    title: "Water leak in Gomti Nagar",
    description: "Continuous leak from a supply line flooding the lane entrance.",
    location: "Gomti Nagar, Lucknow, Uttar Pradesh (Lane 3)",
    area: "Gomti Nagar",
    city: "Lucknow",
    reportedAt: "09 Sept · 11:20 AM",
    status: "Resolved",
    image: null,
    analysis: {
      issue: "Continuous leak from a supply line flooding the lane entrance",
      category: "Water Leakage",
      location: "Gomti Nagar, Lucknow",
      urgency: "Medium",
      evidence: "No photo attached",
    },
    priority: "Medium",
    priorityFactors: [
      "2 related reports",
      "Medium population density",
      "Health-related risk",
      "Reported urgency: Medium",
    ],
    department: "Water Department",
    clusterId: null,
    relatedReports: 2,
    resolution: {
      description: "Supply line joint replaced and lane cleared.",
      location: "Gomti Nagar, Lucknow (Lane 3)",
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
        label: "Routed to Water Department",
        detail: "Reason — Category: Water Leakage.",
        timestamp: "09 Sept · 12:02 PM",
        tone: "accent",
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
  area: string;
  city: string;
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
  communityIssues: CommunityIssue[];
  activeId: string;
  role: Role | null;
  setRole: (role: Role) => void;
  setActiveId: (id: string) => void;
  getComplaint: (id: string) => Complaint | undefined;
  getCluster: (id: string | null) => CommunityIssue | undefined;
  submitComplaint: (input: NewComplaintInput) => string;
  submitResolution: (id: string, input: ResolutionInput) => void;
  verifyResolution: (id: string) => void;
  challengeResolution: (id: string, input: ChallengeInput) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function NivaranProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([demoComplaint, ...otherComplaints]);
  const [communityIssues, setCommunityIssues] = useState<CommunityIssue[]>(initialClusters);
  const [activeId, setActiveId] = useState("NIV-1047");
  const [nextNumber, setNextNumber] = useState(1063);
  const [role, setRole] = useState<Role | null>(null);

  const patch = useCallback((id: string, fn: (c: Complaint) => Complaint) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
  }, []);

  const submitComplaint = useCallback(
    (input: NewComplaintInput) => {
      const id = `NIV-${nextNumber}`;
      const stamp = nowLabel();

      const analysis = analyseComplaint({
        description: input.description,
        category: input.category,
        location: `${input.area}, ${input.city}`,
        hasImage: Boolean(input.image),
      });

      /* rule-based duplicate detection: same category, same area */
      const cluster = initialClusters.find(
        (ci) =>
          ci.category === input.category &&
          ci.area.toLowerCase() === input.area.trim().toLowerCase(),
      );

      const relatedReports = cluster ? cluster.reportCount + 1 : 1;
      const daysUnresolved = cluster ? cluster.daysActive : 0;

      const { priority, factors } = assessPriority({
        category: input.category,
        relatedReports,
        daysUnresolved,
        urgency: analysis.urgency,
        populationDensity: cluster ? cluster.populationAffected : "Medium",
        reportsIncreasing: Boolean(cluster),
      });

      const department = routeDepartment(input.category);

      const events: TimelineEvent[] = [
        {
          id: nextId(),
          label: "Complaint Submitted",
          detail: `${issueLabel(input.category)} reported at ${input.location}.`,
          timestamp: stamp,
          tone: "neutral",
        },
      ];

      if (input.image) {
        events.push({
          id: nextId(),
          label: "Evidence Added",
          detail: "Photograph attached to the record.",
          timestamp: stamp,
          tone: "neutral",
        });
      }

      events.push({
        id: nextId(),
        label: "Complaint Understood",
        detail: `Read as ${analysis.category} in ${analysis.location} with ${analysis.urgency.toLowerCase()} urgency.`,
        timestamp: stamp,
        tone: "accent",
      });

      if (cluster) {
        events.push(
          {
            id: nextId(),
            label: "Duplicate Reports Detected",
            detail: `${cluster.reportCount} earlier reports from ${cluster.area} describe essentially the same problem.`,
            timestamp: stamp,
            tone: "accent",
          },
          {
            id: nextId(),
            label: `Added to Community Issue ${cluster.id}`,
            detail: `Grouped as ${cluster.title}. Your individual report stays on the record.`,
            timestamp: stamp,
            tone: "accent",
          },
        );
      }

      events.push(
        {
          id: nextId(),
          label: `Priority Recommended — ${priority}`,
          detail: factors.join(" · "),
          timestamp: stamp,
          tone: priority === "Critical" ? "challenged" : "accent",
        },
        {
          id: nextId(),
          label: `Routed to ${department}`,
          detail: `Reason — Category: ${analysis.category}.`,
          timestamp: stamp,
          tone: "accent",
        },
      );

      const complaint: Complaint = {
        id,
        category: input.category,
        title: input.description.split("\n")[0]?.slice(0, 70) || `${input.category} reported`,
        description: input.description,
        location: input.location,
        area: input.area,
        city: input.city,
        reportedAt: stamp,
        status: "Open",
        image: input.image,
        analysis,
        priority,
        priorityFactors: factors,
        department,
        clusterId: cluster?.id ?? null,
        relatedReports,
        resolution: null,
        challenge: null,
        events,
      };

      setComplaints((prev) => [complaint, ...prev]);

      if (cluster) {
        setCommunityIssues((prev) =>
          prev.map((ci) =>
            ci.id === cluster.id
              ? {
                  ...ci,
                  reportCount: ci.reportCount + 1,
                  reportIds: [...ci.reportIds, id],
                  relatedReports: [
                    ...ci.relatedReports,
                    { id, snippet: input.description.slice(0, 90), reportedAt: stamp },
                  ],
                }
              : ci,
          ),
        );
      }

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
      communityIssues,
      activeId,
      role,
      setRole,
      setActiveId,
      getComplaint: (id: string) =>
        complaints.find((c) => c.id.toLowerCase() === id.trim().toLowerCase()),
      getCluster: (id: string | null) =>
        id ? communityIssues.find((ci) => ci.id === id) : undefined,
      submitComplaint,
      submitResolution,
      verifyResolution,
      challengeResolution,
    }),
    [
      complaints,
      communityIssues,
      activeId,
      role,
      submitComplaint,
      submitResolution,
      verifyResolution,
      challengeResolution,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useNivaran() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useNivaran must be used inside NivaranProvider");
  return ctx;
}

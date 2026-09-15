/**
 * Rule-based prototype intelligence. No AI model, no backend — plain
 * deterministic rules over the demo data so every decision stays explainable.
 */

export type Priority = "Critical" | "High" | "Medium" | "Low";

export const PRIORITY_DOT: Record<Priority, string> = {
  Critical: "🔴",
  High: "🟠",
  Medium: "🟡",
  Low: "🟢",
};

export const PRIORITY_TONE: Record<Priority, { text: string; bg: string; ring: string }> = {
  Critical: { text: "text-critical", bg: "bg-critical/12", ring: "ring-critical/40" },
  High: { text: "text-high", bg: "bg-high/12", ring: "ring-high/40" },
  Medium: { text: "text-medium", bg: "bg-medium/12", ring: "ring-medium/40" },
  Low: { text: "text-low", bg: "bg-low/12", ring: "ring-low/40" },
};

export type Department =
  | "Sanitation Department"
  | "Electrical Department"
  | "Water Department"
  | "Roads / Public Works Department"
  | "General Civic Services";

const DEPARTMENT_BY_CATEGORY: Record<string, Department> = {
  Garbage: "Sanitation Department",
  "Garbage Collection": "Sanitation Department",
  Streetlight: "Electrical Department",
  Water: "Water Department",
  "Water Leakage": "Water Department",
  Pothole: "Roads / Public Works Department",
  "Road Damage": "Roads / Public Works Department",
};

export function routeDepartment(category: string): Department {
  return DEPARTMENT_BY_CATEGORY[category] ?? "General Civic Services";
}

/** Normalised issue label shown in the complaint analysis. */
const ISSUE_LABEL: Record<string, string> = {
  Garbage: "Garbage Collection",
  Streetlight: "Streetlight Outage",
  Water: "Water Leakage",
  Pothole: "Road Surface Damage",
  "Road Damage": "Road Surface Damage",
};

export function issueLabel(category: string) {
  return ISSUE_LABEL[category] ?? category;
}

const HEALTH_RISK_CATEGORIES = ["Garbage", "Water"];
const SAFETY_RISK_CATEGORIES = ["Pothole", "Road Damage", "Streetlight"];

const URGENT_WORDS = [
  "days",
  "week",
  "overflow",
  "sewage",
  "flood",
  "accident",
  "injur",
  "child",
  "hospital",
  "dark",
  "unsafe",
  "danger",
  "smell",
  "disease",
  "mosquito",
];

export type Urgency = "High" | "Medium" | "Low";

export function detectUrgency(description: string, category: string): Urgency {
  const text = description.toLowerCase();
  const hits = URGENT_WORDS.filter((w) => text.includes(w)).length;
  const riskyCategory =
    HEALTH_RISK_CATEGORIES.includes(category) || SAFETY_RISK_CATEGORIES.includes(category);
  if (hits >= 2 || (hits >= 1 && riskyCategory)) return "High";
  if (hits >= 1 || riskyCategory) return "Medium";
  return "Low";
}

export type Analysis = {
  issue: string;
  category: string;
  location: string;
  urgency: Urgency;
  evidence: string;
};

export function analyseComplaint(input: {
  description: string;
  category: string;
  location: string;
  hasImage: boolean;
}): Analysis {
  return {
    issue: input.description.trim().split(/[.\n]/)[0]?.slice(0, 90) || issueLabel(input.category),
    category: issueLabel(input.category),
    location: input.location,
    urgency: detectUrgency(input.description, input.category),
    evidence: input.hasImage ? "Photo uploaded" : "No photo attached",
  };
}

export type PriorityAssessment = {
  priority: Priority;
  factors: string[];
};

export function assessPriority(input: {
  category: string;
  relatedReports: number;
  daysUnresolved: number;
  urgency: Urgency;
  populationDensity?: "High" | "Medium" | "Low";
  reportsIncreasing?: boolean;
}): PriorityAssessment {
  const factors: string[] = [];
  let score = 0;

  if (input.relatedReports > 1) {
    factors.push(`${input.relatedReports} related reports`);
    score += input.relatedReports >= 10 ? 3 : input.relatedReports >= 4 ? 2 : 1;
  } else {
    factors.push("Single report so far");
  }

  const density = input.populationDensity ?? "Medium";
  factors.push(`${density} population density`);
  score += density === "High" ? 2 : density === "Medium" ? 1 : 0;

  if (HEALTH_RISK_CATEGORIES.includes(input.category)) {
    factors.push("Health-related risk");
    score += 2;
  } else if (SAFETY_RISK_CATEGORIES.includes(input.category)) {
    factors.push("Safety-related risk");
    score += 1;
  }

  if (input.daysUnresolved > 0) {
    factors.push(`${input.daysUnresolved} days unresolved`);
    score += input.daysUnresolved >= 7 ? 2 : input.daysUnresolved >= 3 ? 1 : 0;
  }

  factors.push(`Reported urgency: ${input.urgency}`);
  score += input.urgency === "High" ? 2 : input.urgency === "Medium" ? 1 : 0;

  if (input.reportsIncreasing) {
    factors.push("Reports increasing");
    score += 1;
  }

  const priority: Priority =
    score >= 9 ? "Critical" : score >= 6 ? "High" : score >= 3 ? "Medium" : "Low";

  return { priority, factors };
}

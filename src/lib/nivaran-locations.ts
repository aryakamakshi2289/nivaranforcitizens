/** Mock location data for the prototype — no live GPS or map service is used. */

export type CityEntry = {
  city: string;
  state: string;
  areas: string[];
};

export const CITIES: CityEntry[] = [
  {
    city: "Delhi",
    state: "Delhi",
    areas: ["Karol Bagh", "Dwarka Sector 12", "Rohini Sector 7", "Lajpat Nagar"],
  },
  {
    city: "Noida",
    state: "Uttar Pradesh",
    areas: ["Sector 15", "Sector 18", "Sector 12", "Sector 62"],
  },
  {
    city: "Greater Noida",
    state: "Uttar Pradesh",
    areas: ["Alpha 1", "Beta 2", "Knowledge Park III"],
  },
  {
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    areas: ["Indirapuram", "Vaishali", "Raj Nagar Extension"],
  },
  {
    city: "Gurugram",
    state: "Haryana",
    areas: ["Sector 29", "DLF Phase 3", "Sohna Road"],
  },
  {
    city: "Lucknow",
    state: "Uttar Pradesh",
    areas: ["Gomti Nagar", "Hazratganj", "Alambagh"],
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    areas: ["Andheri West", "Dadar", "Borivali East"],
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    areas: ["Koramangala", "Indiranagar", "Whitefield"],
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    areas: ["Gachibowli", "Kukatpally", "Begumpet"],
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    areas: ["Malviya Nagar", "Vaishali Nagar", "C-Scheme"],
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    areas: ["Salt Lake Sector 2", "Behala", "Ballygunge"],
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    areas: ["T. Nagar", "Velachery", "Anna Nagar"],
  },
];

export const STATES = Array.from(new Set(CITIES.map((c) => c.state))).sort();

/** Simulated "current location" result used by the prototype only. */
export const SIMULATED_CURRENT_LOCATION = {
  area: "Sector 15",
  city: "Noida",
  state: "Uttar Pradesh",
  landmark: "near the bus stop",
};

export function formatLocation(parts: {
  area: string;
  city: string;
  state: string;
  landmark?: string;
}) {
  const base = [parts.area, parts.city, parts.state].filter(Boolean).join(", ");
  return parts.landmark ? `${base} (${parts.landmark})` : base;
}

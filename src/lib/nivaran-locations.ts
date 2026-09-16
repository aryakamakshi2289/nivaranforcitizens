import { Country, State, type ICountry, type IState } from "country-state-city";

export type CountryOption = Pick<ICountry, "isoCode" | "name" | "flag">;
export type RegionOption = Pick<IState, "isoCode" | "name" | "countryCode">;

export const COUNTRIES: CountryOption[] = Country.getAllCountries()
  .map(({ isoCode, name, flag }) => ({ isoCode, name, flag }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function regionsForCountry(countryCode: string): RegionOption[] {
  return State.getStatesOfCountry(countryCode)
    .map(({ isoCode, name, countryCode: regionCountryCode }) => ({
      isoCode,
      name,
      countryCode: regionCountryCode,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const REGION_LABELS: Record<string, string> = {
  AU: "State / Territory",
  BR: "State",
  CA: "Province / Territory",
  CN: "Province / Region",
  DE: "State",
  ES: "Autonomous Community",
  FR: "Region",
  GB: "Region / Constituent Country",
  IN: "State / Union Territory",
  IT: "Region",
  JP: "Prefecture",
  MX: "State",
  NZ: "Region",
  US: "State / Territory",
  ZA: "Province",
};

export function regionLabel(countryCode: string) {
  return REGION_LABELS[countryCode] ?? "State / Province / Region";
}

export function formatLocation(parts: {
  address: string;
  landmark?: string;
  region: string;
  country: string;
}) {
  return [
    parts.address.trim(),
    parts.landmark.trim() ? `Landmark: ${parts.landmark.trim()}` : "",
    parts.region,
    parts.country,
  ]
    .filter(Boolean)
    .join(", ");
}
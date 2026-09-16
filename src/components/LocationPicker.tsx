import { Check, ChevronDown, Globe2, MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { inputClass } from "@/components/ui-kit";
import {
  COUNTRIES,
  regionLabel,
  regionsForCountry,
  type CountryOption,
  type RegionOption,
} from "@/lib/nivaran-locations";
import { cn } from "@/lib/utils";

export type LocationValue = {
  countryCode: string;
  country: string;
  regionCode: string;
  region: string;
  address: string;
  landmark: string;
};

type SearchSelectProps<T> = {
  id: string;
  label: string;
  icon: ReactNode;
  options: T[];
  value: string;
  getKey: (option: T) => string;
  getLabel: (option: T) => string;
  getPrefix?: (option: T) => ReactNode;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  onSelect: (option: T) => void;
};

function SearchSelect<T>({
  id,
  label,
  icon,
  options,
  value,
  getKey,
  getLabel,
  getPrefix,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  onSelect,
}: SearchSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return options;
    return options.filter((option) => getLabel(option).toLocaleLowerCase().includes(normalized));
  }, [getLabel, options, query]);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <label id={`${id}-label`} className="flex items-center gap-2 text-sm font-semibold text-primary">
        <span className="text-accent" aria-hidden="true">{icon}</span>
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-labelledby={`${id}-label ${id}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
          setQuery("");
        }}
        className={cn(inputClass, "mt-2 flex min-h-11 items-center justify-between gap-3 text-left")}
      >
        <span className={value ? "text-ink" : "text-slate-blue/55"}>{value || placeholder}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-slate-blue transition-transform duration-300", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-navy-deep shadow-raised duration-200">
          <div className="relative border-b border-border p-2.5">
            <Search className="absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false);
                if (event.key === "Enter" && matches[0]) {
                  event.preventDefault();
                  onSelect(matches[0]);
                  setOpen(false);
                }
              }}
              className="w-full rounded-lg bg-soft py-2 pl-9 pr-3 text-sm text-primary outline-none ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-accent"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              aria-controls={`${id}-options`}
            />
          </div>
          <ul id={`${id}-options`} role="listbox" className="max-h-60 overflow-y-auto p-1.5">
            {matches.length ? (
              matches.map((option) => {
                const optionLabel = getLabel(option);
                const selected = optionLabel === value;
                return (
                  <li key={getKey(option)} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        setOpen(false);
                        setQuery("");
                        onSelect(option);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-secondary transition-colors duration-200 hover:bg-soft hover:text-primary",
                        selected && "bg-soft text-primary",
                      )}
                    >
                      {getPrefix?.(option)}
                      <span className="min-w-0 flex-1 truncate">{optionLabel}</span>
                      {selected && <Check className="size-4 text-accent" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function LocationPicker({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
}) {
  const regions = useMemo(() => regionsForCountry(value.countryCode), [value.countryCode]);
  const administrativeLabel = regionLabel(value.countryCode);

  function pick(next: Partial<LocationValue>) {
    onChange({ ...value, ...next });
  }

  return (
    <div className="space-y-5 rounded-xl bg-navy-deep/55 p-4 ring-1 ring-inset ring-border sm:p-5">
      <div>
        <h2 className="font-display text-lg font-bold text-primary">Where is the issue?</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Choose the country and administrative region, then enter the complete address.
        </p>
      </div>

      <SearchSelect<CountryOption>
        id="location-country"
        label="Country"
        icon={<Globe2 className="size-4" />}
        options={COUNTRIES}
        value={value.country}
        getKey={(country) => country.isoCode}
        getLabel={(country) => country.name}
        getPrefix={(country) => (
          <span className="w-7 shrink-0 font-mono text-[10px] font-semibold text-accent" aria-hidden="true">
            {country.isoCode}
          </span>
        )}
        placeholder="Select country"
        searchPlaceholder="Search countries..."
        emptyMessage="No country matches your search."
        onSelect={(country) => {
          const countryRegions = regionsForCountry(country.isoCode);
          pick({
            countryCode: country.isoCode,
            country: country.name,
            regionCode: "",
            region: "",
          });
          if (countryRegions.length === 1) {
            const onlyRegion = countryRegions[0];
            if (onlyRegion) pick({
              countryCode: country.isoCode,
              country: country.name,
              regionCode: onlyRegion.isoCode,
              region: onlyRegion.name,
            });
          }
        }}
      />

      {regions.length > 0 ? (
        <SearchSelect<RegionOption>
          id="location-region"
          label={administrativeLabel}
          icon={<MapPin className="size-4" />}
          options={regions}
          value={value.region}
          getKey={(region) => `${region.countryCode}-${region.isoCode}`}
          getLabel={(region) => region.name}
          placeholder={`Select ${administrativeLabel.toLowerCase()}`}
          searchPlaceholder={`Search ${administrativeLabel.toLowerCase()}...`}
          emptyMessage={`No ${administrativeLabel.toLowerCase()} matches your search.`}
          onSelect={(region) => pick({ regionCode: region.isoCode, region: region.name })}
        />
      ) : (
        <label className="block">
          <span className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="size-4 text-accent" aria-hidden="true" />
            {administrativeLabel}
          </span>
          <input
            required
            className={cn(inputClass, "mt-2")}
            placeholder={`Enter ${administrativeLabel.toLowerCase()}`}
            value={value.region}
            onChange={(event) => pick({ region: event.target.value, regionCode: "" })}
          />
        </label>
      )}

      <label className="block">
        <span className="flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="text-accent" aria-hidden="true">⌂</span>
          Address
        </span>
        <textarea
          required
          rows={3}
          className={cn(inputClass, "mt-2 resize-y")}
          placeholder="House or building, street, locality, city and postal code"
          value={value.address}
          onChange={(event) => pick({ address: event.target.value })}
        />
        <span className="mt-1.5 block text-xs text-muted-foreground">
          Enter the complete address in the format used locally.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-primary">Landmark (optional)</span>
        <input
          className={cn(inputClass, "mt-2")}
          placeholder="e.g. Near City Mall, opposite Metro Station"
          value={value.landmark}
          onChange={(event) => pick({ landmark: event.target.value })}
        />
      </label>
    </div>
  );
}
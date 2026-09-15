import { useMemo, useState } from "react";

import { inputClass } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import { CITIES, SIMULATED_CURRENT_LOCATION, STATES } from "@/lib/nivaran-locations";

export type LocationValue = {
  state: string;
  city: string;
  area: string;
  landmark: string;
};

const PIN_COLUMNS = ["A", "B", "C", "D", "E"];
const PIN_ROWS = [1, 2, 3, 4];

export function LocationPicker({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
}) {
  const [search, setSearch] = useState("");
  const [pin, setPin] = useState<string | null>(null);

  const citiesInState = useMemo(
    () => CITIES.filter((c) => c.state === value.state),
    [value.state],
  );

  const areas = useMemo(
    () => CITIES.find((c) => c.city === value.city)?.areas ?? [],
    [value.city],
  );

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: { area: string; city: string; state: string }[] = [];
    for (const entry of CITIES) {
      if (entry.city.toLowerCase().includes(q) || entry.state.toLowerCase().includes(q)) {
        for (const area of entry.areas) out.push({ area, city: entry.city, state: entry.state });
      } else {
        for (const area of entry.areas) {
          if (area.toLowerCase().includes(q)) out.push({ area, city: entry.city, state: entry.state });
        }
      }
    }
    return out.slice(0, 6);
  }, [search]);

  function pick(next: Partial<LocationValue>) {
    onChange({ ...value, ...next });
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          className={inputClass}
          placeholder="Search an area, locality, city or state — e.g. Sector 15, Noida"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search location"
        />
        {matches.length > 0 && (
          <ul className="animate-in fade-in mt-2 divide-y divide-border overflow-hidden rounded-xl bg-navy-deep/80 ring-1 ring-inset ring-border duration-300">
            {matches.map((m) => (
              <li key={`${m.area}-${m.city}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition hover:bg-soft/60"
                  onClick={() => {
                    pick({ area: m.area, city: m.city, state: m.state });
                    setSearch("");
                  }}
                >
                  <span className="font-medium text-primary">{m.area}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.city}, {m.state}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="label-caps">State</span>
          <select
            className={cn(inputClass, "mt-1.5")}
            value={value.state}
            onChange={(e) => {
              const state = e.target.value;
              const firstCity = CITIES.find((c) => c.state === state);
              pick({
                state,
                city: firstCity?.city ?? "",
                area: firstCity?.areas[0] ?? "",
              });
            }}
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="label-caps">City</span>
          <select
            className={cn(inputClass, "mt-1.5")}
            value={value.city}
            onChange={(e) => {
              const city = e.target.value;
              const entry = CITIES.find((c) => c.city === city);
              pick({ city, area: entry?.areas[0] ?? "" });
            }}
          >
            {citiesInState.map((c) => (
              <option key={c.city} value={c.city}>
                {c.city}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="label-caps">Neighbourhood / Area</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => pick({ area })}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition duration-300",
                area === value.area
                  ? "bg-accent text-primary"
                  : "bg-soft/70 text-secondary ring-1 ring-inset ring-border hover:text-primary",
              )}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="label-caps">Landmark (optional)</span>
        <input
          className={cn(inputClass, "mt-1.5")}
          placeholder="near the bus stop"
          value={value.landmark}
          onChange={(e) => pick({ landmark: e.target.value })}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            pick({
              state: SIMULATED_CURRENT_LOCATION.state,
              city: SIMULATED_CURRENT_LOCATION.city,
              area: SIMULATED_CURRENT_LOCATION.area,
              landmark: SIMULATED_CURRENT_LOCATION.landmark,
            });
            setSearch("");
          }}
          className="rounded-xl border border-input px-3.5 py-2 text-sm font-semibold text-primary transition duration-300 hover:border-accent/60 hover:bg-soft/60"
        >
          Use current location
        </button>
        <span className="self-center text-xs text-muted-foreground">
          Demo only — returns a sample location, no live GPS is used.
        </span>
      </div>

      <div className="rounded-xl bg-navy-deep/70 p-4 ring-1 ring-inset ring-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="label-caps">Drop a pin</span>
          <span className="text-xs text-muted-foreground">Sketch grid, not a live map</span>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {PIN_ROWS.map((row) =>
            PIN_COLUMNS.map((col) => {
              const cell = `${col}${row}`;
              const active = pin === cell;
              return (
                <button
                  key={cell}
                  type="button"
                  aria-label={`Pin grid ${cell}`}
                  onClick={() => {
                    setPin(cell);
                    pick({ landmark: `pinned at grid ${cell}` });
                  }}
                  className={cn(
                    "grid aspect-square place-items-center rounded-md text-[10px] font-medium transition duration-300",
                    active
                      ? "bg-accent text-primary"
                      : "bg-soft/50 text-muted-foreground hover:bg-soft",
                  )}
                >
                  {cell}
                </button>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

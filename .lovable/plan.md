# Global location selection

## Scope
Update only the location section on **Report a Problem**. Keep all five pages, branding, complaint logic, and other interactions unchanged.

## Changes
- Replace the fixed city/sector controls with a searchable country selector covering all countries.
- Add a searchable first-level administrative region selector populated for the chosen country, with country-appropriate wording such as State, Province, or Region.
- Replace neighbourhood/locality choices with a required free-form address field.
- Keep a free-form optional landmark field with the requested example wording.
- Remove the pin grid and all simulated locality/current-location behavior.
- Keep **Use Current Location** as a real browser permission flow only. It will capture coordinates and clearly state that the address still needs confirmation because no external reverse-geocoding service is used.
- Format submitted complaint locations as address, landmark, region, and country while preserving the existing demo complaint and clustering behavior.

## Validation
- Check country and region search, country switching, typed addresses, geolocation states, submission formatting, mobile layout, and keyboard accessibility.
- Confirm no unrelated page or feature changed.

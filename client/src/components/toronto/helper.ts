// Formatting helpers for Toronto Events data.

export function formatDateRange(startdate: string, enddate: string): string {
  const start = new Date(startdate);
  const end = new Date(enddate);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const full: Intl.DateTimeFormatOptions = { ...opts, year: "numeric" };

  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString("en-CA", full);
  }

  return `${start.toLocaleDateString("en-CA", opts)} – ${end.toLocaleDateString("en-CA", full)}`;
}

export function formatLocation(
  locations: Array<{ location_name: string; location_address: string }>
): string {
  if (!locations.length) return "Location TBD";
  const loc = locations[0];
  return loc.location_name || loc.location_address.split(",")[0];
}

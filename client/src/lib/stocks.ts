// Range slicing and number formatting shared by the stock components.

export const RANGES = ["1W", "1M", "3M", "6M", "YTD", "1Y", "5Y"] as const;
export type Range = (typeof RANGES)[number];

const DAYS: Record<Exclude<Range, "YTD">, number> = { "1W": 7, "1M": 30, "3M": 91, "6M": 182, "1Y": 365, "5Y": 1826 };

// Index of the first day shown for a range. That day is the baseline the
// range's change is measured from, so YTD starts on the prior year's last close.
export function rangeStart(dates: string[], range: Range): number {
  const last = dates[dates.length - 1];
  if (!last) return 0;
  if (range === "YTD") {
    const first = dates.findIndex((d) => d.slice(0, 4) === last.slice(0, 4));
    return Math.max(0, first - 1);
  }
  const cutoff = new Date(Date.parse(last) - DAYS[range] * 86_400_000).toISOString().slice(0, 10);
  const start = dates.findIndex((d) => d >= cutoff); // ISO dates sort as strings
  return Math.max(0, start);
}

export function formatPercent(ratio: number): string {
  return `${ratio >= 0 ? "+" : "−"}${Math.abs(ratio * 100).toFixed(1)}%`;
}

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
export const formatCompact = (value: number) => compact.format(value);

const dayFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const formatDay = (date: string) => dayFormat.format(new Date(date));

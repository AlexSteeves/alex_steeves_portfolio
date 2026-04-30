import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient } from "@supabase/supabase-js";
import type { TradesResponse, Politician, TorontoEventsResponse } from "shared";

type Bindings = {
  FINNHUB_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use(cors());

function getSupabase(env: Bindings) {
  return createClient(
    env.SUPABASE_URL || process.env.SUPABASE_URL!,
    env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY!,
  );
}

app.get("/stocks/:ticker", async (c) => {
  const symbol = c.req.param("ticker").toUpperCase();
  const apiKey = c.env.FINNHUB_API_KEY || process.env.FINNHUB_API_KEY;
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
  );
  const data = await res.json();
  return c.json(data);
});

// Trade values are stored as ranges e.g. "$1,001 - $15,000" since exact amounts are not disclosed.
// This extracts the lower bound as an integer so we can sum a politician's total traded value for sorting/filtering.
function parseValueLowerBound(value: string | null): number {
  if (!value) return 0;
  const match = value.match(/\$[0-9,]+/);
  if (!match) return 0;
  return parseInt(match[0].replace("$", "").replace(/,/g, ""), 10) || 0;
}

app.get("/politicians", async (c) => {
  const supabase = getSupabase(c.env);

  const [
    { data: polData, error: polErr },
    { data: tradeData, error: tradeErr },
  ] = await Promise.all([
    supabase
      .from("politicians_with_trades")
      .select("*")
      .order("politician_name"),
    supabase.from("trades").select("politician_name, value"),
  ]);

  if (polErr) return c.json({ error: polErr.message }, 500);
  if (tradeErr) return c.json({ error: tradeErr.message }, 500);

  const totals = new Map<string, number>();
  for (const t of tradeData ?? []) {
    const key = t.politician_name.toLowerCase();
    totals.set(key, (totals.get(key) ?? 0) + parseValueLowerBound(t.value));
  }

  const politicians: Politician[] = (polData ?? []).map((p) => ({
    ...p,
    total_value: totals.get(p.politician_name.toLowerCase()) ?? 0,
  }));

  return c.json(politicians);
});

app.get("/politicians/:bioguide/committees", async (c) => {
  const supabase = getSupabase(c.env);
  const bioguide = c.req.param("bioguide");

  const { data, error } = await supabase
    .from("politician_committees")
    .select("role, rank, committee_id, committees(id, name, chamber, sector)")
    .eq("bioguide_id", bioguide)
    .order("rank");

  if (error) return c.json({ error: error.message }, 500);

  return c.json(data ?? []);
});

app.get("/trades", async (c) => {
  const supabase = getSupabase(c.env);

  const page = Math.max(1, parseInt(c.req.query("page") ?? "1", 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(c.req.query("limit") ?? "50", 10) || 50),
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("trades").select("*", { count: "exact" });

  const politician = c.req.query("politician");
  const ticker = c.req.query("ticker");
  const txType = c.req.query("tx_type");

  if (politician) query = query.ilike("politician_name", `%${politician}%`);
  if (ticker) query = query.ilike("issuer_ticker", `%${ticker}%`);
  if (txType) query = query.eq("tx_type", txType);

  query = query.order("tx_date", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) return c.json({ error: error.message }, 500);

  return c.json<TradesResponse>({
    data: data ?? [],
    count: count ?? 0,
    page,
    limit,
  });
});

const TORONTO_EVENTS_URL =
  "https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/9201059e-43ed-4369-885e-0b867652feac/resource/8900fdb2-7f6c-4f50-8581-b463311ff05d/download/file.json";

type TorontoRawEvent = {
  id: string;
  event_name: string;
  short_description: string | null;
  event_startdate: string;
  event_enddate: string;
  event_status: string;
  event_category: string[];
  free_event: string;
  event_locations: Array<{
    location_name: string;
    location_address: string;
  }> | null;
  event_website: string | null;
  event_dates: Array<{ date: number; locations: string[]; sdate: string }>;
  featured_event: string;
  event_theme: string[];
  accessible_event: string;
};

const TORONTO_CACHE_KEY = "https://toronto-events.cache/all";
const MAX_EVENT_LIMIT = 50;

app.get("/toronto-events", async (c) => {
  let cache: Cache | undefined;
  try {
    if (typeof caches !== "undefined") cache = caches.default;
    const cached = await cache.match(new Request(TORONTO_CACHE_KEY));
    if (cached) return cached;
  } catch {}

  let raw: { value: TorontoRawEvent[] };
  try {
    const res = await fetch(TORONTO_EVENTS_URL);
    if (!res.ok)
      return c.json({ error: "Failed to fetch Toronto events" }, 502);
    raw = (await res.json()) as { value: TorontoRawEvent[] };
  } catch (err) {
    return c.json({ error: "Failed to fetch or parse Toronto events" }, 502);
  }
  if (!Array.isArray(raw?.value)) {
    return c.json({ error: "Unexpected response shape from Toronto API" }, 502);
  }

  const now = Date.now();

  const seen = new Set<string>();
  const events = raw.value
    .filter((e) => {
      if (e.event_status !== "Approved") return false;
      if (new Date(e.event_enddate).getTime() < now) return false;
      const locations = e.event_locations ?? [];
      if (locations.length === 0) return false;
      const allOnline = locations.every((l) =>
        /online|virtual/i.test(l.location_name),
      );
      return !allOnline;
    })
    .sort(
      (a, b) =>
        Math.abs(new Date(a.event_startdate).getTime() - now) -
        Math.abs(new Date(b.event_startdate).getTime() - now),
    )
    .filter((e) => {
      if (seen.has(e.event_name)) return false;
      seen.add(e.event_name);
      return true;
    })
    .map((e) => ({
      id: e.id,
      event_name: e.event_name,
      short_description: e.short_description,
      event_startdate: e.event_startdate,
      event_enddate: e.event_enddate,
      event_category: e.event_category,
      free_event: e.free_event,
      event_locations: (e.event_locations ?? []).map((l) => ({
        location_name: l.location_name,
        location_address: l.location_address,
      })),
      event_website: e.event_website,
      event_dates: e.event_dates,
      featured_event: e.featured_event,
      event_theme: e.event_theme,
      accessible_event: e.accessible_event,
    }));

  const limited = events.slice(0, MAX_EVENT_LIMIT);
  const result: TorontoEventsResponse = {
    events: limited,
    total: limited.length,
    page: 1,
    limit: MAX_EVENT_LIMIT,
  };
  const json = JSON.stringify(result);

  if (cache) {
    try {
      await cache.put(
        new Request(TORONTO_CACHE_KEY),
        new Response(json, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
          },
        }),
      );
    } catch {}
  }

  return c.json(result);
});

export default app;

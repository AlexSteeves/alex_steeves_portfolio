import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'
import type { TradesResponse, Politician } from 'shared'

type Bindings = {
  FINNHUB_API_KEY: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>().basePath("/api")

app.use(cors())

function getSupabase(env: Bindings) {
  return createClient(
    env.SUPABASE_URL || process.env.SUPABASE_URL!,
    env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY!
  )
}

app.get("/stocks/:ticker", async (c) => {
  const symbol = c.req.param('ticker').toUpperCase()
  const apiKey = c.env.FINNHUB_API_KEY || process.env.FINNHUB_API_KEY
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
  );
  const data = await res.json();
  return c.json(data);
});

// Trade values are stored as ranges e.g. "$1,001 - $15,000" since exact amounts are not disclosed.
// This extracts the lower bound as an integer so we can sum a politician's total traded value for sorting/filtering.
function parseValueLowerBound(value: string | null): number {
  if (!value) return 0
  const match = value.match(/\$[0-9,]+/)
  if (!match) return 0
  return parseInt(match[0].replace('$', '').replace(/,/g, ''), 10) || 0
}

app.get("/politicians", async (c) => {
  const supabase = getSupabase(c.env)

  const [{ data: polData, error: polErr }, { data: tradeData, error: tradeErr }] =
    await Promise.all([
      supabase.from('politicians_with_trades').select('*').order('politician_name'),
      supabase.from('trades').select('politician_name, value'),
    ])

  if (polErr) return c.json({ error: polErr.message }, 500)
  if (tradeErr) return c.json({ error: tradeErr.message }, 500)

  const totals = new Map<string, number>()
  for (const t of tradeData ?? []) {
    const key = t.politician_name.toLowerCase()
    totals.set(key, (totals.get(key) ?? 0) + parseValueLowerBound(t.value))
  }

  const politicians: Politician[] = (polData ?? []).map((p) => ({
    ...p,
    total_value: totals.get(p.politician_name.toLowerCase()) ?? 0,
  }))

  return c.json(politicians)
})

app.get("/politicians/:bioguide/committees", async (c) => {
  const supabase = getSupabase(c.env)
  const bioguide = c.req.param('bioguide')

  const { data, error } = await supabase
    .from('politician_committees')
    .select('role, rank, committee_id, committees(id, name, chamber, sector)')
    .eq('bioguide_id', bioguide)
    .order('rank')

  if (error) return c.json({ error: error.message }, 500)

  return c.json(data ?? [])
})

app.get("/trades", async (c) => {
  const supabase = getSupabase(c.env)

  const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') ?? '50', 10) || 50))
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from('trades').select('*', { count: 'exact' })

  const politician = c.req.query('politician')
  const ticker = c.req.query('ticker')
  const txType = c.req.query('tx_type')

  if (politician) query = query.ilike('politician_name', `%${politician}%`)
  if (ticker) query = query.ilike('issuer_ticker', `%${ticker}%`)
  if (txType) query = query.eq('tx_type', txType)

  query = query.order('tx_date', { ascending: false }).range(from, to)

  const { data, error, count } = await query

  if (error) return c.json({ error: error.message }, 500)

  return c.json<TradesResponse>({
    data: data ?? [],
    count: count ?? 0,
    page,
    limit,
  })
})

export default app

export type ApiResponse = {
  message: string;
  success: true;
}

export type TradeRow = {
  id: string;
  politician_id: string;
  politician_name: string;
  politician_party: string | null;
  politician_chamber: string | null;
  politician_state: string | null;
  issuer_id: string | null;
  issuer_name: string | null;
  issuer_ticker: string | null;
  tx_date: string | null;
  pub_date: string | null;
  tx_type: string | null;
  value: string | null;
  price: number | null;
  owner: string | null;
  comment: string | null;
}

export type TradesResponse = {
  data: TradeRow[];
  count: number;
  page: number;
  limit: number;
}

export type Politician = {
  bioguide_id: string;
  politician_name: string;
  politician_party: string | null;
  politician_chamber: string | null;
  politician_state: string | null;
  total_value: number;
}

export type PoliticianCommittee = {
  role: string | null;
  rank: number | null;
  committee_id: string;
  committees: {
    id: string;
    name: string;
    chamber: string | null;
    sector: string | null;
  } | null;
}

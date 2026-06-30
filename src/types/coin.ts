export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetail extends Omit<Coin, "image"> {
  image: { thumb: string; small: string; large: string };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    repos_url: { github: string[] };
  };
  market_data: {
    current_price: { usd: number; krw: number };
    price_change_percentage_1h_in_currency: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: { usd: number; krw: number };
    total_volume: { usd: number; krw: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
  };
}

export interface PortfolioEntry {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  avgBuyPrice: number;
  addedAt: string;
}

export interface WatchlistEntry {
  coinId: string;
  addedAt: string;
}

export type SortKey = "market_cap_rank" | "current_price" | "price_change_percentage_24h" | "total_volume" | "market_cap";
export type SortOrder = "asc" | "desc";

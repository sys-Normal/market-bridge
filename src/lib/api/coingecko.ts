import type { Coin, CoinDetail } from "@/types/coin";
import coingeckoIdMap from "./coingecko-id-map.json";

const BASE_URL = "https://api.coingecko.com/api/v3";
const PAPRIKA_BASE_URL = "https://api.coinpaprika.com/v1";

export type DataSource = "coingecko" | "paprika";

export interface CoinsResult {
  coins: Coin[];
  source: DataSource;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface PaprikaTicker {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number | null;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      market_cap: number;
      percent_change_24h: number;
      percent_change_7d: number;
      ath_price: number;
      percent_from_price_ath: number;
    };
  };
}

const idMap: Record<string, string> = coingeckoIdMap;

function mapPaprikaTicker(t: PaprikaTicker): Coin {
  const usd = t.quotes.USD;
  const symbol = t.symbol.toLowerCase();
  return {
    id: idMap[symbol] ?? t.id,
    symbol,
    name: t.name,
    image: `https://static.coinpaprika.com/coin/${t.id}/logo.png`,
    current_price: usd.price,
    market_cap: usd.market_cap,
    market_cap_rank: t.rank,
    price_change_percentage_24h: usd.percent_change_24h,
    price_change_percentage_7d_in_currency: usd.percent_change_7d,
    total_volume: usd.volume_24h,
    high_24h: usd.price,
    low_24h: usd.price,
    circulating_supply: 0,
    total_supply: t.total_supply,
    ath: usd.ath_price,
    ath_change_percentage: usd.percent_from_price_ath,
  };
}

async function getCoinsFromPaprika(page: number, perPage: number): Promise<Coin[]> {
  const res = await fetch(`${PAPRIKA_BASE_URL}/tickers`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new ApiError(res.status, `CoinPaprika API error: ${res.status}`);

  const tickers: PaprikaTicker[] = await res.json();
  const start = (page - 1) * perPage;
  return tickers.slice(start, start + perPage).map(mapPaprikaTicker);
}

export async function getCoins(
  page = 1,
  perPage = 50,
  currency = "usd"
): Promise<CoinsResult> {
  try {
    const params = new URLSearchParams({
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: String(perPage),
      page: String(page),
      sparkline: "true",
      price_change_percentage: "7d",
    });

    const res = await fetch(`${BASE_URL}/coins/markets?${params}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new ApiError(res.status, `CoinGecko API error: ${res.status}`);
    const coins: Coin[] = await res.json();
    return { coins, source: "coingecko" };
  } catch (error) {
    if (currency !== "usd") throw error;
    const coins = await getCoinsFromPaprika(page, perPage);
    return { coins, source: "paprika" };
  }
}

export async function getCoinDetail(coinId: string): Promise<CoinDetail> {
  const params = new URLSearchParams({
    localization: "false",
    tickers: "false",
    market_data: "true",
    community_data: "false",
    developer_data: "false",
    sparkline: "true",
  });

  const res = await fetch(`${BASE_URL}/coins/${coinId}?${params}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new ApiError(res.status, `CoinGecko API error: ${res.status}`);
  return res.json();
}

export async function searchCoins(query: string): Promise<{ coins: { id: string; name: string; symbol: string; thumb: string }[] }> {
  const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new ApiError(res.status, `CoinGecko API error: ${res.status}`);
  return res.json();
}

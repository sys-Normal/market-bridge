import type { Coin, CoinDetail } from "@/types/coin";

const BASE_URL = "https://api.coingecko.com/api/v3";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function getCoins(
  page = 1,
  perPage = 50,
  currency = "usd"
): Promise<Coin[]> {
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
  return res.json();
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

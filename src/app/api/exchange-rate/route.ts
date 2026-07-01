import { NextResponse } from "next/server";

const FALLBACK_RATE = 1350;

export async function GET() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/exchange_rates", {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

    const data = await res.json();
    const usd = data?.rates?.usd?.value;
    const krw = data?.rates?.krw?.value;
    if (!usd || !krw) throw new Error("Missing exchange rate data");

    return NextResponse.json({ rate: krw / usd });
  } catch {
    return NextResponse.json({ rate: FALLBACK_RATE });
  }
}

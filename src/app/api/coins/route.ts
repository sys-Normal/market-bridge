import { NextRequest, NextResponse } from "next/server";
import { getCoins } from "@/lib/api/coingecko";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 50);
  const currency = searchParams.get("currency") ?? "usd";

  try {
    const coins = await getCoins(page, perPage, currency);
    return NextResponse.json(coins);
  } catch {
    return NextResponse.json({ error: "Failed to fetch coins" }, { status: 502 });
  }
}

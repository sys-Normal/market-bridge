"use client";

import { useEffect, useState } from "react";
import { usePortfolio } from "@/lib/store/portfolio";
import type { Coin } from "@/types/coin";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { PortfolioTable } from "@/components/portfolio/PortfolioTable";

export default function PortfolioPage() {
  const { portfolio } = usePortfolio();
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coins?page=1&perPage=250")
      .then((res) => res.json())
      .then((coins: Coin[]) => {
        const map: Record<string, number> = {};
        coins.forEach((c) => { map[c.id] = c.current_price; });
        setPriceMap(map);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">포트폴리오</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {portfolio.length > 0 ? `${portfolio.length}개 종목 보유` : "보유 코인을 추가해 보세요"}
        </p>
      </div>

      {portfolio.length > 0 && (
        <PortfolioSummary entries={portfolio} priceMap={priceMap} />
      )}

      <PortfolioTable entries={portfolio} priceMap={priceMap} />
    </div>
  );
}

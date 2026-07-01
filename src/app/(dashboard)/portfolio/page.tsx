"use client";

import { useEffect, useState } from "react";
import { usePortfolio } from "@/lib/store/portfolio";
import type { Coin } from "@/types/coin";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { PortfolioTable } from "@/components/portfolio/PortfolioTable";
import { Button } from "@/components/ui/Button";

export default function PortfolioPage() {
  const { portfolio } = usePortfolio();
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // 새 요청 시작 전 로딩/에러 상태를 동기적으로 리셋해야 스피너가 즉시 반영됨
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(false);
    fetch("/api/coins?page=1&perPage=250")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch coins");
        return res.json();
      })
      .then((coins: Coin[]) => {
        const map: Record<string, number> = {};
        coins.forEach((c) => { map[c.id] = c.current_price; });
        setPriceMap(map);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">포트폴리오</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {portfolio.length > 0 ? `${portfolio.length}개 종목 보유` : "보유 코인을 추가해 보세요"}
        </p>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20 text-center">
          <p className="text-sm text-zinc-400">시세를 불러오지 못했습니다.</p>
          <p className="mt-1 text-xs text-zinc-600">잠시 후 다시 시도해주세요.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setReloadKey((k) => k + 1)}>
            다시 시도
          </Button>
        </div>
      ) : (
        <>
          {portfolio.length > 0 && (
            <PortfolioSummary entries={portfolio} priceMap={priceMap} />
          )}

          <PortfolioTable entries={portfolio} priceMap={priceMap} />
        </>
      )}
    </div>
  );
}

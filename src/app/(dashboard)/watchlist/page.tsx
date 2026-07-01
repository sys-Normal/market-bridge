"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWatchlist } from "@/lib/store/watchlist";
import { useDataSource } from "@/lib/store/dataSource";
import type { Coin } from "@/types/coin";
import type { CoinsResult } from "@/lib/api/coingecko";
import { PriceChange } from "@/components/coins/PriceChange";
import { Price } from "@/components/coins/Price";
import { WatchlistButton } from "@/components/watchlist/WatchlistButton";
import { Skeleton, SkeletonRow } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();
  const { setSource } = useDataSource();
  const [coins, setCoins] = useState<Coin[]>([]);
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
      .then(({ coins: all, source }: CoinsResult) => {
        setSource(source);
        const watched = all.filter((c) => watchlist.some((w) => w.coinId === c.id));
        setCoins(watched);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [watchlist, reloadKey, setSource]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">관심 종목</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {watchlist.length > 0 ? `${watchlist.length}개 종목 등록됨` : "아직 등록된 종목이 없습니다"}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
            <svg className="h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-400">관심 종목을 추가해 보세요</p>
          <p className="mt-1 text-xs text-zinc-600">시세 페이지에서 ☆ 버튼을 눌러 추가할 수 있습니다.</p>
          <Link href="/coins" className="mt-4 text-xs text-blue-400 hover:text-blue-300">
            시세 보기 →
          </Link>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20 text-center">
          <p className="text-sm text-zinc-400">시세를 불러오지 못했습니다.</p>
          <p className="mt-1 text-xs text-zinc-600">잠시 후 다시 시도해주세요.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setReloadKey((k) => k + 1)}>
            다시 시도
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="w-10 px-4 py-3" />
                {["코인", "현재가", "24h", "7일", "등록일"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 ${i === 0 ? "text-left" : "text-right"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: watchlist.length }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                : coins.map((coin) => {
                    const entry = watchlist.find((w) => w.coinId === coin.id);
                    const addedDate = entry ? new Date(entry.addedAt).toLocaleDateString("ko-KR") : "";
                    return (
                      <tr key={coin.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <WatchlistButton coinId={coin.id} size="sm" />
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
                            <Image src={coin.image} alt={coin.name} width={28} height={28} className="rounded-full" />
                            <div>
                              <p className="text-sm font-semibold text-zinc-100">{coin.name}</p>
                              <p className="text-xs uppercase text-zinc-500">{coin.symbol}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-100"><Price usdValue={coin.current_price} /></td>
                        <td className="px-4 py-3 text-right"><PriceChange value={coin.price_change_percentage_24h} /></td>
                        <td className="px-4 py-3 text-right">
                          {coin.price_change_percentage_7d_in_currency !== undefined
                            ? <PriceChange value={coin.price_change_percentage_7d_in_currency} />
                            : <span className="text-zinc-600">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-zinc-500">{addedDate}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

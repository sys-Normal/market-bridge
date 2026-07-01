"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Coin, SortKey, SortOrder } from "@/types/coin";
import { PriceChange } from "./PriceChange";
import { Price } from "./Price";
import { Sparkline } from "./Sparkline";
import { WatchlistButton } from "@/components/watchlist/WatchlistButton";
import { PortfolioAddButton } from "@/components/portfolio/PortfolioAddButton";
import { cn } from "@/lib/utils/cn";

interface CoinTableProps {
  coins: Coin[];
}

interface SortConfig {
  key: SortKey;
  order: SortOrder;
}

const COLUMNS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "market_cap_rank", label: "#", align: "left" },
  { key: "current_price", label: "현재가", align: "right" },
  { key: "price_change_percentage_24h", label: "24h", align: "right" },
  { key: "price_change_percentage_7d_in_currency" as SortKey, label: "7d", align: "right" },
  { key: "total_volume", label: "거래량 (24h)", align: "right" },
  { key: "market_cap", label: "시가총액", align: "right" },
];

export function CoinTable({ coins }: CoinTableProps) {
  const [sort, setSort] = useState<SortConfig>({ key: "market_cap_rank", order: "asc" });

  const sorted = [...coins].sort((a, b) => {
    const av = (a as unknown as Record<string, number>)[sort.key] ?? 0;
    const bv = (b as unknown as Record<string, number>)[sort.key] ?? 0;
    return sort.order === "asc" ? av - bv : bv - av;
  });

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, order: prev.order === "asc" ? "desc" : "asc" }
        : { key, order: "desc" }
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              코인
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key)}
                className={cn(
                  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-300 transition-colors",
                  col.align === "right" ? "text-right" : "text-left"
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sort.key === col.key && (
                    <span className="text-blue-400">{sort.order === "asc" ? "↑" : "↓"}</span>
                  )}
                </span>
              </th>
            ))}
            <th className="w-28 px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
              7일 추이
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((coin) => (
            <tr
              key={coin.id}
              className="group border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <WatchlistButton coinId={coin.id} size="sm" />
                  <PortfolioAddButton
                    coinId={coin.id}
                    coinName={coin.name}
                    coinSymbol={coin.symbol}
                    coinImage={coin.image}
                    currentPrice={coin.current_price}
                    size="sm"
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-100 group-hover:text-white">
                      {coin.name}
                    </p>
                    <p className="text-xs text-zinc-500 uppercase">{coin.symbol}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3 text-right text-xs text-zinc-500">
                {coin.market_cap_rank}
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium tabular-nums text-zinc-100">
                <Price usdValue={coin.current_price} />
              </td>
              <td className="px-4 py-3 text-right">
                <PriceChange value={coin.price_change_percentage_24h} />
              </td>
              <td className="px-4 py-3 text-right">
                {coin.price_change_percentage_7d_in_currency !== undefined ? (
                  <PriceChange value={coin.price_change_percentage_7d_in_currency} />
                ) : (
                  <span className="text-zinc-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-400">
                <Price usdValue={coin.total_volume} variant="large" />
              </td>
              <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-400">
                <Price usdValue={coin.market_cap} variant="large" />
              </td>
              <td className="w-28 px-4 py-3">
                {coin.sparkline_in_7d?.price ? (
                  <div className="flex justify-center">
                    <Sparkline
                      data={coin.sparkline_in_7d.price}
                      positive={coin.price_change_percentage_7d_in_currency !== undefined
                        ? coin.price_change_percentage_7d_in_currency >= 0
                        : coin.price_change_percentage_24h >= 0}
                    />
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import Image from "next/image";
import type { PortfolioEntry, Coin } from "@/types/coin";
import { formatPrice, formatLargeNumber, formatPercent } from "@/lib/utils/format";
import { PriceChange } from "@/components/coins/PriceChange";
import { Button } from "@/components/ui/Button";
import { usePortfolio } from "@/lib/store/portfolio";
import { cn } from "@/lib/utils/cn";

interface PortfolioTableProps {
  entries: PortfolioEntry[];
  priceMap: Record<string, number>;
}

export function PortfolioTable({ entries, priceMap }: PortfolioTableProps) {
  const { removeEntry } = usePortfolio();

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
        <p className="text-sm text-zinc-500">보유 코인이 없습니다.</p>
        <p className="mt-1 text-xs text-zinc-600">시세 페이지에서 코인을 추가하세요.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            {["코인", "보유량", "평균 매수가", "현재가", "평가금액", "손익", "수익률", ""].map((h) => (
              <th
                key={h}
                className={cn(
                  "px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500",
                  h === "코인" ? "text-left" : "text-right"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const currentPrice = priceMap[entry.coinId] ?? 0;
            const currentValue = entry.amount * currentPrice;
            const cost = entry.amount * entry.avgBuyPrice;
            const pnl = currentValue - cost;
            const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;

            return (
              <tr key={entry.coinId} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image src={entry.coinImage} alt={entry.coinName} width={28} height={28} className="rounded-full" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{entry.coinName}</p>
                      <p className="text-xs uppercase text-zinc-500">{entry.coinSymbol}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-300">
                  {entry.amount.toLocaleString()} {entry.coinSymbol.toUpperCase()}
                </td>
                <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-400">
                  {formatPrice(entry.avgBuyPrice)}
                </td>
                <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-100">
                  {currentPrice ? formatPrice(currentPrice) : "—"}
                </td>
                <td className="px-4 py-3 text-right text-sm tabular-nums font-medium text-zinc-100">
                  {currentPrice ? formatLargeNumber(currentValue) : "—"}
                </td>
                <td className={cn("px-4 py-3 text-right text-sm tabular-nums font-medium", pnl >= 0 ? "text-red-400" : "text-blue-400")}>
                  {currentPrice ? `${pnl >= 0 ? "+" : ""}${formatPrice(pnl)}` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {currentPrice ? <PriceChange value={pnlPercent} /> : <span className="text-zinc-600">—</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.coinId)}>
                    삭제
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import type { PortfolioEntry } from "@/types/coin";
import { formatPrice, formatPercent } from "@/lib/utils/format";
import { Card, CardTitle, CardValue } from "@/components/ui/Card";
import { PriceChange } from "@/components/coins/PriceChange";

interface PortfolioSummaryProps {
  entries: PortfolioEntry[];
  priceMap: Record<string, number>;
}

export function PortfolioSummary({ entries, priceMap }: PortfolioSummaryProps) {
  const totalCost = entries.reduce((sum, e) => sum + e.amount * e.avgBuyPrice, 0);
  const totalValue = entries.reduce((sum, e) => sum + e.amount * (priceMap[e.coinId] ?? e.avgBuyPrice), 0);
  const pnl = totalValue - totalCost;
  const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardTitle>총 자산</CardTitle>
        <CardValue className="mt-2">{formatPrice(totalValue)}</CardValue>
      </Card>
      <Card>
        <CardTitle>총 매수금액</CardTitle>
        <CardValue className="mt-2">{formatPrice(totalCost)}</CardValue>
      </Card>
      <Card>
        <CardTitle>평가 손익</CardTitle>
        <CardValue className={`mt-2 ${pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {pnl >= 0 ? "+" : ""}{formatPrice(pnl)}
        </CardValue>
      </Card>
      <Card>
        <CardTitle>수익률</CardTitle>
        <div className="mt-2">
          <PriceChange value={pnlPercent} className="text-2xl font-bold" />
        </div>
      </Card>
    </div>
  );
}

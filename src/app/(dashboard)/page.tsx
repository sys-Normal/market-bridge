import Link from "next/link";
import { getCoins } from "@/lib/api/coingecko";
import { Card, CardHeader, CardTitle, CardValue } from "@/components/ui/Card";
import { PriceChange } from "@/components/coins/PriceChange";
import { Price } from "@/components/coins/Price";
import { Sparkline } from "@/components/coins/Sparkline";
import { PageLoadFailed } from "@/components/shared/PageLoadFailed";
import { DataSourceReporter } from "@/components/shared/DataSourceReporter";
import Image from "next/image";

export default async function DashboardPage() {
  let coins;
  let source;
  try {
    ({ coins, source } = await getCoins(1, 10));
  } catch {
    return <PageLoadFailed title="대시보드" subtitle="가상자산 시장 현황" />;
  }

  const topGainers = [...coins]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const topLosers = [...coins]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  const totalMarketCap = coins.reduce((sum, c) => sum + c.market_cap, 0);

  return (
    <div className="space-y-8">
      <DataSourceReporter source={source} />
      <div>
        <h1 className="text-xl font-bold text-white">대시보드</h1>
        <p className="mt-1 text-sm text-zinc-500">가상자산 시장 현황</p>
      </div>

      {/* 시장 요약 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardTitle>총 시가총액</CardTitle>
          <CardValue className="mt-2 text-lg"><Price usdValue={totalMarketCap} variant="large" /></CardValue>
        </Card>
        <Card>
          <CardTitle>상위 코인 수</CardTitle>
          <CardValue className="mt-2 text-lg">{coins.length}</CardValue>
        </Card>
        <Card>
          <CardTitle>24h 상승 종목</CardTitle>
          <CardValue className="mt-2 text-lg text-red-400">
            {coins.filter((c) => c.price_change_percentage_24h > 0).length}
          </CardValue>
        </Card>
        <Card>
          <CardTitle>24h 하락 종목</CardTitle>
          <CardValue className="mt-2 text-lg text-blue-400">
            {coins.filter((c) => c.price_change_percentage_24h < 0).length}
          </CardValue>
        </Card>
      </div>

      {/* 상위 코인 테이블 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-300">시가총액 상위</h2>
          <Link href="/coins" className="text-xs text-blue-400 hover:text-blue-300">
            전체 보기 →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                {["#", "코인", "현재가", "24h", "시가총액", "7일 추이"].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 ${i === 0 || i === 1 ? "text-left" : "text-right"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr key={coin.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-zinc-500">{coin.market_cap_rank}</td>
                  <td className="px-4 py-3">
                    <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
                      <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-zinc-100">{coin.name}</p>
                        <p className="text-xs uppercase text-zinc-500">{coin.symbol}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-100"><Price usdValue={coin.current_price} /></td>
                  <td className="px-4 py-3 text-right"><PriceChange value={coin.price_change_percentage_24h} /></td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-zinc-400"><Price usdValue={coin.market_cap} variant="large" /></td>
                  <td className="px-4 py-3 text-right">
                    {coin.sparkline_in_7d?.price && (
                      <Sparkline data={coin.sparkline_in_7d.price} positive={coin.price_change_percentage_24h >= 0} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 상승/하락 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">24h 상승률 TOP 5</h2>
          <div className="space-y-2">
            {topGainers.map((coin) => (
              <Link key={coin.id} href={`/coins/${coin.id}`} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
                  <span className="text-sm font-medium text-zinc-100">{coin.name}</span>
                </div>
                <PriceChange value={coin.price_change_percentage_24h} />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">24h 하락률 TOP 5</h2>
          <div className="space-y-2">
            {topLosers.map((coin) => (
              <Link key={coin.id} href={`/coins/${coin.id}`} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
                  <span className="text-sm font-medium text-zinc-100">{coin.name}</span>
                </div>
                <PriceChange value={coin.price_change_percentage_24h} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

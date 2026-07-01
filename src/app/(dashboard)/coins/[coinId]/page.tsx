import Image from "next/image";
import { notFound } from "next/navigation";
import { getCoinDetail } from "@/lib/api/coingecko";
import { formatPrice, formatLargeNumber, formatPercent } from "@/lib/utils/format";
import { PriceChange } from "@/components/coins/PriceChange";
import { WatchlistButton } from "@/components/watchlist/WatchlistButton";
import { PortfolioAddButton } from "@/components/portfolio/PortfolioAddButton";
import { Sparkline } from "@/components/coins/Sparkline";
import { Card, CardTitle, CardValue } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface PageProps {
  params: Promise<{ coinId: string }>;
}

export default async function CoinDetailPage({ params }: PageProps) {
  const { coinId } = await params;

  const coin = await getCoinDetail(coinId).catch(() => null);
  if (!coin) notFound();

  const usdPrice = coin.market_data.current_price.usd;
  const krwPrice = coin.market_data.current_price.krw;
  const change24h = coin.market_data.price_change_percentage_24h;
  const change7d = coin.market_data.price_change_percentage_7d;
  const change30d = coin.market_data.price_change_percentage_30d;

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Image src={coin.image.large} alt={coin.name} width={48} height={48} className="rounded-full" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
              <Badge variant="outline">{coin.symbol.toUpperCase()}</Badge>
              {coin.market_cap_rank && (
                <Badge variant="default">#{coin.market_cap_rank}</Badge>
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-bold tabular-nums text-white">
                {formatPrice(usdPrice)}
              </span>
              <PriceChange value={change24h} className="text-lg" />
            </div>
            <p className="mt-0.5 text-sm text-zinc-500">{formatPrice(krwPrice, "krw")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <WatchlistButton coinId={coin.id} />
          <PortfolioAddButton
            coinId={coin.id}
            coinName={coin.name}
            coinSymbol={coin.symbol}
            coinImage={coin.image.large}
            currentPrice={usdPrice}
          />
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardTitle>시가총액</CardTitle>
          <CardValue className="mt-2 text-lg">{formatLargeNumber(coin.market_data.market_cap.usd)}</CardValue>
        </Card>
        <Card>
          <CardTitle>24h 거래량</CardTitle>
          <CardValue className="mt-2 text-lg">{formatLargeNumber(coin.market_data.total_volume.usd)}</CardValue>
        </Card>
        <Card>
          <CardTitle>24h 고가</CardTitle>
          <CardValue className="mt-2 text-lg text-red-400">{formatPrice(coin.market_data.high_24h.usd)}</CardValue>
        </Card>
        <Card>
          <CardTitle>24h 저가</CardTitle>
          <CardValue className="mt-2 text-lg text-blue-400">{formatPrice(coin.market_data.low_24h.usd)}</CardValue>
        </Card>
      </div>

      {/* 기간별 등락률 */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">기간별 등락률</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "24시간", value: change24h },
            { label: "7일", value: change7d },
            { label: "30일", value: change30d },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardTitle>{label}</CardTitle>
              <div className="mt-2">
                <PriceChange value={value} className="text-xl font-bold" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 7일 스파크라인 */}
      {coin.sparkline_in_7d?.price && (
        <div>
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">7일 가격 추이</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <Sparkline
              data={coin.sparkline_in_7d.price}
              positive={change7d >= 0}
              width={600}
              height={120}
            />
          </div>
        </div>
      )}

      {/* 설명 */}
      {coin.description?.en && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-zinc-300">소개</h2>
          <div
            className="prose prose-sm prose-invert max-w-none text-zinc-400 [&_a]:text-blue-400"
            dangerouslySetInnerHTML={{
              __html: coin.description.en.split(". ").slice(0, 5).join(". ") + ".",
            }}
          />
        </div>
      )}
    </div>
  );
}

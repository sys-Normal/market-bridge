import { getCoins } from "@/lib/api/coingecko";
import { CoinTable } from "@/components/coins/CoinTable";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function CoinsPage({ searchParams }: PageProps) {
  const { search } = await searchParams;
  const coins = await getCoins(1, 100).catch(() => []);

  const filtered = search
    ? coins.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.symbol.toLowerCase().includes(search.toLowerCase())
      )
    : coins;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">시세</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {search ? `"${search}" 검색 결과 ${filtered.length}개` : `시가총액 상위 ${coins.length}개 코인`}
        </p>
      </div>
      <CoinTable coins={filtered} />
    </div>
  );
}

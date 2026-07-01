import { notFound } from "next/navigation";
import { getCoinDetail } from "@/lib/api/coingecko";
import { CoinDetailView } from "@/components/coins/CoinDetailView";

interface PageProps {
  params: Promise<{ coinId: string }>;
}

export default async function CoinDetailPage({ params }: PageProps) {
  const { coinId } = await params;

  const coin = await getCoinDetail(coinId).catch(() => null);
  if (!coin) notFound();

  return <CoinDetailView coin={coin} />;
}

import { notFound } from "next/navigation";
import { getCoinDetail, ApiError } from "@/lib/api/coingecko";
import { CoinDetailView } from "@/components/coins/CoinDetailView";

interface PageProps {
  params: Promise<{ coinId: string }>;
}

export default async function CoinDetailPage({ params }: PageProps) {
  const { coinId } = await params;

  try {
    const coin = await getCoinDetail(coinId);
    return <CoinDetailView coin={coin} />;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

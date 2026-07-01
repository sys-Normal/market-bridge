import { Skeleton, SkeletonCardGrid } from "@/components/ui/Skeleton";

export default function CoinDetailLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-8 w-48" />
          </div>
        </div>
      </div>

      <SkeletonCardGrid count={4} />

      <div>
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">기간별 등락률</h2>
        <SkeletonCardGrid count={3} columnsClassName="grid-cols-3" valueClassName="h-6 w-1/2" />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">7일 가격 추이</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <Skeleton className="h-[120px] w-full" />
        </div>
      </div>
    </div>
  );
}

import { Skeleton, SkeletonCardGrid, SkeletonTable } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">대시보드</h1>
        <p className="mt-1 text-sm text-zinc-500">가상자산 시장 현황</p>
      </div>

      <SkeletonCardGrid count={4} />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-300">시가총액 상위</h2>
        </div>
        <SkeletonTable
          columns={[
            { label: "#", align: "left" },
            { label: "코인", align: "left" },
            { label: "현재가" },
            { label: "24h" },
            { label: "시가총액" },
            { label: "7일 추이" },
          ]}
          rows={5}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {["24h 상승률 TOP 5", "24h 하락률 TOP 5"].map((title) => (
          <div key={title}>
            <h2 className="mb-4 text-sm font-semibold text-zinc-300">{title}</h2>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

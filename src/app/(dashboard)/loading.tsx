import { Card, CardTitle } from "@/components/ui/Card";
import { Skeleton, SkeletonRow } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">대시보드</h1>
        <p className="mt-1 text-sm text-zinc-500">가상자산 시장 현황</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardTitle>&nbsp;</CardTitle>
            <Skeleton className="mt-2 h-6 w-2/3" />
          </Card>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-300">시가총액 상위</h2>
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
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={6} />
              ))}
            </tbody>
          </table>
        </div>
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

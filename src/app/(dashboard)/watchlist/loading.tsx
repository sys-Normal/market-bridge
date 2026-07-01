import { Skeleton, SkeletonTable } from "@/components/ui/Skeleton";

export default function WatchlistLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">관심 종목</h1>
        <Skeleton className="mt-2 h-4 w-40" />
      </div>
      <SkeletonTable
        hasIconColumn
        columns={[
          { label: "코인", align: "left" },
          { label: "현재가" },
          { label: "24h" },
          { label: "7일" },
          { label: "등록일" },
        ]}
        rows={5}
      />
    </div>
  );
}

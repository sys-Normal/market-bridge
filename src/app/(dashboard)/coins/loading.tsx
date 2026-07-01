import { Skeleton, SkeletonTable } from "@/components/ui/Skeleton";

export default function CoinsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">시세</h1>
        <Skeleton className="mt-2 h-4 w-40" />
      </div>
      <SkeletonTable
        hasIconColumn
        columns={[
          { label: "코인", align: "left" },
          { label: "#" },
          { label: "현재가" },
          { label: "24h" },
          { label: "7d" },
          { label: "거래량 (24h)" },
          { label: "시가총액" },
          { label: "7일 추이" },
        ]}
        rows={10}
      />
    </div>
  );
}

import { Skeleton, SkeletonCardGrid, SkeletonTable } from "@/components/ui/Skeleton";

export default function PortfolioLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">포트폴리오</h1>
        <Skeleton className="mt-2 h-4 w-40" />
      </div>

      <SkeletonCardGrid count={4} />

      <SkeletonTable
        columns={[
          { label: "코인", align: "left" },
          { label: "보유량" },
          { label: "평균 매수가" },
          { label: "현재가" },
          { label: "평가금액" },
          { label: "손익" },
          { label: "수익률" },
          { label: "" },
        ]}
        rows={4}
      />
    </div>
  );
}

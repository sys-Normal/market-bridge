import { cn } from "@/lib/utils/cn";
import { Card, CardTitle } from "@/components/ui/Card";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-zinc-800", className)} />;
}

export function SkeletonRow({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-zinc-800/60">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

interface SkeletonCardGridProps {
  count: number;
  columnsClassName?: string;
  valueClassName?: string;
}

export function SkeletonCardGrid({
  count,
  columnsClassName = "grid-cols-2 lg:grid-cols-4",
  valueClassName = "h-6 w-2/3",
}: SkeletonCardGridProps) {
  return (
    <div className={cn("grid gap-4", columnsClassName)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardTitle>&nbsp;</CardTitle>
          <Skeleton className={cn("mt-2", valueClassName)} />
        </Card>
      ))}
    </div>
  );
}

interface SkeletonTableColumn {
  label: string;
  align?: "left" | "right";
}

interface SkeletonTableProps {
  columns: SkeletonTableColumn[];
  rows: number;
  hasIconColumn?: boolean;
}

export function SkeletonTable({ columns, rows, hasIconColumn = false }: SkeletonTableProps) {
  const totalCols = columns.length + (hasIconColumn ? 1 : 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            {hasIconColumn && <th className="w-10 px-4 py-3" />}
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500",
                  col.align === "left" ? "text-left" : "text-right"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={totalCols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

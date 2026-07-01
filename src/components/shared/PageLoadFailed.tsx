"use client";

import { Button } from "@/components/ui/Button";

interface PageLoadFailedProps {
  title: string;
  subtitle?: string;
}

export function PageLoadFailed({ title, subtitle }: PageLoadFailedProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20 text-center">
        <p className="text-sm text-zinc-400">시세 정보를 불러오지 못했습니다.</p>
        <p className="mt-1 text-xs text-zinc-600">잠시 후 다시 시도해주세요.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}

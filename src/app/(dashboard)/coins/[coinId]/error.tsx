"use client";

import { Button } from "@/components/ui/Button";

export default function CoinDetailError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20 text-center">
      <p className="text-sm text-zinc-400">시세를 불러오지 못했습니다.</p>
      <p className="mt-1 text-xs text-zinc-600">잠시 후 다시 시도해주세요.</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
}

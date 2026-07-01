"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { useDataSource } from "@/lib/store/dataSource";

const SOURCE_LABEL: Record<string, string> = {
  coingecko: "CoinGecko",
  paprika: "CoinPaprika (대체)",
};

export function Header() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { source } = useDataSource();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/coins?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <form onSubmit={handleSearch} className="w-72">
        <Input
          type="search"
          placeholder="코인 검색 (예: Bitcoin, BTC)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </form>

      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500">
          데이터 출처: {SOURCE_LABEL[source]}
        </span>
        <div
          className={
            source === "coingecko"
              ? "flex h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/25"
              : "flex h-2 w-2 rounded-full bg-amber-400 ring-2 ring-amber-400/25"
          }
        />
      </div>
    </header>
  );
}

"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { WatchlistEntry } from "@/types/coin";

interface WatchlistContextValue {
  watchlist: WatchlistEntry[];
  isWatched: (coinId: string) => boolean;
  addToWatchlist: (coinId: string) => void;
  removeFromWatchlist: (coinId: string) => void;
  toggleWatchlist: (coinId: string) => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

const STORAGE_KEY = "mb_watchlist";

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // localStorage는 서버에 없어 useState 초기값으로 바로 못 읽음(하이드레이션 불일치 유발) — effect 지연 로드가 의도된 트레이드오프
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next: WatchlistEntry[]) => {
    setWatchlist(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const isWatched = useCallback((coinId: string) => watchlist.some((e) => e.coinId === coinId), [watchlist]);

  const addToWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => {
      if (prev.some((e) => e.coinId === coinId)) return prev;
      const next = [...prev, { coinId, addedAt: new Date().toISOString() }];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((e) => e.coinId !== coinId);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const toggleWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => {
      const exists = prev.some((e) => e.coinId === coinId);
      const next = exists
        ? prev.filter((e) => e.coinId !== coinId)
        : [...prev, { coinId, addedAt: new Date().toISOString() }];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <WatchlistContext.Provider value={{ watchlist, isWatched, addToWatchlist, removeFromWatchlist, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}

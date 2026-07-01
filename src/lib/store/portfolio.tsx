"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { PortfolioEntry } from "@/types/coin";

interface PortfolioContextValue {
  portfolio: PortfolioEntry[];
  addEntry: (entry: Omit<PortfolioEntry, "addedAt">) => void;
  removeEntry: (coinId: string) => void;
  updateEntry: (coinId: string, updates: Partial<Pick<PortfolioEntry, "amount" | "avgBuyPrice">>) => void;
  totalCost: number;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

const STORAGE_KEY = "mb_portfolio";

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // localStorage는 서버에 없어 useState 초기값으로 바로 못 읽음(하이드레이션 불일치 유발) — effect 지연 로드가 의도된 트레이드오프
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setPortfolio(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next: PortfolioEntry[]) => {
    setPortfolio(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const addEntry = useCallback((entry: Omit<PortfolioEntry, "addedAt">) => {
    setPortfolio((prev) => {
      const existing = prev.find((e) => e.coinId === entry.coinId);
      let next: PortfolioEntry[];
      if (existing) {
        next = prev.map((e) =>
          e.coinId === entry.coinId
            ? { ...e, amount: e.amount + entry.amount, avgBuyPrice: (e.avgBuyPrice * e.amount + entry.avgBuyPrice * entry.amount) / (e.amount + entry.amount) }
            : e
        );
      } else {
        next = [...prev, { ...entry, addedAt: new Date().toISOString() }];
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const removeEntry = useCallback((coinId: string) => {
    setPortfolio((prev) => {
      const next = prev.filter((e) => e.coinId !== coinId);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const updateEntry = useCallback((coinId: string, updates: Partial<Pick<PortfolioEntry, "amount" | "avgBuyPrice">>) => {
    setPortfolio((prev) => {
      const next = prev.map((e) => (e.coinId === coinId ? { ...e, ...updates } : e));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const totalCost = portfolio.reduce((sum, e) => sum + e.amount * e.avgBuyPrice, 0);

  return (
    <PortfolioContext.Provider value={{ portfolio, addEntry, removeEntry, updateEntry, totalCost }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return ctx;
}

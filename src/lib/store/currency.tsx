"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";

export type CurrencyCode = "usd" | "krw";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  rate: number;
  convert: (usdValue: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "mb_currency";
const FALLBACK_RATE = 1350;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("usd");
  const [rate, setRate] = useState(FALLBACK_RATE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // localStorage는 서버에 없어 useState 초기값으로 바로 못 읽음(하이드레이션 불일치 유발) — effect 지연 로드가 의도된 트레이드오프
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "usd" || stored === "krw") setCurrencyState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((res) => res.json())
      .then((data: { rate?: number }) => {
        if (data.rate) setRate(data.rate);
      })
      .catch(() => {});
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const convert = useCallback(
    (usdValue: number) => (currency === "krw" ? usdValue * rate : usdValue),
    [currency, rate]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}

"use client";

import { useState } from "react";
import { usePortfolio } from "@/lib/store/portfolio";
import { useCurrency } from "@/lib/store/currency";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

interface PortfolioAddButtonProps {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  currentPrice?: number;
  size?: "sm" | "md";
  className?: string;
}

export function PortfolioAddButton({
  coinId,
  coinName,
  coinSymbol,
  coinImage,
  currentPrice,
  size = "md",
  className,
}: PortfolioAddButtonProps) {
  const { addEntry } = usePortfolio();
  const { currency, rate, convert } = useCurrency();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [avgBuyPrice, setAvgBuyPrice] = useState("");

  const prefillPrice = () => (currentPrice ? String(convert(currentPrice)) : "");

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAmount("");
    setAvgBuyPrice(prefillPrice());
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    const enteredPrice = Number(avgBuyPrice);
    if (!parsedAmount || parsedAmount <= 0 || !enteredPrice || enteredPrice <= 0) return;

    const usdPrice = currency === "krw" ? enteredPrice / rate : enteredPrice;

    addEntry({
      coinId,
      coinName,
      coinSymbol,
      coinImage,
      amount: parsedAmount,
      avgBuyPrice: usdPrice,
    });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        title="포트폴리오에 추가"
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 transition-colors hover:bg-blue-500/20 hover:text-blue-400 focus-visible:outline-none",
          size === "sm" ? "h-7 w-7" : "h-8 w-8",
          className
        )}
      >
        <svg
          className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-sm font-semibold text-zinc-100">
              {coinName} 포트폴리오에 추가
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">보유 수량</label>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  autoFocus
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  평균 매수가 ({currency === "krw" ? "원" : "USD"})
                </label>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={avgBuyPrice}
                  onChange={(e) => setAvgBuyPrice(e.target.value)}
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  취소
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  추가
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

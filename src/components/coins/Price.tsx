"use client";

import { useCurrency } from "@/lib/store/currency";
import { formatPrice, formatLargeNumber } from "@/lib/utils/format";

interface PriceProps {
  usdValue: number;
  variant?: "price" | "large";
  showSign?: boolean;
  className?: string;
}

export function Price({ usdValue, variant = "price", showSign = false, className }: PriceProps) {
  const { currency, convert } = useCurrency();
  const converted = convert(usdValue);
  const sign = showSign && converted >= 0 ? "+" : "";
  const text = variant === "large" ? formatLargeNumber(converted, currency) : formatPrice(converted, currency);

  return (
    <span className={className}>
      {sign}
      {text}
    </span>
  );
}

export function formatPrice(value: number, currency: "usd" | "krw" = "usd"): string {
  if (currency === "krw") {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumSignificantDigits: 3,
    maximumSignificantDigits: 5,
  }).format(value);
}

export function formatLargeNumber(value: number, currency: "usd" | "krw" = "usd"): string {
  const symbol = currency === "krw" ? "₩" : "$";
  if (value >= 1_000_000_000_000) return `${symbol}${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `${symbol}${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
  return `${symbol}${value.toLocaleString()}`;
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatSupply(value: number, symbol: string): string {
  return `${(value / 1_000_000).toFixed(2)}M ${symbol.toUpperCase()}`;
}

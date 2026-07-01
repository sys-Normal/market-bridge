import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WatchlistProvider } from "@/lib/store/watchlist";
import { PortfolioProvider } from "@/lib/store/portfolio";
import { CurrencyProvider } from "@/lib/store/currency";
import { DataSourceProvider } from "@/lib/store/dataSource";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Bridge — 가상자산 대시보드",
  description: "가상자산 시세 데이터와 개인 포트폴리오를 연결하는 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="h-full bg-zinc-950 text-zinc-100 antialiased">
        <DataSourceProvider>
          <CurrencyProvider>
            <WatchlistProvider>
              <PortfolioProvider>
                {children}
              </PortfolioProvider>
            </WatchlistProvider>
          </CurrencyProvider>
        </DataSourceProvider>
      </body>
    </html>
  );
}

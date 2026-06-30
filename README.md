# Market Bridge

가상자산 시세 데이터와 개인 관심 종목 / 포트폴리오 관리를 연결하는 Next.js 기반 대시보드입니다.

## 주요 기능

- **시세 조회** — CoinGecko API 기반 실시간 코인 시세, 시가총액, 거래량 확인
- **코인 상세** — 현재가, 기간별 등락률, 7일 스파크라인 차트
- **관심 종목** — ☆ 버튼으로 종목 등록/해제, 등록 날짜 관리
- **포트폴리오** — 보유 코인 추가, 평균 매수가 기반 평가 손익 / 수익률 자동 계산

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data | CoinGecko API |
| State | React Context + localStorage |
| Package Manager | pnpm |

## 화면 구성

```
/               대시보드 홈 — 시장 요약, 상위 코인, 24h 상승/하락 TOP5
/coins          시세 목록 — 컬럼 정렬, 코인 검색
/coins/:id      코인 상세 — 가격, 등락률, 스파크라인, 프로젝트 소개
/watchlist      관심 종목 관리
/portfolio      포트폴리오 — 보유량, 매수가, 손익 계산
```

## 시작하기

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인하세요.

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 실행
pnpm start
```

## 프로젝트 구조

```
src/
├── app/
│   └── (dashboard)/        # 대시보드 레이아웃 라우트 그룹
│       ├── page.tsx         # 대시보드 홈
│       ├── coins/           # 시세 목록 / 상세
│       ├── watchlist/       # 관심 종목
│       └── portfolio/       # 포트폴리오
├── components/
│   ├── ui/                  # 공통 UI (Button, Card, Badge, Input, Skeleton)
│   ├── layout/              # AppShell, Sidebar, Header
│   ├── coins/               # CoinTable, PriceChange, Sparkline
│   ├── watchlist/           # WatchlistButton
│   └── portfolio/           # PortfolioSummary, PortfolioTable
├── lib/
│   ├── api/coingecko.ts     # CoinGecko API 래퍼
│   ├── store/               # watchlist / portfolio Context
│   └── utils/               # cn, format 유틸
└── types/coin.ts            # 공통 타입 정의
```

## 데이터 출처

코인 시세 데이터는 [CoinGecko API](https://www.coingecko.com/en/api) 를 사용합니다.
API 응답은 60초 단위로 ISR(Incremental Static Regeneration) 캐시됩니다.

> 무료 플랜 기준 분당 30회 요청 제한이 있습니다.

## 개발 도구

이 프로젝트는 [Claude Code](https://claude.ai/code) 를 활용하여 개발되었습니다.

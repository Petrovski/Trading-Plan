import type {
  DailyTradeStats,
  PaginatedTradesResult,
  ProductTradeStats,
  TradeExecutionsResult,
  TradeImport,
  TradeSummaryStats,
  TimeOfDayTradeStats,
  Trade,
} from "../types";

const API_BASE = "http://localhost:4000/api";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const tradesApi = {
  getImports: () => request<TradeImport[]>(`/imports`),

  getImportById: (importId: string) =>
    request<TradeImport>(`/imports/${importId}`),

  getSummaryStats: (importId: string) =>
    request<TradeSummaryStats>(`/trade-stats/summary?importId=${importId}`),

  getDailyStats: (importId: string) =>
    request<DailyTradeStats[]>(`/trade-stats/daily?importId=${importId}`),

  getProductStats: (importId: string) =>
    request<ProductTradeStats[]>(`/trade-stats/products?importId=${importId}`),

  getTimeOfDayStats: (importId: string) =>
    request<TimeOfDayTradeStats[]>(
      `/trade-stats/time-of-day?importId=${importId}`,
    ),

  getTrades: (importId: string, page = 1, limit = 500) =>
    request<PaginatedTradesResult>(
      `/trades?importId=${importId}&page=${page}&limit=${limit}`,
    ),

  getTradeExecutions: (tradeId: string) =>
    request<TradeExecutionsResult>(`/trades/${tradeId}/executions`),

  updateTradeJournal: (
    tradeId: string,
    journal: {
      setupType?: string;
      setupGrade?: string;
      followedPlan?: boolean;
      stopRespected?: boolean;
      ruleViolation?: boolean;
      notes?: string;
      screenshotUrls?: string[];
    },
  ) =>
    fetch(`${API_BASE}/trades/${tradeId}/journal`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journal),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return (await response.json()) as Trade;
    }),
};

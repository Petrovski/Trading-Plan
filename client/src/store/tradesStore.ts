import { create } from "zustand";
import { tradesApi } from "../api/tradesApi";
import type {
  DailyTradeStats,
  Trade,
  TradeImport,
  TradeSummaryStats,
} from "../types";

type TradesStore = {
  imports: TradeImport[];
  selectedImportId: string | null;
  summary: TradeSummaryStats | null;
  dailyStats: DailyTradeStats[];
  trades: Trade[];
  loading: boolean;
  loadImports: () => Promise<void>;
  selectImport: (importId: string) => Promise<void>;
};

export const useTradesStore = create<TradesStore>((set) => ({
  imports: [],
  selectedImportId: null,
  summary: null,
  dailyStats: [],
  trades: [],
  loading: false,

  loadImports: async () => {
    const imports = await tradesApi.getImports();
    set({ imports });
  },

  selectImport: async (importId) => {
    set({ loading: true, selectedImportId: importId });

    const [summary, dailyStats, tradesResult] = await Promise.all([
      tradesApi.getSummaryStats(importId),
      tradesApi.getDailyStats(importId),
      tradesApi.getTrades(importId),
    ]);

    set({
      summary,
      dailyStats,
      trades: tradesResult.items,
      loading: false,
    });
  },
}));

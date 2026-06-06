export type TradingPlan = {
  id: string;
  title: string;
  accountSize: number;
  maxDailyLossPct: number;
  riskPerTradePct: number;
  instruments: string[];
  rules: string[];
  notes: string;
  daily: {
    date: string | Date;
    marketContext: string;
    marketContextNotes: string;
    nearestMCVPOC1: string;
    nearestMCVPOC2: string;
    yVPOC: string;
    NVPOCs: string[];
    ONH: string;
    ONL: string;
    ONMID: string;
    ONVPOC: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type TradingPlanRow = {
  id: string;
  title: string;
  accountSize?: number;
  maxDailyLossPct?: number;
  riskPerTradePct?: number;
  daily?: { date?: string; marketContext?: string };
};

// Query result shape
export type TradingPlanQueryResult = { tradingPlan: TradingPlan | null };

export type TradingPlansQueryResult = {
  tradingPlans: TradingPlan[];
};

// Trades / Executions / Trade Stats types
export type PerformanceSummary = {
  grossPnl: number;
  fees: number;
  netPnl: number;
  tradeCount: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
};

export type ProductSummary = {
  product: string;
  grossPnl: number;
  fees: number;
  netPnl: number;
  tradeCount: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
};

export type TradeImport = {
  _id: string;
  source: string;
  fileName: string;
  account?: string;
  importedAt: string;
  startDate?: string;
  endDate?: string;
  rawRowCount: number;
  executionRowCount: number;
  groupedTradeCount: number;
  groupingVersion: number;
  sourceSummary: PerformanceSummary;
  groupedTradeSummary: PerformanceSummary;
  productSummaries: ProductSummary[];
  warnings: string[];
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
};

export type TradeJournal = {
  setupType?: string;
  setupGrade?: string;
  followedPlan?: boolean;
  stopRespected?: boolean;
  ruleViolation?: boolean;
  notes?: string;
  screenshotUrls?: string[];
};

export type Trade = {
  _id: string;
  importId: string;
  product: string;
  tradeDate: string;
  entryOrderNumber: string;
  side: "LONG" | "SHORT";
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  avgExitPrice: number;
  totalSize: number;
  executionCount: number;
  grossPnl: number;
  fees: number;
  netPnl: number;
  durationSeconds: number;
  executionIds: string[];
  journal?: TradeJournal;
  createdAt?: string;
  updatedAt?: string;
};

export type TradeExecution = {
  _id: string;
  importId: string;
  product: string;
  tradeDate: string;
  entryOrderNumber: string;
  entrySideRaw: string;
  side: "LONG" | "SHORT";
  entryTime: string;
  entryPrice: number;
  exitOrderNumber: string;
  exitSideRaw: string;
  exitTime: string;
  exitPrice: number;
  lifeSpanSeconds: number;
  fillSize: number;
  grossPnl: number;
  fees: number;
  netPnl: number;
  ticksMade?: number;
  rawRowIndex: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedTradesResult = {
  items: Trade[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export type TradeExecutionsResult = {
  trade: Trade;
  executions: TradeExecution[];
};

export type TradeSummaryStats = {
  tradeCount: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  grossPnl: number;
  fees: number;
  netPnl: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
};

export type DailyTradeStats = {
  tradeDate: string;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  grossPnl: number;
  fees: number;
  netPnl: number;
};

export type ProductTradeStats = {
  product: string;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  grossPnl: number;
  fees: number;
  netPnl: number;
  winRate: number;
};

export type TimeOfDayTradeStats = {
  bucket: string;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  netPnl: number;
};

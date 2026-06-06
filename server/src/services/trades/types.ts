export type TradeSide = "LONG" | "SHORT";

export type ParsedRithmicExecution = {
  product: string;
  tradeDate: string;
  entryOrderNumber: string;
  entrySideRaw: string;
  side: TradeSide;
  entryTime: Date;
  entryPrice: number;
  exitOrderNumber: string;
  exitSideRaw: string;
  exitTime: Date;
  exitPrice: number;
  lifeSpanSeconds: number;
  fillSize: number;
  grossPnl: number;
  fees: number;
  netPnl: number;
  ticksMade?: number;
  rawRowIndex: number;
};

export type ParsedProductSummary = {
  product: string;
  grossPnl: number;
  fees: number;
  netPnl: number;
  tradeCount: number;
  winningTrades: number;
  losingTrades: number;
};

export type ParsedRithmicCsvResult = {
  account?: string;
  startDate?: string;
  endDate?: string;
  rawRowCount: number;
  executions: ParsedRithmicExecution[];
  productSummaries: ParsedProductSummary[];
  warnings: string[];
  summary: {
    grossPnl: number;
    fees: number;
    netPnl: number;
    tradeCount: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
  };
};

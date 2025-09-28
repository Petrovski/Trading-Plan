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

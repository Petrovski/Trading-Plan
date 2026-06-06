import type { GroupedTradeInput } from "./groupExecutionsIntoTrades";

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

export function buildTradeStats(
  groupedTrades: GroupedTradeInput[],
): TradeSummaryStats {
  const winningTrades = groupedTrades.filter((trade) => trade.netPnl > 0);
  const losingTrades = groupedTrades.filter((trade) => trade.netPnl < 0);

  const grossPnl = groupedTrades.reduce(
    (sum, trade) => sum + trade.grossPnl,
    0,
  );
  const fees = groupedTrades.reduce((sum, trade) => sum + trade.fees, 0);
  const netPnl = groupedTrades.reduce((sum, trade) => sum + trade.netPnl, 0);

  const totalWinningPnl = winningTrades.reduce(
    (sum, trade) => sum + trade.netPnl,
    0,
  );
  const totalLosingPnlAbs = Math.abs(
    losingTrades.reduce((sum, trade) => sum + trade.netPnl, 0),
  );

  return {
    tradeCount: groupedTrades.length,
    winCount: winningTrades.length,
    lossCount: losingTrades.length,
    winRate:
      groupedTrades.length > 0
        ? (winningTrades.length / groupedTrades.length) * 100
        : 0,
    grossPnl,
    fees,
    netPnl,
    avgWin:
      winningTrades.length > 0 ? totalWinningPnl / winningTrades.length : 0,
    avgLoss:
      losingTrades.length > 0
        ? losingTrades.reduce((sum, trade) => sum + trade.netPnl, 0) /
          losingTrades.length
        : 0,
    profitFactor:
      totalLosingPnlAbs > 0 ? totalWinningPnl / totalLosingPnlAbs : 0,
  };
}

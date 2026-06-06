import { FilterQuery } from "mongoose";
import { Trade } from "../../../models/Trade";

type GetTradeSummaryStatsParams = {
  importId?: string;
  dateFrom?: string;
  dateTo?: string;
  product?: string;
};

export async function getTradeSummaryStats({
  importId,
  dateFrom,
  dateTo,
  product,
}: GetTradeSummaryStatsParams) {
  const query: FilterQuery<typeof Trade> = {};

  if (importId) {
    query.importId = importId;
  }

  if (product) {
    query.product = product;
  }

  if (dateFrom || dateTo) {
    query.tradeDate = {};
    if (dateFrom) {
      query.tradeDate.$gte = dateFrom.replaceAll("-", "");
    }
    if (dateTo) {
      query.tradeDate.$lte = dateTo.replaceAll("-", "");
    }
  }

  const trades = await Trade.find(query).lean();

  const winningTrades = trades.filter((trade) => trade.netPnl > 0);
  const losingTrades = trades.filter((trade) => trade.netPnl < 0);

  const grossPnl = trades.reduce((sum, trade) => sum + trade.grossPnl, 0);
  const fees = trades.reduce((sum, trade) => sum + trade.fees, 0);
  const netPnl = trades.reduce((sum, trade) => sum + trade.netPnl, 0);

  const totalWinningPnl = winningTrades.reduce(
    (sum, trade) => sum + trade.netPnl,
    0,
  );
  const totalLosingPnlAbs = Math.abs(
    losingTrades.reduce((sum, trade) => sum + trade.netPnl, 0),
  );

  return {
    tradeCount: trades.length,
    winCount: winningTrades.length,
    lossCount: losingTrades.length,
    winRate:
      trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
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

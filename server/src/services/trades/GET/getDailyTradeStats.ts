import { FilterQuery } from "mongoose";
import { Trade } from "../../../models/Trade";

type GetDailyTradeStatsParams = {
  importId?: string;
  dateFrom?: string;
  dateTo?: string;
  product?: string;
};

export async function getDailyTradeStats({
  importId,
  dateFrom,
  dateTo,
  product,
}: GetDailyTradeStatsParams) {
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

  const trades = await Trade.find(query)
    .sort({ tradeDate: 1, entryTime: 1 })
    .lean();

  const dailyStatsMap = new Map<
    string,
    {
      tradeDate: string;
      tradeCount: number;
      winCount: number;
      lossCount: number;
      grossPnl: number;
      fees: number;
      netPnl: number;
    }
  >();

  for (const trade of trades) {
    const existingDay = dailyStatsMap.get(trade.tradeDate) ?? {
      tradeDate: trade.tradeDate,
      tradeCount: 0,
      winCount: 0,
      lossCount: 0,
      grossPnl: 0,
      fees: 0,
      netPnl: 0,
    };

    existingDay.tradeCount += 1;
    if (trade.netPnl > 0) {
      existingDay.winCount += 1;
    } else if (trade.netPnl < 0) {
      existingDay.lossCount += 1;
    }

    existingDay.grossPnl += trade.grossPnl;
    existingDay.fees += trade.fees;
    existingDay.netPnl += trade.netPnl;

    dailyStatsMap.set(trade.tradeDate, existingDay);
  }

  return Array.from(dailyStatsMap.values());
}

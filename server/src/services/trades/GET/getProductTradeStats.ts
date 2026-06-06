import { FilterQuery } from "mongoose";
import { Trade } from "../../../models/Trade";

type GetProductTradeStatsParams = {
  importId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function getProductTradeStats({
  importId,
  dateFrom,
  dateTo,
}: GetProductTradeStatsParams) {
  const query: FilterQuery<typeof Trade> = {};

  if (importId) {
    query.importId = importId;
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

  const productStatsMap = new Map<
    string,
    {
      product: string;
      tradeCount: number;
      winCount: number;
      lossCount: number;
      grossPnl: number;
      fees: number;
      netPnl: number;
    }
  >();

  for (const trade of trades) {
    const existingProduct = productStatsMap.get(trade.product) ?? {
      product: trade.product,
      tradeCount: 0,
      winCount: 0,
      lossCount: 0,
      grossPnl: 0,
      fees: 0,
      netPnl: 0,
    };

    existingProduct.tradeCount += 1;
    if (trade.netPnl > 0) {
      existingProduct.winCount += 1;
    } else if (trade.netPnl < 0) {
      existingProduct.lossCount += 1;
    }

    existingProduct.grossPnl += trade.grossPnl;
    existingProduct.fees += trade.fees;
    existingProduct.netPnl += trade.netPnl;

    productStatsMap.set(trade.product, existingProduct);
  }

  return Array.from(productStatsMap.values()).map((productStat) => ({
    ...productStat,
    winRate:
      productStat.tradeCount > 0
        ? (productStat.winCount / productStat.tradeCount) * 100
        : 0,
  }));
}

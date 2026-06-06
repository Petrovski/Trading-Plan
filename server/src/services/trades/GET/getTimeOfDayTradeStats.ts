import { FilterQuery } from "mongoose";
import { Trade } from "../../../models/Trade";

type GetTimeOfDayTradeStatsParams = {
  importId?: string;
  dateFrom?: string;
  dateTo?: string;
  product?: string;
};

function getHourBucket(entryTime: Date) {
  const hour = new Date(entryTime).getHours();
  return `${String(hour).padStart(2, "0")}:00`;
}

export async function getTimeOfDayTradeStats({
  importId,
  dateFrom,
  dateTo,
  product,
}: GetTimeOfDayTradeStatsParams) {
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

  const bucketStatsMap = new Map<
    string,
    {
      bucket: string;
      tradeCount: number;
      winCount: number;
      lossCount: number;
      netPnl: number;
    }
  >();

  for (const trade of trades) {
    const bucket = getHourBucket(trade.entryTime);

    const existingBucket = bucketStatsMap.get(bucket) ?? {
      bucket,
      tradeCount: 0,
      winCount: 0,
      lossCount: 0,
      netPnl: 0,
    };

    existingBucket.tradeCount += 1;
    if (trade.netPnl > 0) {
      existingBucket.winCount += 1;
    } else if (trade.netPnl < 0) {
      existingBucket.lossCount += 1;
    }

    existingBucket.netPnl += trade.netPnl;

    bucketStatsMap.set(bucket, existingBucket);
  }

  return Array.from(bucketStatsMap.values()).sort((leftBucket, rightBucket) =>
    leftBucket.bucket.localeCompare(rightBucket.bucket),
  );
}

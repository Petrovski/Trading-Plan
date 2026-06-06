import { FilterQuery } from "mongoose";
import { Trade } from "../../../models/Trade";

type GetTradesParams = {
  importId?: string;
  dateFrom?: string;
  dateTo?: string;
  product?: string;
  side?: "LONG" | "SHORT";
  page?: number;
  limit?: number;
  sortBy?: "entryTime" | "tradeDate" | "netPnl" | "product";
  sortOrder?: "asc" | "desc";
};

export async function getTrades({
  importId,
  dateFrom,
  dateTo,
  product,
  side,
  page = 1,
  limit = 25,
  sortBy = "entryTime",
  sortOrder = "desc",
}: GetTradesParams) {
  const query: FilterQuery<typeof Trade> = {};

  if (importId) {
    query.importId = importId;
  }

  if (product) {
    query.product = product;
  }

  if (side) {
    query.side = side;
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

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const skip = (safePage - 1) * safeLimit;

  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [items, totalCount] = await Promise.all([
    Trade.find(query)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Trade.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalCount,
      totalPages: Math.ceil(totalCount / safeLimit),
    },
  };
}

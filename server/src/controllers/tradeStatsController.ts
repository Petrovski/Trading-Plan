import type { Request, Response } from "express";
import { getTradeSummaryStats } from "../services/trades/GET/getTradeSummaryStats";
import { getDailyTradeStats } from "../services/trades/GET/getDailyTradeStats";
import { getProductTradeStats } from "../services/trades/GET/getProductTradeStats";
import { getTimeOfDayTradeStats } from "../services/trades/GET/getTimeOfDayTradeStats";

export async function getSummaryStats(request: Request, response: Response) {
  try {
    const result = await getTradeSummaryStats({
      importId: request.query.importId as string | undefined,
      dateFrom: request.query.dateFrom as string | undefined,
      dateTo: request.query.dateTo as string | undefined,
      product: request.query.product as string | undefined,
    });

    return response.json(result);
  } catch (error) {
    console.error("getSummaryStats error", error);
    return response
      .status(500)
      .json({ message: "Failed to fetch summary stats." });
  }
}

export async function getDailyStats(request: Request, response: Response) {
  try {
    const result = await getDailyTradeStats({
      importId: request.query.importId as string | undefined,
      dateFrom: request.query.dateFrom as string | undefined,
      dateTo: request.query.dateTo as string | undefined,
      product: request.query.product as string | undefined,
    });

    return response.json(result);
  } catch (error) {
    console.error("getDailyStats error", error);
    return response
      .status(500)
      .json({ message: "Failed to fetch daily stats." });
  }
}

export async function getProductStats(request: Request, response: Response) {
  try {
    const result = await getProductTradeStats({
      importId: request.query.importId as string | undefined,
      dateFrom: request.query.dateFrom as string | undefined,
      dateTo: request.query.dateTo as string | undefined,
    });

    return response.json(result);
  } catch (error) {
    console.error("getProductStats error", error);
    return response
      .status(500)
      .json({ message: "Failed to fetch product stats." });
  }
}

export async function getTimeOfDayStats(request: Request, response: Response) {
  try {
    const result = await getTimeOfDayTradeStats({
      importId: request.query.importId as string | undefined,
      dateFrom: request.query.dateFrom as string | undefined,
      dateTo: request.query.dateTo as string | undefined,
      product: request.query.product as string | undefined,
    });

    return response.json(result);
  } catch (error) {
    console.error("getTimeOfDayStats error", error);
    return response
      .status(500)
      .json({ message: "Failed to fetch time-of-day stats." });
  }
}

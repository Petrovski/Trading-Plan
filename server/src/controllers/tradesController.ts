import type { Request, Response } from "express";
import { getTrades } from "../services/trades/GET/getTrades";
import { getTradeById } from "../services/trades/GET/getTradeById";
import { getTradeExecutions } from "../services/trades/GET/getTradeExeuctions";
import { updateTradeJournal } from "../services/trades/UPDATE/updateTradeJournal";

export async function listTrades(request: Request, response: Response) {
  try {
    const result = await getTrades({
      importId: request.query.importId as string | undefined,
      dateFrom: request.query.dateFrom as string | undefined,
      dateTo: request.query.dateTo as string | undefined,
      product: request.query.product as string | undefined,
      side: request.query.side as "LONG" | "SHORT" | undefined,
      page: request.query.page ? Number(request.query.page) : undefined,
      limit: request.query.limit ? Number(request.query.limit) : undefined,
      sortBy: request.query.sortBy as
        | "entryTime"
        | "tradeDate"
        | "netPnl"
        | "product"
        | undefined,
      sortOrder: request.query.sortOrder as "asc" | "desc" | undefined,
    });

    return response.json(result);
  } catch (error) {
    console.error("listTrades error", error);
    return response.status(500).json({ message: "Failed to fetch trades." });
  }
}

export async function getTrade(request: Request, response: Response) {
  try {
    const trade = await getTradeById(request.params.tradeId);

    if (!trade) {
      return response.status(404).json({ message: "Trade not found." });
    }

    return response.json(trade);
  } catch (error) {
    console.error("getTrade error", error);
    return response.status(500).json({ message: "Failed to fetch trade." });
  }
}

export async function getExecutionsForTrade(
  request: Request,
  response: Response,
) {
  try {
    const result = await getTradeExecutions(request.params.tradeId);

    if (!result) {
      return response.status(404).json({ message: "Trade not found." });
    }

    return response.json(result);
  } catch (error) {
    console.error("getExecutionsForTrade error", error);
    return response
      .status(500)
      .json({ message: "Failed to fetch trade executions." });
  }
}

export async function patchTradeJournal(request: Request, response: Response) {
  try {
    const updatedTrade = await updateTradeJournal({
      tradeId: request.params.tradeId,
      journal: request.body,
    });

    if (!updatedTrade) {
      return response.status(404).json({ message: "Trade not found." });
    }

    return response.json(updatedTrade);
  } catch (error) {
    console.error("patchTradeJournal error", error);
    return response
      .status(500)
      .json({ message: "Failed to update trade journal." });
  }
}

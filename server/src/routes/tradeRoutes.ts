import { Router } from "express";
import {
  getExecutionsForTrade,
  getTrade,
  listTrades,
  patchTradeJournal,
} from "../controllers/tradesController";

export const tradeRoutes = Router();

tradeRoutes.get("/", listTrades);
tradeRoutes.get("/:tradeId", getTrade);
tradeRoutes.get("/:tradeId/executions", getExecutionsForTrade);
tradeRoutes.patch("/:tradeId/journal", patchTradeJournal);

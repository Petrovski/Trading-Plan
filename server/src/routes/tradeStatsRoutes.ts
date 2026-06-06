import { Router } from "express";
import {
  getDailyStats,
  getProductStats,
  getSummaryStats,
  getTimeOfDayStats,
} from "../controllers/tradeStatsController";

export const tradeStatsRoutes = Router();

tradeStatsRoutes.get("/summary", getSummaryStats);
tradeStatsRoutes.get("/daily", getDailyStats);
tradeStatsRoutes.get("/products", getProductStats);
tradeStatsRoutes.get("/time-of-day", getTimeOfDayStats);

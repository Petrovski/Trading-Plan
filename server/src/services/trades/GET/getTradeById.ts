import { Trade } from "../../../models/Trade";

export async function getTradeById(tradeId: string) {
  return Trade.findById(tradeId).lean();
}

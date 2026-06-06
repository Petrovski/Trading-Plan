import { Trade } from "../../../models/Trade";
import { TradeExecution } from "../../../models/TradeExecution";

export async function getTradeExecutions(tradeId: string) {
  const trade = await Trade.findById(tradeId).lean();

  if (!trade) {
    return null;
  }

  const executions = await TradeExecution.find({
    _id: { $in: trade.executionIds },
  })
    .sort({ exitTime: 1, rawRowIndex: 1 })
    .lean();

  return {
    trade,
    executions,
  };
}

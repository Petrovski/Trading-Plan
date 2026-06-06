import type { ParsedRithmicExecution } from "./types";

export type GroupedTradeInput = {
  product: string;
  tradeDate: string;
  entryOrderNumber: string;
  side: "LONG" | "SHORT";
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  avgExitPrice: number;
  totalSize: number;
  executionCount: number;
  grossPnl: number;
  fees: number;
  netPnl: number;
  durationSeconds: number;
  executions: ParsedRithmicExecution[];
};

function buildGroupingKey(execution: ParsedRithmicExecution): string {
  return [
    execution.product,
    execution.entryOrderNumber,
    execution.entrySideRaw,
    execution.entryTime.toISOString(),
    execution.entryPrice.toFixed(2),
  ].join("|");
}

export function groupExecutionsIntoTrades(
  executions: ParsedRithmicExecution[],
): GroupedTradeInput[] {
  const groupedExecutionMap = new Map<string, ParsedRithmicExecution[]>();

  for (const execution of executions) {
    const groupingKey = buildGroupingKey(execution);
    const existingExecutions = groupedExecutionMap.get(groupingKey) ?? [];
    existingExecutions.push(execution);
    groupedExecutionMap.set(groupingKey, existingExecutions);
  }

  const groupedTrades: GroupedTradeInput[] = [];

  for (const groupedExecutions of groupedExecutionMap.values()) {
    const sortedExecutions = [...groupedExecutions].sort(
      (leftExecution, rightExecution) =>
        leftExecution.exitTime.getTime() - rightExecution.exitTime.getTime(),
    );

    const firstExecution = sortedExecutions[0];
    const lastExecution = sortedExecutions[sortedExecutions.length - 1];

    const totalSize = sortedExecutions.reduce(
      (sum, execution) => sum + execution.fillSize,
      0,
    );
    const weightedExitValue = sortedExecutions.reduce(
      (sum, execution) => sum + execution.exitPrice * execution.fillSize,
      0,
    );

    const grossPnl = sortedExecutions.reduce(
      (sum, execution) => sum + execution.grossPnl,
      0,
    );
    const totalFees = sortedExecutions.reduce(
      (sum, execution) => sum + execution.fees,
      0,
    );
    const netPnl = sortedExecutions.reduce(
      (sum, execution) => sum + execution.netPnl,
      0,
    );

    groupedTrades.push({
      product: firstExecution.product,
      tradeDate: firstExecution.tradeDate,
      entryOrderNumber: firstExecution.entryOrderNumber,
      side: firstExecution.side,
      entryTime: firstExecution.entryTime,
      exitTime: lastExecution.exitTime,
      entryPrice: firstExecution.entryPrice,
      avgExitPrice:
        totalSize > 0
          ? weightedExitValue / totalSize
          : firstExecution.entryPrice,
      totalSize,
      executionCount: sortedExecutions.length,
      grossPnl,
      fees: totalFees,
      netPnl,
      durationSeconds:
        (lastExecution.exitTime.getTime() -
          firstExecution.entryTime.getTime()) /
        1000,
      executions: sortedExecutions,
    });
  }

  return groupedTrades.sort(
    (leftTrade, rightTrade) =>
      leftTrade.entryTime.getTime() - rightTrade.entryTime.getTime(),
  );
}

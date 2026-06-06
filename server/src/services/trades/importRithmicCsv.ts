import crypto from "crypto";
import { TradeImport } from "../../models/TradeImport";
import { TradeExecution } from "../../models/TradeExecution";
import { Trade } from "../../models/Trade";
import { parseRithmicCsv } from "./parseRithmicCsv";
import { groupExecutionsIntoTrades } from "./groupExecutionsIntoTrades";
import { buildTradeStats } from "./buildTradeStats";

type ImportRithmicCsvParams = {
  fileName: string;
  csvText: string;
};

export async function importRithmicCsv({
  fileName,
  csvText,
}: ImportRithmicCsvParams) {
  const parsedCsv = parseRithmicCsv(csvText);

  const fileHash = crypto.createHash("md5").update(csvText).digest("hex");

  const existingImport = await TradeImport.findOne({ fileHash }).lean();

  if (existingImport) {
    return {
      importId: existingImport._id,
      executionRowCount: existingImport.executionRowCount,
      groupedTradeCount: existingImport.groupedTradeCount,
      sourceSummary: existingImport.sourceSummary,
      groupedTradeSummary: existingImport.groupedTradeSummary,
      warnings: [`This file was already imported as ${existingImport._id}`],
    };
  }

  const tradeImport = await TradeImport.create({
    source: "RITHMIC",
    fileName,
    account: parsedCsv.account,
    importedAt: new Date(),
    startDate: parsedCsv.startDate,
    endDate: parsedCsv.endDate,
    rawRowCount: parsedCsv.rawRowCount,
    executionRowCount: 0,
    groupedTradeCount: 0,
    groupingVersion: 1,
    sourceSummary: parsedCsv.summary,
    groupedTradeSummary: {
      grossPnl: 0,
      fees: 0,
      netPnl: 0,
      tradeCount: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
    },
    productSummaries: parsedCsv.productSummaries.map((productSummary) => ({
      ...productSummary,
      winRate:
        productSummary.tradeCount > 0
          ? (productSummary.winningTrades / productSummary.tradeCount) * 100
          : 0,
    })),
    warnings: parsedCsv.warnings,
    status: "PROCESSING",
  });

  try {
    const executionDocuments = await TradeExecution.insertMany(
      parsedCsv.executions.map((execution) => ({
        importId: tradeImport._id,
        ...execution,
      })),
    );

    const groupedTrades = groupExecutionsIntoTrades(
      executionDocuments.map((executionDocument) => ({
        product: executionDocument.product,
        tradeDate: executionDocument.tradeDate,
        entryOrderNumber: executionDocument.entryOrderNumber,
        entrySideRaw: executionDocument.entrySideRaw,
        side: executionDocument.side,
        entryTime: executionDocument.entryTime,
        entryPrice: executionDocument.entryPrice,
        exitOrderNumber: executionDocument.exitOrderNumber,
        exitSideRaw: executionDocument.exitSideRaw,
        exitTime: executionDocument.exitTime,
        exitPrice: executionDocument.exitPrice,
        lifeSpanSeconds: executionDocument.lifeSpanSeconds,
        fillSize: executionDocument.fillSize,
        grossPnl: executionDocument.grossPnl,
        fees: executionDocument.fees,
        netPnl: executionDocument.netPnl,
        ticksMade: executionDocument.ticksMade,
        rawRowIndex: executionDocument.rawRowIndex,
      })),
    );

    const executionIdMap = new Map(
      executionDocuments.map((executionDocument) => [
        `${executionDocument.product}|${executionDocument.entryOrderNumber}|${executionDocument.rawRowIndex}`,
        executionDocument._id,
      ]),
    );

    const tradeDocuments = groupedTrades.map((groupedTrade) => ({
      importId: tradeImport._id,
      product: groupedTrade.product,
      tradeDate: groupedTrade.tradeDate,
      entryOrderNumber: groupedTrade.entryOrderNumber,
      side: groupedTrade.side,
      entryTime: groupedTrade.entryTime,
      exitTime: groupedTrade.exitTime,
      entryPrice: groupedTrade.entryPrice,
      avgExitPrice: groupedTrade.avgExitPrice,
      totalSize: groupedTrade.totalSize,
      executionCount: groupedTrade.executionCount,
      grossPnl: groupedTrade.grossPnl,
      fees: groupedTrade.fees,
      netPnl: groupedTrade.netPnl,
      durationSeconds: groupedTrade.durationSeconds,
      executionIds: groupedTrade.executions
        .map((execution) =>
          executionIdMap.get(
            `${execution.product}|${execution.entryOrderNumber}|${execution.rawRowIndex}`,
          ),
        )
        .filter((executionId): executionId is NonNullable<typeof executionId> =>
          Boolean(executionId),
        ),
    }));

    await Trade.insertMany(tradeDocuments);

    const computedSummaryStats = buildTradeStats(groupedTrades);

    tradeImport.executionRowCount = executionDocuments.length;
    tradeImport.groupedTradeCount = groupedTrades.length;
    tradeImport.status = "COMPLETED";
    tradeImport.groupedTradeSummary = {
      grossPnl: computedSummaryStats.grossPnl,
      fees: computedSummaryStats.fees,
      netPnl: computedSummaryStats.netPnl,
      tradeCount: computedSummaryStats.tradeCount,
      winningTrades: computedSummaryStats.winCount,
      losingTrades: computedSummaryStats.lossCount,
      winRate: computedSummaryStats.winRate,
    };

    await tradeImport.save();

    return {
      importId: tradeImport._id,
      executionRowCount: executionDocuments.length,
      groupedTradeCount: groupedTrades.length,
      sourceSummary: tradeImport.sourceSummary,
      groupedTradeSummary: tradeImport.groupedTradeSummary,
      warnings: tradeImport.warnings,
    };
  } catch (error) {
    tradeImport.status = "FAILED";
    tradeImport.errorMessage =
      error instanceof Error ? error.message : "Unknown import error";
    await tradeImport.save();
    throw error;
  }
}

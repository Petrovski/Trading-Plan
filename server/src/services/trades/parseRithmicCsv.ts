import { parse } from "csv-parse/sync";
import type {
  ParsedProductSummary,
  ParsedRithmicCsvResult,
  ParsedRithmicExecution,
  TradeSide,
} from "./types";

function parseNumber(value: unknown): number {
  if (value == null || value === "") {
    return 0;
  }

  const normalizedValue = String(value)
    .replace(/,/g, "")
    .replace(/"/g, "")
    .trim();
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function parseOptionalNumber(value: unknown): number | undefined {
  if (value == null || value === "") {
    return undefined;
  }

  const normalizedValue = String(value)
    .replace(/,/g, "")
    .replace(/"/g, "")
    .trim();
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function normalizeSide(rawSide: string): TradeSide {
  return rawSide?.toUpperCase() === "B" ? "LONG" : "SHORT";
}

function parseDateTime(value: unknown): Date {
  const rawValue = String(value ?? "")
    .replace(/"/g, "")
    .trim();

  if (!rawValue) {
    throw new Error("Missing datetime value");
  }

  const match = rawValue.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
  );

  if (!match) {
    throw new Error(`Invalid datetime: ${rawValue}`);
  }

  const [, year, month, day, hour, minute, second] = match;

  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid datetime: ${rawValue}`);
  }

  return parsedDate;
}

function isAccountHeaderRow(row: string[]): boolean {
  return row[0] === "Account" && row[1] === "Trade P&L";
}

function isExecutionHeaderRow(row: string[]): boolean {
  return (
    row[0] === "Trade Date" &&
    row[1] === "Entry Order Number" &&
    row[2] === "Entry Buy/Sell" &&
    row[3] === "Entry Time"
  );
}

function isTradeDateRow(row: string[]): boolean {
  return /^\d{8}$/.test(row[0] ?? "");
}

function isLikelyProductSymbol(value: string): boolean {
  return /^[A-Z]{2,}\w*$/.test(value) && !/^\d+$/.test(value);
}

function isProductSummaryRow(row: string[]): boolean {
  if (!row[0]) {
    return false;
  }

  if (isAccountHeaderRow(row) || isExecutionHeaderRow(row)) {
    return false;
  }

  return (
    isLikelyProductSymbol(row[0]) &&
    row.length >= 7 &&
    !Number.isNaN(
      Number(
        String(row[1] ?? "")
          .replace(/,/g, "")
          .trim(),
      ),
    )
  );
}

function buildExecution(
  row: string[],
  rawRowIndex: number,
  product: string,
): ParsedRithmicExecution {
  if (row.length < 14) {
    throw new Error(`Execution row has too few columns: got ${row.length}`);
  }

  const [
    tradeDate,
    entryOrderNumber,
    entrySideRaw,
    entryTime,
    entryPrice,
    exitOrderNumber,
    exitSideRaw,
    exitTime,
    exitPrice,
    lifeSpanSeconds,
    fillSize,
    grossPnl,
    fees,
    netPnl,
    ticksMade,
  ] = row;

  return {
    product,
    tradeDate: tradeDate.trim(),
    entryOrderNumber: entryOrderNumber.trim(),
    entrySideRaw: entrySideRaw.trim(),
    side: normalizeSide(entrySideRaw.trim()),
    entryTime: parseDateTime(entryTime),
    entryPrice: parseNumber(entryPrice),
    exitOrderNumber: exitOrderNumber.trim(),
    exitSideRaw: exitSideRaw.trim(),
    exitTime: parseDateTime(exitTime),
    exitPrice: parseNumber(exitPrice),
    lifeSpanSeconds: parseNumber(lifeSpanSeconds),
    fillSize: parseNumber(fillSize),
    grossPnl: parseNumber(grossPnl),
    fees: parseNumber(fees),
    netPnl: parseNumber(netPnl),
    ticksMade: parseOptionalNumber(ticksMade),
    rawRowIndex,
  };
}

export function parseRithmicCsv(csvText: string): ParsedRithmicCsvResult {
  const parsedRows = parse(csvText, {
    relax_quotes: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as string[][];

  const warnings: string[] = [];
  const productSummaries: ParsedProductSummary[] = [];
  const executions: ParsedRithmicExecution[] = [];

  let account: string | undefined;
  let accountSummary = {
    grossPnl: 0,
    fees: 0,
    netPnl: 0,
    tradeCount: 0,
    winningTrades: 0,
    losingTrades: 0,
  };

  let currentProduct: string | undefined;
  let insideExecutionBlock = false;

  for (let rowIndex = 0; rowIndex < parsedRows.length; rowIndex += 1) {
    const row = parsedRows[rowIndex].map((value) =>
      String(value ?? "")
        .replace(/"/g, "")
        .trim(),
    );

    if (!row[0]) {
      continue;
    }

    if (isAccountHeaderRow(row)) {
      const nextRow = parsedRows[rowIndex + 1]?.map((value) =>
        String(value ?? "")
          .replace(/"/g, "")
          .trim(),
      );

      if (nextRow?.[0]) {
        account = nextRow[0];
        accountSummary = {
          grossPnl: parseNumber(nextRow[1]),
          fees: parseNumber(nextRow[2]),
          netPnl: parseNumber(nextRow[3]),
          tradeCount: parseNumber(nextRow[4]),
          winningTrades: parseNumber(nextRow[5]),
          losingTrades: parseNumber(nextRow[6]),
        };
      }

      continue;
    }

    if (isProductSummaryRow(row)) {
      currentProduct = row[0];
      insideExecutionBlock = false;

      productSummaries.push({
        product: row[0],
        grossPnl: parseNumber(row[1]),
        fees: parseNumber(row[2]),
        netPnl: parseNumber(row[3]),
        tradeCount: parseNumber(row[4]),
        winningTrades: parseNumber(row[5]),
        losingTrades: parseNumber(row[6]),
      });

      continue;
    }

    if (isExecutionHeaderRow(row)) {
      insideExecutionBlock = true;
      continue;
    }

    if (insideExecutionBlock && isTradeDateRow(row)) {
      if (!currentProduct) {
        warnings.push(
          `Skipping row ${rowIndex + 1}: execution row encountered before a product summary row`,
        );
        continue;
      }

      try {
        executions.push(buildExecution(row, rowIndex, currentProduct));
      } catch (error) {
        warnings.push(
          `Skipping row ${rowIndex + 1}: ${error instanceof Error ? error.message : "Unknown parse error"}`,
        );
      }

      continue;
    }
  }

  const sortedTradeDates = executions
    .map((execution) => execution.tradeDate)
    .sort();

  return {
    account,
    startDate: sortedTradeDates[0],
    endDate: sortedTradeDates[sortedTradeDates.length - 1],
    rawRowCount: parsedRows.length,
    executions,
    productSummaries,
    warnings,
    summary: {
      grossPnl: accountSummary.grossPnl,
      fees: accountSummary.fees,
      netPnl: accountSummary.netPnl,
      tradeCount: accountSummary.tradeCount,
      winningTrades: accountSummary.winningTrades,
      losingTrades: accountSummary.losingTrades,
      winRate:
        accountSummary.tradeCount > 0
          ? (accountSummary.winningTrades / accountSummary.tradeCount) * 100
          : 0,
    },
  };
}

import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const performanceSummarySchema = new Schema(
  {
    grossPnl: { type: Number, required: true, default: 0 },
    fees: { type: Number, required: true, default: 0 },
    netPnl: { type: Number, required: true, default: 0 },
    tradeCount: { type: Number, required: true, default: 0 },
    winningTrades: { type: Number, required: true, default: 0 },
    losingTrades: { type: Number, required: true, default: 0 },
    winRate: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const productSummarySchema = new Schema(
  {
    product: { type: String, required: true, trim: true },
    grossPnl: { type: Number, required: true, default: 0 },
    fees: { type: Number, required: true, default: 0 },
    netPnl: { type: Number, required: true, default: 0 },
    tradeCount: { type: Number, required: true, default: 0 },
    winningTrades: { type: Number, required: true, default: 0 },
    losingTrades: { type: Number, required: true, default: 0 },
    winRate: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const tradeImportSchema = new Schema(
  {
    source: { type: String, required: true, default: "RITHMIC", trim: true },
    fileName: { type: String, required: true, trim: true },
    account: { type: String, trim: true },

    importedAt: { type: Date, required: true, default: () => new Date() },

    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },

    rawRowCount: { type: Number, required: true, default: 0 },
    executionRowCount: { type: Number, required: true, default: 0 },
    groupedTradeCount: { type: Number, required: true, default: 0 },

    groupingVersion: { type: Number, required: true, default: 1 },

    sourceSummary: {
      type: performanceSummarySchema,
      required: true,
      default: () => ({}),
    },
    groupedTradeSummary: {
      type: performanceSummarySchema,
      required: true,
      default: () => ({}),
    },

    productSummaries: { type: [productSummarySchema], default: [] },

    warnings: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED", "FAILED"],
      required: true,
      default: "PROCESSING",
    },

    fileHash: { type: String, trim: true, index: true },

    errorMessage: { type: String, trim: true },
  },
  { timestamps: true },
);

tradeImportSchema.index({ importedAt: -1 });
tradeImportSchema.index({ status: 1, importedAt: -1 });
tradeImportSchema.index({ account: 1, importedAt: -1 });

export type TradeImportDocument = InferSchemaType<typeof tradeImportSchema> & {
  _id: Types.ObjectId;
};

export const TradeImport = model("TradeImport", tradeImportSchema);

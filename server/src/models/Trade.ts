import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const tradeJournalSchema = new Schema(
  {
    setupType: { type: String, trim: true },
    setupGrade: { type: String, trim: true },
    followedPlan: { type: Boolean },
    stopRespected: { type: Boolean },
    ruleViolation: { type: Boolean },
    notes: { type: String, trim: true },
    screenshotUrls: { type: [String], default: [] },
  },
  { _id: false },
);

const tradeSchema = new Schema(
  {
    importId: {
      type: Schema.Types.ObjectId,
      ref: "TradeImport",
      required: true,
      index: true,
    },

    product: { type: String, required: true, trim: true, index: true },
    tradeDate: { type: String, required: true, trim: true, index: true },

    entryOrderNumber: { type: String, required: true, trim: true, index: true },
    side: {
      type: String,
      enum: ["LONG", "SHORT"],
      required: true,
      index: true,
    },

    entryTime: { type: Date, required: true, index: true },
    exitTime: { type: Date, required: true },

    entryPrice: { type: Number, required: true },
    avgExitPrice: { type: Number, required: true },

    totalSize: { type: Number, required: true },
    executionCount: { type: Number, required: true },

    grossPnl: { type: Number, required: true, default: 0 },
    fees: { type: Number, required: true, default: 0 },
    netPnl: { type: Number, required: true, default: 0 },

    durationSeconds: { type: Number, default: 0 },

    executionIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "TradeExecution" }],
      default: [],
    },

    journal: { type: tradeJournalSchema, default: {} },
  },
  { timestamps: true },
);

tradeSchema.index({ importId: 1, tradeDate: 1, product: 1 });
tradeSchema.index({ importId: 1, entryTime: -1 });
tradeSchema.index({ importId: 1, netPnl: -1 });

export type TradeDocument = InferSchemaType<typeof tradeSchema> & {
  _id: Types.ObjectId;
};

export const Trade = model("Trade", tradeSchema);

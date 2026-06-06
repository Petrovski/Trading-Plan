import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const tradeExecutionSchema = new Schema(
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
    entrySideRaw: { type: String, required: true, trim: true },
    side: {
      type: String,
      enum: ["LONG", "SHORT"],
      required: true,
      index: true,
    },

    entryTime: { type: Date, required: true, index: true },
    entryPrice: { type: Number, required: true },

    exitOrderNumber: { type: String, required: true, trim: true },
    exitSideRaw: { type: String, required: true, trim: true },
    exitTime: { type: Date, required: true },
    exitPrice: { type: Number, required: true },

    lifeSpanSeconds: { type: Number, default: 0 },
    fillSize: { type: Number, required: true },
    grossPnl: { type: Number, required: true, default: 0 },
    fees: { type: Number, required: true, default: 0 },
    netPnl: { type: Number, required: true, default: 0 },

    ticksMade: { type: Number },

    rawRowIndex: { type: Number, required: true },
  },
  { timestamps: true },
);

tradeExecutionSchema.index({ importId: 1, product: 1, tradeDate: 1 });
tradeExecutionSchema.index({ importId: 1, entryOrderNumber: 1 });

export type TradeExecutionDocument = InferSchemaType<
  typeof tradeExecutionSchema
> & {
  _id: Types.ObjectId;
};

export const TradeExecution = model("TradeExecution", tradeExecutionSchema);

import { Schema, model, type InferSchemaType } from "mongoose";

const DailyPlanSchema = new Schema(
  {
    date: { type: Date, required: true },
    marketContext: { type: String, required: true },
    marketContextNotes: { type: String },
    nearestMCVPOC1: { type: String },
    nearestMCVPOC2: { type: String },
    yVPOC: { type: String },
    NVPOCs: { type: String },
    ONH: { type: String },
    ONL: { type: String },
    ONMID: { type: String },
    ONVPOC: { type: String },
  },
  { _id: false }
);

const TradingPlanSchema = new Schema(
  {
    title: { type: String, required: true },
    accountSize: { type: Number },
    maxDailyLossPct: { type: Number },
    riskPerTradePct: { type: Number },
    instruments: [{ type: String, default: [] }],
    rules: [{ type: String, default: [] }],
    notes: { type: String },

    daily: { type: DailyPlanSchema, required: true },
  },
  { timestamps: true }
);

export type TradingPlanDoc = InferSchemaType<typeof TradingPlanSchema> & {
  _id: string;
};
export const TradingPlanModel = model("TradingPlan", TradingPlanSchema);

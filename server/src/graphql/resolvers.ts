import { GraphQLScalarType, Kind } from "graphql";

import { z } from "zod";
import { TradingPlanModel } from "../models/TradingPlan";

const DailyPlanZ = z.object({
  date: z.coerce.date(),
  marketContext: z.string().min(1),
  marketContextNotes: z.string().optional(),
  nearestMCVPOC1: z.string().optional(),
  nearestMCVPOC2: z.string().optional(),
  yVPOC: z.string().optional(),
  NVPOCs: z.string().optional(),
  ONH: z.string().optional(),
  ONL: z.string().optional(),
  ONMID: z.string().optional(),
  ONVPOC: z.string().optional(),
});

const CreateTradingPlanZ = z.object({
  title: z.string().min(1),
  accountSize: z.number().optional(),
  maxDailyLossPct: z.number().optional(),
  riskPerTradePct: z.number().optional(),
  instruments: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  notes: z.string().optional(),
  daily: DailyPlanZ,
});

const mapDoc = (d: any) => ({
  id: d._id.toString(),
  title: d.title,
  accountSize: d.accountSize ?? null,
  maxDailyLossPct: d.maxDailyLossPct ?? null,
  riskPerTradePct: d.riskPerTradePct ?? null,
  instruments: d.instruments ?? [],
  rules: d.rules ?? [],
  notes: d.notes ?? null,
  daily: d.daily && {
    date: d.daily.date,
    marketContext: d.daily.marketContext,
    marketContextNotes: d.daily.marketContextNotes ?? null,
    nearestMCVPOC1: d.daily.nearestMCVPOC1 ?? null,
    nearestMCVPOC2: d.daily.nearestMCVPOC2 ?? null,
    yVPOC: d.daily.yVPOC ?? null,
    NVPOCs: d.daily.NVPOCs ?? null,
    ONH: d.daily.ONH ?? null,
    ONL: d.daily.ONL ?? null,
    ONMID: d.daily.ONMID ?? null,
    ONVPOC: d.daily.ONVPOC ?? null,
  },
  createdAt: d.createdAt,
  updatedAt: d.updatedAt,
});

export const resolvers = {
  Date: new GraphQLScalarType<Date, string>({
    name: "Date",
    serialize: (v) => (v as Date).toISOString(),
    parseValue: (v) => new Date(v as string),
    parseLiteral: (ast) => {
      if (ast.kind === Kind.STRING) return new Date(ast.value);
      throw new TypeError(
        `Date cannot represent non-string value: ${ast.kind}`
      );
    },
  }),

  Query: {
    health: () => "ok",
    async tradingPlans() {
      const docs = await TradingPlanModel.find().sort({ createdAt: -1 }).lean();
      return docs.map(mapDoc);
    },
    async tradingPlan(_: unknown, { id }: { id: string }) {
      const d = await TradingPlanModel.findById(id).lean();
      return d ? mapDoc(d) : null;
    },
  },

  Mutation: {
    async createTradingPlan(_: unknown, { input }: { input: unknown }) {
      console.log("[createTradingPlan] input:", JSON.stringify(input));
      try {
        const parsed = CreateTradingPlanZ.parse(input);
        const doc = await TradingPlanModel.create(parsed);
        console.log("[createTradingPlan] created _id:", doc._id.toString());
        return mapDoc(doc.toObject());
      } catch (err) {
        console.error("[createTradingPlan] error:", err);
        throw err; // surfaces to GraphQL response
      }
    },

    async updateTradingPlan(
      _: unknown,
      { id, input }: { id: string; input: any }
    ) {
      try {
        // (Optional) validate here too if you want strictness on updates
        const updated = await TradingPlanModel.findByIdAndUpdate(id, input, {
          new: true,
        }).lean();
        if (!updated) throw new Error("Not found");
        return mapDoc(updated);
      } catch (err) {
        console.error("[updateTradingPlan] error:", err);
        throw err;
      }
    },

    async deleteTradingPlan(_: unknown, { id }: { id: string }) {
      const r = await TradingPlanModel.findByIdAndDelete(id);
      return !!r;
    },
  },
};

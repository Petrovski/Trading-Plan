import { gql } from "graphql-tag";

export const typeDefs = gql/* GraphQL */ `
  scalar Date

  type DailyPlan {
    date: Date!
    marketContext: String!
    marketContextNotes: String
    nearestMCVPOC1: String
    nearestMCVPOC2: String
    yVPOC: String
    NVPOCs: String
    ONH: String
    ONL: String
    ONMID: String
    ONVPOC: String
  }

  input DailyPlanInput {
    date: Date!
    marketContext: String!
    marketContextNotes: String
    nearestMCVPOC1: String
    nearestMCVPOC2: String
    yVPOC: String
    NVPOCs: String
    ONH: String
    ONL: String
    ONMID: String
    ONVPOC: String
  }

  type TradingPlan {
    id: ID!
    title: String!
    accountSize: Float
    maxDailyLossPct: Float
    riskPerTradePct: Float
    instruments: [String!]!
    rules: [String!]!
    notes: String
    daily: DailyPlan!
    createdAt: Date!
    updatedAt: Date!
  }

  input TradingPlanCreateInput {
    title: String!
    accountSize: Float
    maxDailyLossPct: Float
    riskPerTradePct: Float
    instruments: [String!]
    rules: [String!]
    notes: String
    daily: DailyPlanInput! # <-- required
  }

  input TradingPlanUpdateInput {
    title: String
    accountSize: Float
    maxDailyLossPct: Float
    riskPerTradePct: Float
    instruments: [String!]
    rules: [String!]
    notes: String
    daily: DailyPlanInput
  }

  type Query {
    health: String!
    tradingPlans: [TradingPlan!]!
    tradingPlan(id: ID!): TradingPlan
  }

  type Mutation {
    createTradingPlan(input: TradingPlanCreateInput!): TradingPlan!
    updateTradingPlan(id: ID!, input: TradingPlanUpdateInput!): TradingPlan!
    deleteTradingPlan(id: ID!): Boolean!
  }
`;

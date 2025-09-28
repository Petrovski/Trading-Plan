import { gql } from "@apollo/client";

export const TRADING_PLANS = gql`
  query TradingPlans {
    tradingPlans {
      id
      title
      accountSize
      maxDailyLossPct
      riskPerTradePct
      instruments
      rules
      notes
      daily {
        date
        marketContext
      }
      createdAt
      updatedAt
    }
  }
`;

export const TRADING_PLAN = gql`
  query TradingPlan($id: ID!) {
    tradingPlan(id: $id) {
      id
      title
      accountSize
      maxDailyLossPct
      riskPerTradePct
      instruments
      rules
      notes
      daily {
        date
        marketContext
        marketContextNotes
        nearestMCVPOC1
        nearestMCVPOC2
        yVPOC
        NVPOCs
        ONH
        ONL
        ONMID
        ONVPOC
      }
      createdAt
      updatedAt
    }
  }
`;

import { gql } from "@apollo/client";

export const CREATE_TRADING_PLAN = gql`
  mutation CreateTradingPlan($input: TradingPlanCreateInput!) {
    createTradingPlan(input: $input) {
      id
      title
      daily {
        date
        marketContext
      }
      createdAt
    }
  }
`;

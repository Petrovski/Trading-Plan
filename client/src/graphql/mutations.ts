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

export const UPDATE_TRADING_PLAN = gql`
  mutation UpdateTradingPlan($id: ID!, $input: TradingPlanUpdateInput!) {
    updateTradingPlan(id: $id, input: $input) {
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

export const DELETE_TRADING_PLAN = gql`
  mutation DeleteTradingPlan($id: ID!) {
    deleteTradingPlan(id: $id) {
      id
    }
  }
`;

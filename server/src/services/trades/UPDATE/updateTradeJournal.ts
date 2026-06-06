import { Trade } from "../../../models/Trade";

type UpdateTradeJournalParams = {
  tradeId: string;
  journal: {
    setupType?: string;
    setupGrade?: string;
    followedPlan?: boolean;
    stopRespected?: boolean;
    ruleViolation?: boolean;
    notes?: string;
    screenshotUrls?: string[];
  };
};

export async function updateTradeJournal({
  tradeId,
  journal,
}: UpdateTradeJournalParams) {
  return Trade.findByIdAndUpdate(
    tradeId,
    {
      $set: {
        journal,
      },
    },
    { new: true },
  ).lean();
}

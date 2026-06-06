import { TradeImport } from "../../../models/TradeImport";
import { TradeExecution } from "../../../models/TradeExecution";
import { Trade } from "../../../models/Trade";

export async function deleteImportById(importId: string) {
  const importRecord = await TradeImport.findById(importId);

  if (!importRecord) {
    return null;
  }

  await Promise.all([
    Trade.deleteMany({ importId }),
    TradeExecution.deleteMany({ importId }),
    TradeImport.findByIdAndDelete(importId),
  ]);

  return {
    deletedImportId: importId,
  };
}

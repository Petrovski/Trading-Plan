import { TradeImport } from "../../../models/TradeImport";

export async function getImportById(importId: string) {
  return TradeImport.findById(importId).lean();
}

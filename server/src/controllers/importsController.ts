import type { Request, Response } from "express";
import { importRithmicCsv } from "../services/trades/importRithmicCsv";
import { TradeImport } from "../models/TradeImport";
import { getImportById } from "../services/imports/GET/getImportById";
import { deleteImportById } from "../services/imports/DELETE/deleteImportById";

export async function uploadRithmicImport(
  request: Request,
  response: Response,
) {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "CSV file is required." });
    }

    const csvText = request.file.buffer.toString("utf-8");

    const result = await importRithmicCsv({
      fileName: request.file.originalname,
      csvText,
    });

    console.log("IMPORT RESULT", result);

    return response.status(201).json(result);
  } catch (error) {
    console.error("uploadRithmicImport error", error);
    return response.status(500).json({
      message: error instanceof Error ? error.message : "Failed to import CSV.",
    });
  }
}

export async function listImports(_request: Request, response: Response) {
  try {
    const imports = await TradeImport.find().sort({ importedAt: -1 }).lean();
    return response.json(imports);
  } catch (error) {
    console.error("listImports error", error);
    return response.status(500).json({ message: "Failed to fetch imports." });
  }
}

export async function getImport(request: Request, response: Response) {
  try {
    const importRecord = await getImportById(request.params.importId);

    if (!importRecord) {
      return response.status(404).json({ message: "Import not found." });
    }

    return response.json(importRecord);
  } catch (error) {
    console.error("getImport error", error);
    return response.status(500).json({ message: "Failed to fetch import." });
  }
}

export async function deleteImport(request: Request, response: Response) {
  try {
    const result = await deleteImportById(request.params.importId);

    if (!result) {
      return response.status(404).json({ message: "Import not found." });
    }

    return response.json(result);
  } catch (error) {
    console.error("deleteImport error", error);
    return response.status(500).json({ message: "Failed to delete import." });
  }
}

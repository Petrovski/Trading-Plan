import { Router } from "express";
import multer from "multer";
import {
  deleteImport,
  getImport,
  listImports,
  uploadRithmicImport,
} from "../controllers/importsController";

const upload = multer({ storage: multer.memoryStorage() });

export const importRoutes = Router();

importRoutes.get("/", listImports);
importRoutes.get("/:importId", getImport);
importRoutes.delete("/:importId", deleteImport);
importRoutes.post("/rithmic", upload.single("file"), uploadRithmicImport);

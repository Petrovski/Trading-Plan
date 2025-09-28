import { create } from "zustand";
import dayjs, { Dayjs } from "dayjs";

export type PlanState = {
  // Plan-level
  title: string;
  accountSize: string;
  maxDailyLossPct: string;
  riskPerTradePct: string;
  instruments: string[];
  rules: string[];
  notes: string;

  // Daily
  date: Dayjs;
  marketContext: string;
  marketContextNotes: string;
  nearestMCVPOC1: string;
  nearestMCVPOC2: string;
  yVPOC: string;
  NVPOCs: string;
  ONH: string;
  ONL: string;
  ONMID: string;
  ONVPOC: string;

  // Actions
  set<K extends keyof PlanState>(key: K, value: PlanState[K]): void;
  setMany(values: Partial<PlanState>): void;
  reset(): void;
};

const initial: Omit<PlanState, "set" | "setMany" | "reset"> = {
  title: "",
  accountSize: "",
  maxDailyLossPct: "",
  riskPerTradePct: "",
  instruments: [],
  rules: [],
  notes: "",

  date: dayjs(),
  marketContext: "",
  marketContextNotes: "",
  nearestMCVPOC1: "",
  nearestMCVPOC2: "",
  yVPOC: "",
  NVPOCs: "",
  ONH: "",
  ONL: "",
  ONMID: "",
  ONVPOC: "",
};

export const usePlanStore = create<PlanState>((set) => ({
  ...initial,
  set: (key, value) => set({ [key]: value } as any),
  setMany: (values) => set(values),
  reset: () => set({ ...initial }),
}));

import { useMutation } from "@apollo/client/react";
import { Box, Button, Typography, Alert, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import { usePlanStore } from "../store/tradingPlanStore";
import { gql } from "@apollo/client";
import { FieldRow } from "./FieldRow";

const CREATE_TRADING_PLAN = gql`
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

export default function ReviewAndSave({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const store = usePlanStore();

  interface CreateTradingPlanResult {
    createTradingPlan?: {
      id: string;
      title: string;
      daily: { date: string; marketContext: string };
      createdAt: string;
    };
  }

  const [create, { loading, error, data }] =
    useMutation<CreateTradingPlanResult>(CREATE_TRADING_PLAN, {
      errorPolicy: "all",
    });

  // --- helpers
  const dash = "—";
  const fmtNum = (v?: string) =>
    v && v.trim().length ? Number(v).toLocaleString() : dash;
  const fmtPct = (v?: string) =>
    v && v.trim().length ? `${Number(v)}%` : dash;
  const fmtStr = (v?: string) => (v && v.trim().length ? v : dash);

  const save = async () => {
    const toNum = (v?: string) =>
      v && v.trim().length ? Number(v) : undefined;

    const input = {
      title: store.title.trim(),
      ...(toNum(store.accountSize) !== undefined && {
        accountSize: toNum(store.accountSize),
      }),
      ...(toNum(store.maxDailyLossPct) !== undefined && {
        maxDailyLossPct: toNum(store.maxDailyLossPct),
      }),
      ...(toNum(store.riskPerTradePct) !== undefined && {
        riskPerTradePct: toNum(store.riskPerTradePct),
      }),
      instruments: store.instruments,
      rules: store.rules,
      notes: store.notes || undefined,
      daily: {
        date: store.date.toDate().toISOString(),
        marketContext: store.marketContext,
        marketContextNotes: store.marketContextNotes || undefined,
        nearestMCVPOC1: store.nearestMCVPOC1 || undefined,
        nearestMCVPOC2: store.nearestMCVPOC2 || undefined,
        yVPOC: store.yVPOC || undefined,
        NVPOCs: store.NVPOCs || undefined,
        ONH: store.ONH || undefined,
        ONL: store.ONL || undefined,
        ONMID: store.ONMID || undefined,
        ONVPOC: store.ONVPOC || undefined,
      },
    };

    const res = await create({ variables: { input } });
    if (res.data?.createTradingPlan?.id) {
      usePlanStore.getState().reset();
      onNext();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }} align="center">
        Review & Save
      </Typography>

      {/* Plan-level summary */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Account Parameters
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Title" value={fmtStr(store.title)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Account Size" value={fmtNum(store.accountSize)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow
            label="Max Daily Loss"
            value={fmtPct(store.maxDailyLossPct)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow
            label="Risk per Trade"
            value={fmtPct(store.riskPerTradePct)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Notes" value={fmtStr(store.notes)} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 1.5 }} />

      {/* Daily summary */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Daily Plan
      </Typography>

      {/* Row 1: date/context | notes */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Date" value={store.date.format("YYYY-MM-DD")} />
          <FieldRow
            label="Market Context"
            value={fmtStr(store.marketContext)}
          />
        </Grid>
      </Grid>

      {/* Row 2: key levels | overnight levels */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Key Levels
          </Typography>
          <FieldRow
            label="Nearest MCVPOC 1"
            value={fmtStr(store.nearestMCVPOC1)}
          />
          <FieldRow
            label="Nearest MCVPOC 2"
            value={fmtStr(store.nearestMCVPOC2)}
          />
          <FieldRow label="yVPOC" value={fmtStr(store.yVPOC)} />
          <FieldRow label="NVPOCs" value={fmtStr(store.NVPOCs)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Overnight Levels
          </Typography>
          <FieldRow label="ONH" value={fmtStr(store.ONH)} />
          <FieldRow label="ONL" value={fmtStr(store.ONL)} />
          <FieldRow label="ONMID" value={fmtStr(store.ONMID)} />
          <FieldRow label="ONVPOC" value={fmtStr(store.ONVPOC)} />
        </Grid>
      </Grid>

      {/* Row 3: market context notes */}
      <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 4 }}>
        <FieldRow
          label="Market Context Notes"
          value={fmtStr(store.marketContextNotes)}
        />
      </Grid>

      {/* Errors / success */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}
      {data?.createTradingPlan?.id && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Trading plan saved! View your plans by
        </Alert>
      )}

      {/* Actions */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" disabled={loading} onClick={save}>
          {loading ? "Saving…" : "Save Trading Plan"}
        </Button>
      </Box>
    </Box>
  );
}

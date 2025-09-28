import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { TRADING_PLAN } from "../graphql/queries";
import {
  Box,
  Button,
  Divider,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import type { TradingPlanQueryResult } from "../types";
import { FieldRow } from "./FieldRow";

// formatting helpers to mirror Review view
const dash = "—";
const fmtStr = (v?: string | null) => (v && v.trim().length ? v : dash);
const fmtNum = (v?: number | null | string) => {
  if (typeof v === "number") return v.toLocaleString();
  if (typeof v === "string" && v.trim()) return Number(v).toLocaleString();
  return dash;
};
const fmtPct = (v?: number | null | string) => {
  if (typeof v === "number") return `${v}%`;
  if (typeof v === "string" && v.trim()) return `${Number(v)}%`;
  return dash;
};

export default function PlanDetails() {
  const { id } = useParams();

  const { data, loading, error } = useQuery<TradingPlanQueryResult>(
    TRADING_PLAN,
    {
      variables: { id: id! },
      skip: !id, // wait for :id
    }
  );

  if (!id) return <Typography color="error">Missing plan id.</Typography>;

  if (loading)
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!data?.tradingPlan) return <Typography>Not found.</Typography>;

  const p = data.tradingPlan;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }} align="center">
        Trading Plan
      </Typography>

      {/* Top actions */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button component={RouterLink} to="/plans" variant="outlined">
          Back to list
        </Button>
      </Box>

      {/* Plan-level summary */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Account Parameters
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Title" value={fmtStr(p.title)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Account Size" value={fmtNum(p.accountSize)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Max Daily Loss" value={fmtPct(p.maxDailyLossPct)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Risk per Trade" value={fmtPct(p.riskPerTradePct)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow label="Notes" value={fmtStr(p.notes ?? undefined)} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 1.5 }} />

      {/* Daily summary */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Daily Plan
      </Typography>

      {/* Row 1: date/context */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldRow
            label="Date"
            value={
              p.daily?.date ? dayjs(p.daily.date).format("YYYY-MM-DD") : dash
            }
          />
          <FieldRow
            label="Market Context"
            value={fmtStr(p.daily?.marketContext)}
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
            value={fmtStr(p.daily?.nearestMCVPOC1)}
          />
          <FieldRow
            label="Nearest MCVPOC 2"
            value={fmtStr(p.daily?.nearestMCVPOC2)}
          />
          <FieldRow label="yVPOC" value={fmtStr(p.daily?.yVPOC)} />
          <FieldRow
            label="NVPOCs"
            value={fmtStr(
              Array.isArray(p.daily?.NVPOCs)
                ? p.daily.NVPOCs.join(", ")
                : p.daily?.NVPOCs
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Overnight Levels
          </Typography>
          <FieldRow label="ONH" value={fmtStr(p.daily?.ONH)} />
          <FieldRow label="ONL" value={fmtStr(p.daily?.ONL)} />
          <FieldRow label="ONMID" value={fmtStr(p.daily?.ONMID)} />
          <FieldRow label="ONVPOC" value={fmtStr(p.daily?.ONVPOC)} />
        </Grid>
      </Grid>

      {/* Row 3: market context notes */}
      <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 4 }}>
        <FieldRow
          label="Market Context Notes"
          value={fmtStr(p.daily?.marketContextNotes)}
        />
      </Grid>
    </Box>
  );
}

import Grid from "@mui/material/Grid";
import { Box, Button, TextField, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { usePlanStore } from "../store/tradingPlanStore";

export default function AccountParametersForm({
  onNext,
}: {
  onNext: () => void;
}) {
  const {
    title,
    accountSize,
    maxDailyLossPct,
    riskPerTradePct,
    instruments,
    rules,
    notes,
    set,
  } = usePlanStore();

  const valid = title.trim().length > 0;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Account Parameters
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Account Size"
            fullWidth
            inputMode="decimal"
            value={accountSize}
            onChange={(e) => set("accountSize", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Max Daily Loss (%)"
            fullWidth
            inputMode="decimal"
            value={maxDailyLossPct}
            onChange={(e) => set("maxDailyLossPct", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Risk per Trade (%)"
            fullWidth
            inputMode="decimal"
            value={riskPerTradePct}
            onChange={(e) => set("riskPerTradePct", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={instruments}
            onChange={(_, v) => set("instruments", v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Instruments"
                placeholder="Type and press Enter"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={rules}
            onChange={(_, v) => set("rules", v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rules"
                placeholder="Type and press Enter"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Notes"
            fullWidth
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" disabled={!valid} onClick={onNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

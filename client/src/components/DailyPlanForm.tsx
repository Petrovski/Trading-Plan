import Grid from "@mui/material/Grid";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { usePlanStore } from "../store/tradingPlanStore";

export default function DailyPlanForm({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const store = usePlanStore();
  const requiredOk = !!store.marketContext && !!store.date;

  const marketContexts = [
    { value: "up", label: "Up" },
    { value: "down", label: "Down" },
    { value: "sideways", label: "Sideways" },
    { value: "sideways-lean-up", label: "Sideways Lean Up" },
    { value: "sideways-lean-down", label: "Sideways Lean Down" },
    { value: "trending", label: "Trending" },
  ];

  const vpocLevels = [
    { value: "nearestMCVPOC1", label: "Nearest MCVPOC Level 1" },
    { value: "nearestMCVPOC2", label: "Nearest MCVPOC Level 2" },
    { value: "yVPOC", label: "yVPOC" },
    { value: "NVPOCs", label: "NVPOCs" },
  ];

  const overnightLevels = [
    { value: "ONH", label: "ONH" },
    { value: "ONL", label: "ONL" },
    { value: "ONMID", label: "ONMID" },
    { value: "ONVPOC", label: "ONVPOC" },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Daily Plan
      </Typography>

      {/* Row 1: Date + Context | Notes */}
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Date"
            value={store.date}
            onChange={(d) => d && store.set("date", d)}
            slotProps={{ textField: { required: true, fullWidth: true } }}
          />
          <TextField
            sx={{ mt: 4 }}
            select
            fullWidth
            required
            label="Market Context"
            value={store.marketContext}
            onChange={(e) => store.set("marketContext", e.target.value)}
          >
            {marketContexts.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Market Context Notes"
            fullWidth
            multiline
            minRows={5}
            value={store.marketContextNotes}
            onChange={(e) => store.set("marketContextNotes", e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Row 2: Key Levels | Overnight Levels */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
            Key Levels
          </Typography>
          <Grid container spacing={1.25}>
            {vpocLevels.map(({ value, label }) => (
              <Grid key={value} size={{ xs: 12 }}>
                <TextField
                  label={label}
                  fullWidth
                  value={(store as any)[value]}
                  onChange={(e) => store.set(value as any, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
            Overnight Levels
          </Typography>
          <Grid container spacing={1.25}>
            {overnightLevels.map(({ value, label }) => (
              <Grid key={value} size={{ xs: 12 }}>
                <TextField
                  label={label}
                  fullWidth
                  value={(store as any)[value]}
                  onChange={(e) => store.set(value as any, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext} disabled={!requiredOk}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

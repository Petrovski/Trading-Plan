import { Grid, Typography } from "@mui/material";

export const FieldRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Grid container alignItems="baseline">
    <Grid size={{ xs: 12, sm: 8, md: 4 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, sm: 8, md: 8 }}>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  </Grid>
);

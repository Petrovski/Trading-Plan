import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Page not found
      </Typography>
      <Button variant="contained" component={RouterLink} to="/plans">
        Go to Plans
      </Button>
    </Box>
  );
}

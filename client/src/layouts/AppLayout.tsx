import { Link as RouterLink, NavLink, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

const NavButton = ({ to, label }: { to: string; label: string }) => (
  <Button
    color="inherit"
    component={NavLink}
    to={to}
    sx={{
      fontWeight: 500,
      opacity: 0.85,
      "&.nav-btn-active": {
        fontWeight: 700,
        opacity: 1,
      },
    }}
  >
    {label}
  </Button>
);

export default function AppLayout() {
  return (
    <Box className="min-h-screen bg-slate-50">
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/plans"
            style={{
              color: "inherit",
              textDecoration: "none",
              marginRight: 16,
            }}
          >
            Trading Plan
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <NavButton to="/plans" label="Plans" />
          <NavButton to="/plans/new" label="New Plan" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

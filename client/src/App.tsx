import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TradingPlanWizard from "./components/TradingPlanWizard";

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Container maxWidth="md" className="py-10">
        <Typography variant="h3" align="center">
          Daily Trading Plan
        </Typography>
        <TradingPlanWizard />
      </Container>
    </main>
  );
}

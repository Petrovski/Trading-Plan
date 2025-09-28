import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import CreateTradingPlanWizard from "./components/TradingPlanWizard";
import PlansList from "./components/PlansList";
import PlanDetails from "./components/PlanDetails";
import NotFound from "./pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/plans" replace />} />
        <Route path="plans" element={<PlansList />} />
        <Route path="plans/new" element={<CreateTradingPlanWizard />} />
        <Route path="plans/:id" element={<PlanDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

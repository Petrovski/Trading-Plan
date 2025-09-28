import { useState } from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import AccountParametersForm from "./AccountParamatersForm";
import DailyPlanForm from "./DailyPlanForm";
import ReviewAndSave from "./ReviewAndSave";

export default function TradingPlanWizard() {
  const [active, setActive] = useState(0);
  const next = () => setActive((s) => Math.min(s + 1, 2));
  const back = () => setActive((s) => Math.max(s - 1, 0));
  const steps = [
    "Account Parameters",
    "Market Context & Levels",
    "Review & Save",
  ];

  return (
    <Box>
      <Stepper activeStep={active} sx={{ mb: 4, mt: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {active === 0 && <AccountParametersForm onNext={next} />}
      {active === 1 && <DailyPlanForm onBack={back} onNext={next} />}
      {active === 2 && <ReviewAndSave onBack={back} onNext={next} />}
    </Box>
  );
}

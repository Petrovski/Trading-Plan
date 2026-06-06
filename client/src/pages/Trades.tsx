import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTradesStore } from "../store/tradesStore";
import TradesSummaryCards from "../components/trades/TradesSummaryCards";
import TradesDailyChart from "../components/trades/TradesDailyChart";
import TradesTable from "../components/trades/TradesTable";

export default function Trades() {
  const {
    imports,
    selectedImportId,
    loadImports,
    selectImport,
    summary,
    dailyStats,
    trades,
  } = useTradesStore();

  useEffect(() => {
    loadImports();
  }, []);

  useEffect(() => {
    if (imports.length && !selectedImportId) {
      selectImport(imports[0]._id);
    }
  }, [imports]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Trades
      </Typography>

      {summary && <TradesSummaryCards summary={summary} />}

      <Box mt={4}>
        <TradesDailyChart data={dailyStats} />
      </Box>

      <Box mt={4}>
        <TradesTable trades={trades} />
      </Box>
    </Box>
  );
}

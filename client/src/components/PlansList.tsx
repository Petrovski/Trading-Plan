import { useQuery } from "@apollo/client/react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { TRADING_PLANS } from "../graphql/queries";
import type { TradingPlanRow, TradingPlansQueryResult } from "../types";

export default function PlansList() {
  const { data, loading, error } = useQuery<TradingPlansQueryResult>(
    TRADING_PLANS,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const navigate = useNavigate();

  const columns: GridColDef<TradingPlanRow>[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      valueGetter: (_value, row) =>
        row?.daily?.date ? dayjs(row.daily.date).format("MM-DD-YYYY") : "—",
    },
    { field: "title", headerName: "Title", flex: 1, minWidth: 200 },
    {
      field: "context",
      headerName: "Context",
      width: 140,
      valueGetter: (_value, row) => row?.daily?.marketContext ?? "—",
    },
    {
      field: "accountSize",
      headerName: "Account Size",
      width: 120,
    },
    { field: "maxDailyLossPct", headerName: "Max Loss %", width: 110 },
    { field: "riskPerTradePct", headerName: "Risk/Trade %", width: 120 },
    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      renderCell: (p) => (
        <Button
          size="small"
          variant="outlined"
          component={RouterLink}
          to={`/plans/${p.row.id}`}
        >
          View
        </Button>
      ),
    },
  ];

  const mapRows = (): TradingPlanRow[] => {
    return data?.tradingPlans
      ? data.tradingPlans.map((plan) => ({
          ...plan,
          daily: plan.daily
            ? {
                ...plan.daily,
                date:
                  typeof plan.daily.date === "string"
                    ? plan.daily.date
                    : plan.daily.date instanceof Date
                    ? plan.daily.date.toISOString()
                    : undefined,
              }
            : undefined,
        }))
      : [];
  };

  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="h5">Trading Plans</Typography>
        <Button variant="contained" onClick={() => navigate("/plans/new")}>
          New Plan
        </Button>
      </Box>

      <div style={{ height: 560, width: "100%" }}>
        <DataGrid
          density="compact"
          columns={columns}
          rows={mapRows()}
          loading={loading}
          getRowId={(r) => r.id}
          disableRowSelectionOnClick
          onRowDoubleClick={(p) => navigate(`/plans/${p.id}`)}
        />
      </div>
    </Box>
  );
}

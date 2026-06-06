import { DataGrid } from "@mui/x-data-grid";

type Props = {
  trades: any[];
};

export default function TradesTable({ trades }: Props) {
  const columns = [
    {
      field: "tradeDate",
      headerName: "Date",
      width: 110,
    },
    {
      field: "product",
      headerName: "Product",
      width: 120,
      // Add blue color for MES and Gold color for MGC
      renderCell: (params: any) => {
        if (params.value.includes("MES")) {
          return <span style={{ color: "dodgerblue" }}>{params.value}</span>;
        } else if (params.value.includes("MGC")) {
          return <span style={{ color: "darkgoldenrod" }}>{params.value}</span>;
        }
        return params.value;
      },
    },
    {
      field: "side",
      headerName: "Side",
      width: 100,
      // Add color formatting for buy/sell
      renderCell: (params: any) => (
        <span
          style={{ color: params.value === "LONG" ? "darkgreen" : "darkred" }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "entryPrice",
      headerName: "Entry",
      width: 120,
    },
    {
      field: "avgExitPrice",
      headerName: "Exit",
      width: 120,
    },
    {
      field: "totalSize",
      headerName: "Size",
      width: 100,
    },
    {
      field: "netPnl",
      headerName: "Net PnL",
      width: 140,
      // Add color formatting for positive/negative PnL
      renderCell: (params: any) => (
        <span style={{ color: params.value >= 0 ? "green" : "red" }}>
          {params.value.toFixed(2)}
        </span>
      ),
    },
    {
      field: "durationSeconds",
      headerName: "Duration",
      width: 130,
      // Format duration in HH:MM:SS
      renderCell: (params: any) => {
        const seconds = params.value;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      },
    },
  ];

  return (
    <DataGrid
      rows={trades}
      columns={columns}
      getRowId={(row) => row._id}
      pageSizeOptions={[25, 50, 100]}
    />
  );
}

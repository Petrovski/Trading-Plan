import { Grid, Card, CardContent, Typography } from "@mui/material";

type Props = {
  summary: any;
};

export default function TradesSummaryCards({ summary }: Props) {
  const cards = [
    { label: "Net PnL", value: summary.netPnl },
    { label: "Trades", value: summary.tradeCount },
    { label: "Win Rate", value: `${summary.winRate.toFixed(1)}%` },
    { label: "Fees", value: summary.fees },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.label} size={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">{card.label}</Typography>
              <Typography variant="h5">{card.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

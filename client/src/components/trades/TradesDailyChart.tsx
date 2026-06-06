import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: any[];
};

export default function TradesDailyChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="tradeDate" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="netPnl" />
      </BarChart>
    </ResponsiveContainer>
  );
}

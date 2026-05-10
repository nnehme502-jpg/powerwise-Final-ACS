import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function EnergyChart({ data = [] }) {
  const chartData = (data || []).map((item) => ({
    ...item,
    date: item.date || item.time || "Today",
    total_energy_kwh: Number(
      item.total_energy_kwh ?? item.energy ?? item.value ?? 0
    ),
  }));

  return (
    <div className="chart-card large">
      <div className="card-header">
        <div>
          <h3>Energy Usage Trend</h3>
          <p>Daily energy consumption</p>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#23e5d8" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#23e5d8" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#16332f" vertical={false} />
            <XAxis dataKey="date" stroke="#7fa39d" />
            <YAxis stroke="#7fa39d" />
            <Tooltip
              contentStyle={{
                background: "#0f211f",
                border: "1px solid #1d4540",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="total_energy_kwh"
              stroke="#23e5d8"
              fill="url(#energyFill)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
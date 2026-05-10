import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function RoomBarChart({ data = [] }) {
  const chartData = (data || []).map((item) => ({
    ...item,
    name: item.name || item.room || "Room",
    total_energy_kwh: Number(
      item.total_energy_kwh ?? item.energy ?? item.value ?? 0
    ),
  }));

  return (
    <div className="chart-card">
      <div className="card-header">
        <div>
          <h3>Usage by Room</h3>
          <p>Energy grouped by room</p>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#16332f" vertical={false} />
            <XAxis dataKey="name" stroke="#7fa39d" />
            <YAxis stroke="#7fa39d" />
            <Tooltip
              contentStyle={{
                background: "#0f211f",
                border: "1px solid #1d4540",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Bar
              dataKey="total_energy_kwh"
              fill="#23e5d8"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
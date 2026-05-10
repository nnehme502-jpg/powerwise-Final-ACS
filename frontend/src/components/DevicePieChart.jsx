import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#23e5d8", "#4f9cff", "#ff9f43", "#b77dff", "#5cd68a", "#ff6b81"];

export default function DevicePieChart({ data = [] }) {
  const chartData = (data || []).map((item) => ({
    ...item,
    name: item.name || item.device_name || "Device",
    total_energy_kwh: Number(
      item.total_energy_kwh ?? item.energy ?? item.value ?? 0
    ),
  }));

  return (
    <div className="chart-card">
      <div className="card-header">
        <div>
          <h3>Usage by Device</h3>
          <p>Energy breakdown by appliance</p>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total_energy_kwh"
              nameKey="name"
              outerRadius={100}
              innerRadius={55}
              paddingAngle={3}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.id || entry.name || index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#0f211f",
                border: "1px solid #1d4540",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
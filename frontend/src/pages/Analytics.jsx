import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import DevicePieChart from "../components/DevicePieChart";
import RoomBarChart from "../components/RoomBarChart";
import api from "../api/axios";

export default function Analytics() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalEnergy: 0,
    dailyCost: 0,
    usageTime: 0,
  });

  const [periodData, setPeriodData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [summaryRes, periodRes, deviceRes, roomRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/by-period"),
        api.get("/dashboard/by-device"),
        api.get("/dashboard/by-room"),
      ]);

      setSummary({
        totalEnergy: Number(
          summaryRes.data.totalEnergy ?? summaryRes.data.total_energy_kwh ?? 0
        ),
        dailyCost: Number(
          summaryRes.data.dailyCost ??
            summaryRes.data.total_estimated_cost ??
            0
        ),
        usageTime: Number(
          summaryRes.data.usageTime ?? summaryRes.data.total_hours_used ?? 0
        ),
      });

      setPeriodData(periodRes.data || []);
      setDeviceData(deviceRes.data || []);
      setRoomData(roomRes.data || []);
    } catch (err) {
      console.error("Analytics load error:", err);
    }
  };

  const highestRoom =
    roomData.length > 0
      ? [...roomData].sort(
          (a, b) =>
            Number(b.total_energy_kwh || 0) -
            Number(a.total_energy_kwh || 0)
        )[0]
      : null;

  const highestDevice =
    deviceData.length > 0
      ? [...deviceData].sort(
          (a, b) =>
            Number(b.total_energy_kwh || 0) -
            Number(a.total_energy_kwh || 0)
        )[0]
      : null;

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="page-header">
          <div>
            <h1>Energy Optimization Insights</h1>
            <p>Full estimated energy usage from all registered devices.</p>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            title="Total Energy"
            value={`${Number(summary.totalEnergy || 0).toFixed(2)} kWh`}
            subtitle="All devices estimated usage"
          />

          <StatCard
            title="Estimated Cost"
            value={`$${Number(summary.dailyCost || 0).toFixed(2)}`}
            subtitle="Projected household spend"
          />

          <StatCard
            title="Runtime"
            value={`${Number(summary.usageTime || 0).toFixed(1)} hrs`}
            subtitle="Total estimated runtime"
          />
        </section>

        <section className="charts-grid">
          <EnergyChart data={periodData} />
        </section>

        <section className="bottom-grid">
          <DevicePieChart data={deviceData} />
          <RoomBarChart data={roomData} />
        </section>

        <section className="recommend-grid">
          <div className="recommend-card success">
            <h3>Highest Usage Device</h3>
            <p>
              {highestDevice
                ? `${highestDevice.name} contributes the largest share of estimated household energy use.`
                : "Device analytics will appear when device data is available."}
            </p>

            <button type="button" onClick={() => navigate("/devices")}>
              Optimize Device
            </button>
          </div>

          <div className="recommend-card info">
            <h3>Highest Usage Room</h3>
            <p>
              {highestRoom
                ? `${highestRoom.name} has the highest estimated room-level energy consumption.`
                : "Room analytics will appear when room data is available."}
            </p>

            <button type="button" onClick={() => navigate("/dashboard")}>
              Review Dashboard
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
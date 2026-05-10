import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import EnergyChart from "../components/EnergyChart";
import DevicePieChart from "../components/DevicePieChart";
import RoomBarChart from "../components/RoomBarChart";
import api from "../api/axios";

export default function Dashboard() {
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
    loadDashboard();
  }, []);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    let userId = null;

    if (userRaw) {
      try {
        userId = JSON.parse(userRaw)?.id;
      } catch {
        userId = null;
      }
    }

    if (userId) {
      socket.emit("join", userId);
    }

    socket.on("dashboard:updated", loadDashboard);

    return () => {
      socket.off("dashboard:updated", loadDashboard);
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryRes, periodRes, deviceRes, roomRes] = await Promise.all([
        api.get("/dashboard/summary?activeOnly=true"),
        api.get("/dashboard/by-period?activeOnly=true"),
        api.get("/dashboard/by-device?activeOnly=true"),
        api.get("/dashboard/by-room?activeOnly=true"),
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
      console.error("Dashboard load error:", err);
    }
  };

  const topDevice =
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
            <h1>Main Dashboard</h1>
            <p>Current active-device energy consumption.</p>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            title="Current Active Load"
            value={`${Number(summary.totalEnergy || 0).toFixed(2)} kWh`}
            subtitle="Only active devices"
          />

          <StatCard
            title="Active Daily Cost"
            value={`$${Number(summary.dailyCost || 0).toFixed(2)}`}
            subtitle="Estimated cost from active devices"
          />

          <StatCard
            title="Active Usage Time"
            value={`${Number(summary.usageTime || 0).toFixed(1)} hrs`}
            subtitle="Runtime of active appliances"
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
            <h3>Active Usage Insight</h3>
            <p>
              {topDevice
                ? `${topDevice.name} is currently the highest-consuming active appliance.`
                : "No active device usage is currently being calculated."}
            </p>

            <button type="button" onClick={() => navigate("/devices")}>
              Review Devices
            </button>
          </div>

          <div className="recommend-card info">
            <h3>Analytics Keeps Full Estimate</h3>
            <p>
              This dashboard focuses on active devices only. Analytics still
              shows the full estimated household usage.
            </p>

            <button type="button" onClick={() => navigate("/analytics")}>
              View Analytics
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
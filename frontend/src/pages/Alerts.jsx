import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import socket from "../socket";
import {
  getAlerts,
  getUnreadCount,
  markAlertAsRead,
  deleteAlert,
} from "../api/alertsApi";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();

    const handleNewAlert = (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleAlertRead = ({ id }) => {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, is_read: true } : alert
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleAlertDeleted = ({ id, wasUnread }) => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    };

    socket.on("alert:created", handleNewAlert);
    socket.on("alert:read", handleAlertRead);
    socket.on("alert:deleted", handleAlertDeleted);

    return () => {
      socket.off("alert:created", handleNewAlert);
      socket.off("alert:read", handleAlertRead);
      socket.off("alert:deleted", handleAlertDeleted);
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const [alertsRes, unreadRes] = await Promise.all([
        getAlerts(),
        getUnreadCount(),
      ]);

      setAlerts(alertsRes.data);
      setUnreadCount(Number(unreadRes.data.unread_count || 0));
    } catch (err) {
      console.error("Alerts load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAlertAsRead(id);
    } catch (err) {
      console.error("Mark as read error:", err);
      alert(err.response?.data?.error || "Failed to mark alert as read");
    }
  };

  const handleDelete = async (id, isRead) => {
    try {
      await deleteAlert(id);
    } catch (err) {
      console.error("Delete alert error:", err);
      alert(err.response?.data?.error || "Failed to delete alert");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="page-header">
          <div>
            <h1>Alerts</h1>
            <p>Track important notifications and energy warnings.</p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <p className="stat-title">Total Alerts</p>
            <h2 className="stat-value">{alerts.length}</h2>
            <span className="stat-subtitle">All alert records</span>
          </div>

          <div className="stat-card">
            <p className="stat-title">Unread Alerts</p>
            <h2 className="stat-value">{unreadCount}</h2>
            <span className="stat-subtitle">Need your attention</span>
          </div>

          <div className="stat-card">
            <p className="stat-title">Read Alerts</p>
            <h2 className="stat-value">{alerts.length - unreadCount}</h2>
            <span className="stat-subtitle">Already reviewed</span>
          </div>
        </section>

        <section className="alerts-list">
          {loading ? (
            <div className="chart-card">
              <p>Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="chart-card">
              <p>No alerts found.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-card ${alert.is_read ? "read" : "unread"}`}
              >
                <div className="alert-card-top">
                  <div>
                    <h3>{alert.title || "Alert"}</h3>
                    <p>{alert.message || "No message provided."}</p>
                  </div>

                  <span
                    className={`alert-badge ${
                      alert.is_read ? "read" : "unread"
                    }`}
                  >
                    {alert.is_read ? "READ" : "UNREAD"}
                  </span>
                </div>

                <div className="alert-extra-grid">
                  <div><strong>Type:</strong> {alert.alert_type || "-"}</div>
                  <div><strong>Severity:</strong> {alert.severity || "-"}</div>
                  <div><strong>Device ID:</strong> {alert.device_id || "-"}</div>
                  <div><strong>Metric:</strong> {alert.threshold_metric || "-"}</div>
                  <div><strong>Threshold:</strong> {alert.threshold_value ?? "-"}</div>
                  <div><strong>Actual:</strong> {alert.actual_value ?? "-"}</div>
                </div>

                <div className="alert-meta">
                  <span>
                    Triggered:{" "}
                    {alert.triggered_at
                      ? new Date(alert.triggered_at).toLocaleString()
                      : "Unknown"}
                  </span>
                </div>

                <div className="alert-actions">
                  {!alert.is_read && (
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => handleDelete(alert.id, alert.is_read)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
const roomRoutes = require("./routes/room.routes");
app.use("/api/rooms", roomRoutes);
const deviceRoutes = require("./routes/devices.routes");
app.use("/api/devices", deviceRoutes);
const simulationRoutes = require("./routes/simulation.routes");
app.use("/api/simulate", simulationRoutes);
const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api/dashboard",dashboardRoutes);
const alertsRoutes = require("./routes/alerts.routes");
app.use("/api/alerts", alertsRoutes);


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PowerWise API running" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW() as now");
    res.json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ connected: false, error: err.message });
  }
});

const authMiddleware = require("./middleware/auth.middleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

module.exports = app;
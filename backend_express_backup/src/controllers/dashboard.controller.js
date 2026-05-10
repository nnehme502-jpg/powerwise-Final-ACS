const db = require("../db");

// total energy + total cost for logged-in user
exports.getSummary = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        COALESCE(SUM(el.energy_kwh), 0) AS total_energy_kwh,
        COALESCE(SUM(el.estimated_cost), 0) AS total_estimated_cost,
        COALESCE(SUM(el.hours_used), 0) AS total_hours_used
      FROM energy_logs el
      JOIN devices d ON el.device_id = d.id
      JOIN rooms r ON d.room_id = r.id
      WHERE r.user_id = $1
      `,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("DASHBOARD SUMMARY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// energy grouped by device
exports.getByDevice = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        d.id,
        d.name,
        d.device_type,
        COALESCE(SUM(el.energy_kwh), 0) AS total_energy_kwh,
        COALESCE(SUM(el.estimated_cost), 0) AS total_estimated_cost,
        COALESCE(SUM(el.hours_used), 0) AS total_hours_used
      FROM devices d
      JOIN rooms r ON d.room_id = r.id
      LEFT JOIN energy_logs el ON el.device_id = d.id
      WHERE r.user_id = $1
      GROUP BY d.id, d.name, d.device_type
      ORDER BY d.id ASC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("DASHBOARD BY DEVICE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// energy grouped by room
exports.getByRoom = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        r.id,
        r.name,
        COALESCE(SUM(el.energy_kwh), 0) AS total_energy_kwh,
        COALESCE(SUM(el.estimated_cost), 0) AS total_estimated_cost,
        COALESCE(SUM(el.hours_used), 0) AS total_hours_used
      FROM rooms r
      LEFT JOIN devices d ON d.room_id = r.id
      LEFT JOIN energy_logs el ON el.device_id = d.id
      WHERE r.user_id = $1
      GROUP BY r.id, r.name
      ORDER BY r.id ASC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("DASHBOARD BY ROOM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// energy grouped by day
exports.getByPeriod = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        DATE(el.logged_at) AS date,
        COALESCE(SUM(el.energy_kwh), 0) AS total_energy_kwh,
        COALESCE(SUM(el.estimated_cost), 0) AS total_estimated_cost,
        COALESCE(SUM(el.hours_used), 0) AS total_hours_used
      FROM energy_logs el
      JOIN devices d ON el.device_id = d.id
      JOIN rooms r ON d.room_id = r.id
      WHERE r.user_id = $1
      GROUP BY DATE(el.logged_at)
      ORDER BY DATE(el.logged_at) ASC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("DASHBOARD BY PERIOD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
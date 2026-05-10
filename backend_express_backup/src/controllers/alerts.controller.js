const db = require("../db");

// CREATE alert
exports.createAlert = async (req, res) => {
  try {
    const {
      device_id,
      alert_type,
      severity,
      title,
      message,
      threshold_metric,
      threshold_value,
      actual_value,
    } = req.body;

    if (!device_id || !alert_type || !severity) {
      return res.status(400).json({
        error: "device_id, alert_type, and severity are required",
      });
    }

    const result = await db.query(
      `
      INSERT INTO alerts (
        user_id,
        device_id,
        alert_type,
        severity,
        title,
        message,
        threshold_metric,
        threshold_value,
        actual_value,
        is_read,
        triggered_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, NOW())
      RETURNING *
      `,
      [
        req.user.id,
        device_id,
        alert_type,
        severity,
        title || "Alert",
        message || "No message provided",
        threshold_metric || null,
        threshold_value ?? null,
        actual_value ?? null,
      ]
    );

    if (global.io) {
      global.io.to(`user:${req.user.id}`).emit("alert:created", result.rows[0]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CREATE ALERT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET all alerts for user
exports.getAlerts = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM alerts
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET ALERTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET unread alerts count
exports.getUnreadCount = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT COUNT(*) AS unread_count
      FROM alerts
      WHERE user_id = $1 AND is_read = false
      `,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET UNREAD COUNT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// MARK alert as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      UPDATE alerts
      SET is_read = true
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alert not found" });
    }

    if (global.io) {
      global.io.to(`user:${req.user.id}`).emit("alert:read", { id });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("MARK ALERT READ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE alert
exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query(
      `SELECT * FROM alerts WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Alert not found" });
    }

    const wasUnread = existing.rows[0].is_read === false;

    await db.query(
      `
      DELETE FROM alerts
      WHERE id = $1 AND user_id = $2
      `,
      [id, req.user.id]
    );

    if (global.io) {
      global.io.to(`user:${req.user.id}`).emit("alert:deleted", {
        id: Number(id),
        wasUnread,
      });
    }

    res.json({ message: "Alert deleted" });
  } catch (err) {
    console.error("DELETE ALERT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
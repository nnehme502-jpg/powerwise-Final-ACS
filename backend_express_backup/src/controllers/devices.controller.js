const db = require("../db");

// GET all devices for logged-in user
exports.getDevices = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT d.*, r.name AS room_name
      FROM devices d
      JOIN rooms r ON d.room_id = r.id
      WHERE r.user_id = $1
      ORDER BY d.id ASC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET DEVICES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE device
exports.createDevice = async (req, res) => {
  try {
    const {
      name,
      room_id,
      power_rating_watts,
      device_type,
      status,
      avg_daily_usage_hours,
    } = req.body;

    if (!name || !room_id || !power_rating_watts || !device_type) {
      return res.status(400).json({
        error: "name, room_id, power_rating_watts, and device_type are required",
      });
    }

    const roomCheck = await db.query(
      "SELECT * FROM rooms WHERE id = $1 AND user_id = $2",
      [room_id, req.user.id]
    );

    if (roomCheck.rows.length === 0) {
      return res.status(403).json({ error: "Room not found or not yours" });
    }

    const result = await db.query(
      `
      INSERT INTO devices (
        name,
        room_id,
        power_rating_watts,
        device_type,
        status,
        avg_daily_usage_hours
      )
      VALUES ($1, $2, $3, $4, COALESCE($5, 'off'), COALESCE($6, 0))
      RETURNING *
      `,
      [
        name,
        room_id,
        power_rating_watts,
        device_type,
        status,
        avg_daily_usage_hours,
      ]
    );

    if (global.io) {
      global.io.to(`user:${req.user.id}`).emit("dashboard:updated", {
        action: "device_created",
        device: result.rows[0],
      });
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CREATE DEVICE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE device
exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      power_rating_watts,
      device_type,
      status,
      avg_daily_usage_hours,
      energy_threshold_kwh,
      cost_threshold,
    } = req.body;

    const result = await db.query(
      `
      UPDATE devices d
      SET
        name = COALESCE($1, d.name),
        power_rating_watts = COALESCE($2, d.power_rating_watts),
        device_type = COALESCE($3, d.device_type),
        status = COALESCE($4, d.status),
        avg_daily_usage_hours = COALESCE($5, d.avg_daily_usage_hours),
        energy_threshold_kwh = COALESCE($6, d.energy_threshold_kwh),
        cost_threshold = COALESCE($7, d.cost_threshold)
      FROM rooms r
      WHERE d.room_id = r.id
        AND d.id = $8
        AND r.user_id = $9
      RETURNING d.*
      `,
      [
        name,
        power_rating_watts,
        device_type,
        status,
        avg_daily_usage_hours,
        energy_threshold_kwh,
        cost_threshold,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    if (global.io) {
      global.io.to(`user:${req.user.id}`).emit("dashboard:updated", {
        action: "device_updated",
        device: result.rows[0],
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE DEVICE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE device
exports.deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM devices d
      USING rooms r
      WHERE d.room_id = r.id
        AND d.id = $1
        AND r.user_id = $2
      RETURNING d.*
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    if (global.io) {
      global.io.to(`user:${req.user.id}`).emit("dashboard:updated", {
        action: "device_deleted",
        deviceId: id,
      });
    }

    res.json({ message: "Device deleted successfully" });
  } catch (err) {
    console.error("DELETE DEVICE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
const db = require("../db");

async function simulateDeviceUsage(deviceId, hoursUsed) {
  const deviceResult = await db.query(
    `
    SELECT
      d.id,
      d.name,
      d.device_type,
      d.power_rating_watts,
      d.energy_threshold_kwh,
      d.cost_threshold,
      r.user_id,
      u.tariff_per_kwh
    FROM devices d
    JOIN rooms r ON d.room_id = r.id
    JOIN users u ON r.user_id = u.id
    WHERE d.id = $1
    `,
    [deviceId]
  );

  if (deviceResult.rows.length === 0) {
    throw new Error("Device not found");
  }

  const device = deviceResult.rows[0];

  const energy_kwh =
    (Number(device.power_rating_watts) * Number(hoursUsed)) / 1000;

  const estimated_cost =
    energy_kwh * Number(device.tariff_per_kwh);

  const logResult = await db.query(
    `
    INSERT INTO energy_logs (
      device_id,
      logged_at,
      period_label,
      hours_used,
      energy_kwh,
      estimated_cost,
      source
    )
    VALUES ($1, NOW(), 'manual', $2, $3, $4, 'simulated')
    RETURNING *
    `,
    [deviceId, hoursUsed, energy_kwh, estimated_cost]
  );

  const createdAlerts = [];

  if (
    device.energy_threshold_kwh !== null &&
    energy_kwh > Number(device.energy_threshold_kwh)
  ) {
    const energyAlertResult = await db.query(
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
        actual_value
      )
      VALUES ($1, $2, 'energy_threshold', 'high', $3, $4, 'energy_kwh', $5, $6)
      RETURNING *
      `,
      [
        device.user_id,
        deviceId,
        `High energy usage detected for ${device.name}`,
        `${device.name} used ${energy_kwh.toFixed(2)} kWh, which exceeded the threshold.`,
        device.energy_threshold_kwh,
        energy_kwh,
      ]
    );

    createdAlerts.push(energyAlertResult.rows[0]);

    if (global.io) {
      global.io.to(`user:${device.user_id}`).emit("alert:created", energyAlertResult.rows[0]);
    }
  }

  if (
    device.cost_threshold !== null &&
    estimated_cost > Number(device.cost_threshold)
  ) {
    const costAlertResult = await db.query(
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
        actual_value
      )
      VALUES ($1, $2, 'cost_threshold', 'high', $3, $4, 'estimated_cost', $5, $6)
      RETURNING *
      `,
      [
        device.user_id,
        deviceId,
        `High cost detected for ${device.name}`,
        `${device.name} cost ${estimated_cost.toFixed(2)}, which exceeded the threshold.`,
        device.cost_threshold,
        estimated_cost,
      ]
    );

    createdAlerts.push(costAlertResult.rows[0]);

    if (global.io) {
      global.io.to(`user:${device.user_id}`).emit("alert:created", costAlertResult.rows[0]);
    }
  }

  const result = {
    device: device.name,
    user_id: device.user_id,
    hours_used: Number(hoursUsed),
    energy_kwh,
    estimated_cost,
    log: logResult.rows[0],
    alerts: createdAlerts,
  };

  if (global.io) {
    global.io.to(`user:${device.user_id}`).emit("energy:created", result);
    global.io.to(`user:${device.user_id}`).emit("dashboard:updated", {
      user_id: device.user_id,
      device_id: deviceId,
    });
  }

  return result;
}

module.exports = {
  simulateDeviceUsage,
};
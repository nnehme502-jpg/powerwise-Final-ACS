import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Pool } from "pg";
import { PG_POOL } from "../database/database.module";
import { CreateDeviceDto, UpdateDeviceDto } from "./dto";

@Injectable()
export class DevicesService {
  constructor(@Inject(PG_POOL) private db: Pool) {}

  list(userId: number) {
    return this.db
      .query(
        `
        SELECT d.*, r.name AS room_name
        FROM devices d
        JOIN rooms r ON d.room_id = r.id
        WHERE r.user_id = $1
        ORDER BY d.id
        `,
        [userId],
      )
      .then((r) => r.rows);
  }

  private getDailyEnergy(device: any) {
    return (
      (Number(device.power_rating_watts || 0) *
        Number(device.avg_daily_usage_hours || 0)) /
      1000
    );
  }

  private async syncHighUsageAlert(userId: number, device: any) {
    const dailyEnergy = this.getDailyEnergy(device);

    const existing = await this.db.query(
      `
      SELECT id
      FROM alerts
      WHERE user_id = $1
        AND device_id = $2
        AND alert_type = 'high_usage'
      LIMIT 1
      `,
      [userId, device.id],
    );

    if (dailyEnergy >= 3) {
      const message = `${device.name} is consuming ${dailyEnergy.toFixed(
        2,
      )} kWh per day.`;

      if (existing.rowCount) {
        await this.db.query(
          `
          UPDATE alerts
          SET
            severity = $1,
            title = $2,
            message = $3,
            threshold_metric = NULL,
            threshold_value = NULL,
            actual_value = NULL,
            is_read = false,
            triggered_at = NOW()
          WHERE id = $4
          `,
          ["high", "High Energy Usage", message, existing.rows[0].id],
        );
      } else {
        await this.db.query(
          `
          INSERT INTO alerts(
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
          VALUES($1,$2,$3,$4,$5,$6,NULL,NULL,NULL,false,NOW())
          `,
          [
            userId,
            device.id,
            "high_usage",
            "high",
            "High Energy Usage",
            message,
          ],
        );
      }
    } else if (existing.rowCount) {
      await this.db.query(
        `
        DELETE FROM alerts
        WHERE id = $1
        `,
        [existing.rows[0].id],
      );
    }
  }

  async create(userId: number, d: CreateDeviceDto) {
    const room = await this.db.query(
      "SELECT id FROM rooms WHERE id = $1 AND user_id = $2",
      [d.room_id, userId],
    );

    if (!room.rowCount) {
      throw new ForbiddenException("Room not found or not yours");
    }

    try {
      const result = await this.db.query(
        `
        INSERT INTO devices(
          name,
          room_id,
          power_rating_watts,
          device_type,
          status,
          avg_daily_usage_hours
        )
        VALUES($1,$2,$3,$4,COALESCE($5,'inactive'),COALESCE($6,0))
        RETURNING *
        `,
        [
          d.name,
          d.room_id,
          Number(d.power_rating_watts),
          d.device_type,
          d.status,
          Number(d.avg_daily_usage_hours || 0),
        ],
      );

      const device = result.rows[0];

      await this.syncHighUsageAlert(userId, device);

      return device;
    } catch (err: any) {
      if (err.code === "23505") {
        throw new ConflictException(
          "A device with this name already exists in this room",
        );
      }

      throw err;
    }
  }

  async update(userId: number, id: number, d: UpdateDeviceDto) {
  const result = await this.db.query(
    `
    UPDATE devices d
    SET status = $1
    FROM rooms r
    WHERE d.room_id = r.id
      AND d.id = $2
      AND r.user_id = $3
    RETURNING d.*
    `,
    [d.status, id, userId],
  );

  if (!result.rowCount) {
    throw new NotFoundException("Device not found");
  }

  return result.rows[0];
}

  async remove(userId: number, id: number) {
    const result = await this.db.query(
      `
      DELETE FROM devices d
      USING rooms r
      WHERE d.room_id = r.id
        AND d.id = $1
        AND r.user_id = $2
      RETURNING d.*
      `,
      [id, userId],
    );

    if (!result.rowCount) {
      throw new NotFoundException("Device not found");
    }

    return { message: "Device deleted successfully" };
  }
}
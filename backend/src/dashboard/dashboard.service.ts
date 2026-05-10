import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { PG_POOL } from "../database/database.module";

const numRows = (rows: any[]) =>
  rows.map((r) =>
    Object.fromEntries(
      Object.entries(r).map(([k, v]) => [
        k,
        typeof v === "string" &&
        !isNaN(Number(v)) &&
        k !== "name" &&
        k !== "device_type" &&
        k !== "status" &&
        k !== "date"
          ? Number(v)
          : v,
      ]),
    ),
  );

@Injectable()
export class DashboardService {
  constructor(@Inject(PG_POOL) private db: Pool) {}

  private activeOnlyClause(activeOnly: boolean) {
    return activeOnly ? "AND d.status = 'active'" : "";
  }

  async summary(userId: number, activeOnly = false) {
    const result = await this.db.query(
      `
      SELECT
        COALESCE(SUM((d.power_rating_watts * d.avg_daily_usage_hours) / 1000.0), 0) AS total_energy,
        COALESCE(SUM(((d.power_rating_watts * d.avg_daily_usage_hours) / 1000.0) * 0.20), 0) AS daily_cost,
        COALESCE(SUM(d.avg_daily_usage_hours), 0) AS usage_time
      FROM devices d
      JOIN rooms r ON d.room_id = r.id
      WHERE r.user_id = $1
      ${this.activeOnlyClause(activeOnly)}
      `,
      [userId],
    );

    const totalEnergy = Number(result.rows[0].total_energy);
    const dailyCost = Number(result.rows[0].daily_cost);
    const usageTime = Number(result.rows[0].usage_time);

    return {
      totalEnergy,
      dailyCost,
      usageTime,
      total_energy_kwh: totalEnergy,
      total_estimated_cost: dailyCost,
      total_hours_used: usageTime,
    };
  }

  async byDevice(userId: number, activeOnly = false) {
    const result = await this.db.query(
      `
      SELECT
        d.id,
        d.name,
        d.device_type,
        d.status,
        COALESCE((d.power_rating_watts * d.avg_daily_usage_hours) / 1000.0, 0) AS total_energy_kwh,
        COALESCE(((d.power_rating_watts * d.avg_daily_usage_hours) / 1000.0) * 0.20, 0) AS total_estimated_cost,
        COALESCE(d.avg_daily_usage_hours, 0) AS total_hours_used
      FROM devices d
      JOIN rooms r ON d.room_id = r.id
      WHERE r.user_id = $1
      ${this.activeOnlyClause(activeOnly)}
      ORDER BY d.id
      `,
      [userId],
    );

    return numRows(result.rows);
  }

  async byRoom(userId: number, activeOnly = false) {
    const result = await this.db.query(
      `
      SELECT
        r.id,
        r.name,
        COALESCE(SUM((d.power_rating_watts * d.avg_daily_usage_hours) / 1000.0), 0) AS total_energy_kwh,
        COALESCE(SUM(((d.power_rating_watts * d.avg_daily_usage_hours) / 1000.0) * 0.20), 0) AS total_estimated_cost,
        COALESCE(SUM(d.avg_daily_usage_hours), 0) AS total_hours_used
      FROM rooms r
      LEFT JOIN devices d ON d.room_id = r.id
        ${activeOnly ? "AND d.status = 'active'" : ""}
      WHERE r.user_id = $1
      GROUP BY r.id, r.name
      ORDER BY r.id
      `,
      [userId],
    );

    return numRows(result.rows);
  }

  async byPeriod(userId: number, activeOnly = false) {
    const result = await this.db.query(
      `
      SELECT
        CURRENT_DATE::text AS date,
        COALESCE(SUM((d.power_rating_watts * d.avg_daily_usage_hours) / 1000.0), 0) AS total_energy_kwh,
        COALESCE(SUM(((d.power_rating_watts * d.avg_daily_usage_hours) / 1000.0) * 0.20), 0) AS total_estimated_cost,
        COALESCE(SUM(d.avg_daily_usage_hours), 0) AS total_hours_used
      FROM devices d
      JOIN rooms r ON d.room_id = r.id
      WHERE r.user_id = $1
      ${this.activeOnlyClause(activeOnly)}
      `,
      [userId],
    );

    return numRows(result.rows);
  }
}
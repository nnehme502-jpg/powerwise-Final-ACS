import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Pool } from "pg";
import { PG_POOL } from "../database/database.module";
import { CreateAlertDto } from "./dto";

@Injectable()
export class AlertsService {
  constructor(@Inject(PG_POOL) private db: Pool) {}

  list(userId: number) {
    return this.db
      .query(
        `
        SELECT *
        FROM alerts
        WHERE user_id = $1
        ORDER BY COALESCE(triggered_at, created_at) DESC
        `,
        [userId],
      )
      .then((r) => r.rows);
  }

  unread(userId: number) {
    return this.db
      .query(
        `
        SELECT COUNT(*) AS unread_count
        FROM alerts
        WHERE user_id = $1
          AND is_read = false
        `,
        [userId],
      )
      .then((r) => ({
        unread_count: Number(r.rows[0]?.unread_count || 0),
      }));
  }

  async create(userId: number, d: CreateAlertDto) {
    const result = await this.db.query(
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
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,false,NOW())
      RETURNING *
      `,
      [
        userId,
        d.device_id || null,
        d.alert_type || "general",
        d.severity || "medium",
        d.title || "Alert",
        d.message || "No message provided",
        d.threshold_metric || null,
        d.threshold_value ?? null,
        d.actual_value ?? null,
      ],
    );

    return result.rows[0];
  }

  async read(userId: number, id: number) {
    const result = await this.db.query(
      `
      UPDATE alerts
      SET is_read = true
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [id, userId],
    );

    if (!result.rowCount) {
      throw new NotFoundException("Alert not found");
    }

    return result.rows[0];
  }

  async remove(userId: number, id: number) {
    const result = await this.db.query(
      `
      DELETE FROM alerts
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [id, userId],
    );

    if (!result.rowCount) {
      throw new NotFoundException("Alert not found");
    }

    return {
      message: "Alert deleted",
      deletedAlert: result.rows[0],
      wasUnread: result.rows[0].is_read === false,
    };
  }
}
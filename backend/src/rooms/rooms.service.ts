import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Pool } from "pg";
import { PG_POOL } from "../database/database.module";
@Injectable()
export class RoomsService {
  constructor(@Inject(PG_POOL) private db: Pool) {}
  list(userId: number) {
    return this.db
      .query("SELECT * FROM rooms WHERE user_id=$1 ORDER BY id", [userId])
      .then((r) => r.rows);
  }
  async create(userId: number, name: string) {
    const r = await this.db.query(
      "INSERT INTO rooms(user_id,name) VALUES($1,$2) RETURNING *",
      [userId, name],
    );
    return r.rows[0];
  }
  async update(userId: number, id: number, name: string) {
    const r = await this.db.query(
      "UPDATE rooms SET name=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
      [name, id, userId],
    );
    if (!r.rowCount) throw new NotFoundException("Room not found");
    return r.rows[0];
  }
  async remove(userId: number, id: number) {
    const r = await this.db.query(
      "DELETE FROM rooms WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, userId],
    );
    if (!r.rowCount) throw new NotFoundException("Room not found");
    return { message: "Room deleted successfully" };
  }
}

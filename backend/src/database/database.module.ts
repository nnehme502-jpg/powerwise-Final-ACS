import { Global, Module } from "@nestjs/common";
import { Pool } from "pg";

export const PG_POOL = "PG_POOL";

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () =>
        new Pool({
          host: process.env.DB_HOST || "localhost",
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || "postgres",
          password: String(process.env.DB_PASSWORD),
          database: process.env.DB_NAME || "powerwise",
        }),
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
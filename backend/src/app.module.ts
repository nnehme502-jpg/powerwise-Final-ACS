import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { RoomsModule } from "./rooms/rooms.module";
import { DevicesModule } from "./devices/devices.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { AlertsModule } from "./alerts/alerts.module";
import { SimulationModule } from "./simulation/simulation.module";
import { EventsModule } from "./events.module";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      path: "/graphql",
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    AuthModule,
    RoomsModule,
    DevicesModule,
    DashboardModule,
    AlertsModule,
    SimulationModule,
    EventsModule,
  ],
})
export class AppModule {}

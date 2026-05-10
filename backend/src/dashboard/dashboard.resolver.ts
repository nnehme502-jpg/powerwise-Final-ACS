import { UseGuards } from "@nestjs/common";
import { Float, Int, ObjectType, Field, Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "../auth/jwt.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { DashboardService } from "./dashboard.service";

@ObjectType()
class DashboardSummary {
  @Field(() => Float)
  totalEnergy: number;

  @Field(() => Float)
  dailyCost: number;

  @Field(() => Float)
  usageTime: number;

  @Field(() => Float)
  total_energy_kwh: number;

  @Field(() => Float)
  total_estimated_cost: number;

  @Field(() => Float)
  total_hours_used: number;
}

@ObjectType()
class DashboardDevice {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  device_type: string;

  @Field(() => Float)
  total_energy_kwh: number;

  @Field(() => Float)
  total_estimated_cost: number;

  @Field(() => Float)
  total_hours_used: number;
}

@ObjectType()
class DashboardRoom {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  total_energy_kwh: number;

  @Field(() => Float)
  total_estimated_cost: number;

  @Field(() => Float)
  total_hours_used: number;
}

@ObjectType()
class DashboardPeriod {
  @Field()
  date: string;

  @Field(() => Float)
  total_energy_kwh: number;

  @Field(() => Float)
  total_estimated_cost: number;

  @Field(() => Float)
  total_hours_used: number;
}

@Resolver()
@UseGuards(AuthGuard)
export class DashboardResolver {
  constructor(private dashboardService: DashboardService) {}

  @Query(() => DashboardSummary)
  dashboardSummary(@CurrentUser() user) {
    return this.dashboardService.summary(user.id);
  }

  @Query(() => [DashboardDevice])
  dashboardByDevice(@CurrentUser() user) {
    return this.dashboardService.byDevice(user.id);
  }

  @Query(() => [DashboardRoom])
  dashboardByRoom(@CurrentUser() user) {
    return this.dashboardService.byRoom(user.id);
  }

  @Query(() => [DashboardPeriod])
  dashboardByPeriod(@CurrentUser() user) {
    return this.dashboardService.byPeriod(user.id);
  }

  @Query(() => String)
  graphqlStatus() {
    return "GraphQL is working in PowerWise";
  }
}
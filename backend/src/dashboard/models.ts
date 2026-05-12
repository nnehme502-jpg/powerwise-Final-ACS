import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class DashboardSummary {
  @Field(() => Float) total_energy_kwh: number;
  @Field(() => Float) total_estimated_cost: number;
  @Field(() => Float) total_hours_used: number;
}
@ObjectType()
export class DeviceEnergy {
  @Field(() => Int) id: number;
  @Field() name: string;
  @Field() device_type: string;
  @Field(() => Float) total_energy_kwh: number;
  @Field(() => Float) total_estimated_cost: number;
  @Field(() => Float) total_hours_used: number;
}
@ObjectType()
export class RoomEnergy {
  @Field(() => Int) id: number;
  @Field() name: string;
  @Field(() => Float) total_energy_kwh: number;
  @Field(() => Float) total_estimated_cost: number;
  @Field(() => Float) total_hours_used: number;
}
@ObjectType()
export class PeriodEnergy {
  @Field() date: string;
  @Field(() => Float) total_energy_kwh: number;
  @Field(() => Float) total_estimated_cost: number;
  @Field(() => Float) total_hours_used: number;
}

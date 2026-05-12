import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";
const types = [
  "heater",
  "air_conditioner",
  "washing_machine",
  "dryer",
  "refrigerator",
  "oven",
  "dishwasher",
  "television",
  "computer",
  "router",
  "lighting",
  "fan",
  "water_heater",
  "microwave",
  "vacuum",
  "other",
];
export class CreateDeviceDto {
  @IsNotEmpty() name: string;
  @IsInt() room_id: number;
  @IsNumber() @Min(1) power_rating_watts: number;
  @IsIn(types) device_type: string;
  @IsOptional() @IsNumber() @Min(0) avg_daily_usage_hours?: number;
  @IsOptional()
  @IsIn(["active", "inactive", "maintenance", "off"])
  status?: string;
}
export class UpdateDeviceDto {
  @IsOptional() name?: string;
  @IsOptional() @IsNumber() power_rating_watts?: number;
  @IsOptional() @IsIn(types) device_type?: string;
  @IsOptional()
  @IsIn(["active", "inactive", "maintenance", "off"])
  status?: string;
  @IsOptional() @IsNumber() avg_daily_usage_hours?: number;
  @IsOptional() @IsNumber() energy_threshold_kwh?: number;
  @IsOptional() @IsNumber() cost_threshold?: number;
}

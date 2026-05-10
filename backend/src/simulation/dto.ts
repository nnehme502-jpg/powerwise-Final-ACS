import { IsInt, IsNumber, Min } from 'class-validator';
export class SimulationDto{ @IsInt() device_id:number; @IsNumber() @Min(0.1) hours_used:number; }

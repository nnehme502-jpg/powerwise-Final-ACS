import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SimulationController} from './simulation.controller';
import { SimulationService} from './simulation.service';
@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [SimulationController],
  providers: [SimulationService],
})
export class SimulationModule {}
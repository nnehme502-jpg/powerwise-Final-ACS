import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { AlertsController} from './alerts.controller';
import { AlertsService} from './alerts.service';
@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
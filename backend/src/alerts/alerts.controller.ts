import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/jwt.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { EventsGateway } from "../events.gateway";
import { AlertsService } from "./alerts.service";
import { CreateAlertDto } from "./dto";

@ApiTags("alerts")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("alerts")
export class AlertsController {
  constructor(
    private alertsService: AlertsService,
    private events: EventsGateway,
  ) {}

  @Get()
  list(@CurrentUser() user) {
    return this.alertsService.list(user.id);
  }

  @Get("unread-count")
  unread(@CurrentUser() user) {
    return this.alertsService.unread(user.id);
  }

  @Post()
  async create(@CurrentUser() user, @Body() dto: CreateAlertDto) {
    const alert = await this.alertsService.create(user.id, dto);

    this.events.emitToUser(user.id, "alert:created", alert);

    return alert;
  }

  @Patch(":id/read")
  async read(
    @CurrentUser() user,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const alert = await this.alertsService.read(user.id, id);

    this.events.emitToUser(user.id, "alert:read", { id });

    return alert;
  }

  @Delete(":id")
  async remove(
    @CurrentUser() user,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const result = await this.alertsService.remove(user.id, id);

    this.events.emitToUser(user.id, "alert:deleted", {
      id,
      wasUnread: result.wasUnread,
    });

    return result;
  }
}
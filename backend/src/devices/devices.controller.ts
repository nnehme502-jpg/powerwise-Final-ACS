import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/jwt.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { EventsGateway } from "../events.gateway";
import { CreateDeviceDto, UpdateDeviceDto } from "./dto";
import { DevicesService } from "./devices.service";
@ApiTags("devices")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("devices")
export class DevicesController {
  constructor(
    private s: DevicesService,
    private events: EventsGateway,
  ) {}
  @Get() list(@CurrentUser() u) {
    return this.s.list(u.id);
  }
  @Post() async create(@CurrentUser() u, @Body() dto: CreateDeviceDto) {
    const d = await this.s.create(u.id, dto);
    this.events.emitToUser(u.id, "dashboard:updated", {
      action: "device_created",
      device: d,
    });
    return d;
  }
  @Put(":id") async update(
    @CurrentUser() u,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDeviceDto,
  ) {
    const d = await this.s.update(u.id, id, dto);
    this.events.emitToUser(u.id, "dashboard:updated", {
      action: "device_updated",
      device: d,
    });
    return d;
  }
  @Delete(":id") async remove(
    @CurrentUser() u,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const out = await this.s.remove(u.id, id);
    this.events.emitToUser(u.id, "dashboard:updated", {
      action: "device_deleted",
      deviceId: id,
    });
    return out;
  }
}

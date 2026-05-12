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
import { RoomDto } from "./dto";
import { RoomsService } from "./rooms.service";
@ApiTags("rooms")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("rooms")
export class RoomsController {
  constructor(private service: RoomsService) {}
  @Get() list(@CurrentUser() u) {
    return this.service.list(u.id);
  }
  @Post() create(@CurrentUser() u, @Body() dto: RoomDto) {
    return this.service.create(u.id, dto.name);
  }
  @Put(":id") update(
    @CurrentUser() u,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: RoomDto,
  ) {
    return this.service.update(u.id, id, dto.name);
  }
  @Delete(":id") remove(
    @CurrentUser() u,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.service.remove(u.id, id);
  }
}

import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/jwt.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  private isActiveOnly(value?: string) {
    return value === "true";
  }

  @Get("summary")
  summary(@CurrentUser() user, @Query("activeOnly") activeOnly?: string) {
    return this.dashboardService.summary(
      user.id,
      this.isActiveOnly(activeOnly),
    );
  }

  @Get("by-device")
  byDevice(@CurrentUser() user, @Query("activeOnly") activeOnly?: string) {
    return this.dashboardService.byDevice(
      user.id,
      this.isActiveOnly(activeOnly),
    );
  }

  @Get("by-room")
  byRoom(@CurrentUser() user, @Query("activeOnly") activeOnly?: string) {
    return this.dashboardService.byRoom(
      user.id,
      this.isActiveOnly(activeOnly),
    );
  }

  @Get("by-period")
  byPeriod(@CurrentUser() user, @Query("activeOnly") activeOnly?: string) {
    return this.dashboardService.byPeriod(
      user.id,
      this.isActiveOnly(activeOnly),
    );
  }
}
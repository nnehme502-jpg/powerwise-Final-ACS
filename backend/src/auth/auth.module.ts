import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./jwt.guard";
@Module({
  imports: [
    JwtModule.register({
      secret: "powerwise-secret",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, AuthGuard],
})


export class AuthModule {}

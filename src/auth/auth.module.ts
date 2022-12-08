import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AccessTokenJwtStrategy } from './strategies/access-token-jwt.strategy';
import { RefreshTokenJwtStrategy } from './strategies/refresh-token-jwt.strategy';
import { AccessRouteJwtStrategy } from './strategies/access-route-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenJwtStrategy,
    RefreshTokenJwtStrategy,
    AccessRouteJwtStrategy,
  ],
  exports: [
    AuthService,
    AccessTokenJwtStrategy,
    RefreshTokenJwtStrategy,
    AccessRouteJwtStrategy,
  ],
})
export class AuthModule {}

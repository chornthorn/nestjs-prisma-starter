import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Constants } from '../../common/constants/constants';
import { JwtAccessRoutePayloadType } from '../../common/types/jwt-access-route-payload.type';

@Injectable()
export class AccessRouteJwtStrategy extends PassportStrategy(
  Strategy,
  Constants.JWT_ROUTE,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'access-route-token-secret',
    });
  }

  validate(payload: JwtAccessRoutePayloadType) {
    return payload;
  }
}

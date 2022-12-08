import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Constants } from '../../common/constants/constants';
import { JwtAccessPayload } from '../../common/types/jwt-access-payload.type';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(
  Strategy,
  Constants.JWT,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'access-token-secret',
    });
  }

  validate(payload: JwtAccessPayload) {
    return payload;
  }
}

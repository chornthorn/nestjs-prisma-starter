import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Constants } from '../../common/constants/constants';

@Injectable()
export class AccessGenerateGuard extends AuthGuard(Constants.JWT_ROUTE) {
  constructor() {
    super();
  }
}

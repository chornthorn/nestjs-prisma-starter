import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Constants } from '../../common/constants/constants';

@Injectable()
export class RefreshGuard extends AuthGuard(Constants.JWT_REFRESH) {
  constructor() {
    super();
  }
}

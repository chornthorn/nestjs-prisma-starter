import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Constants } from '../../common/constants/constants';

@Injectable()
export class AccessGuard extends AuthGuard(Constants.JWT) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const Public = this.reflector.getAllAndOverride('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (Public) return true;
    return super.canActivate(context);
  }
}

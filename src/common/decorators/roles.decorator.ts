import { SetMetadata } from '@nestjs/common';
import { Constants } from '../constants/constants';

export const Roles = (...roles: string[]) =>
  SetMetadata(Constants.ROLES, roles);

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  USER = 'user',
  ADMIN = 'admin',
}

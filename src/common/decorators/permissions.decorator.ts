import { SetMetadata } from '@nestjs/common';
import { Constants } from '../constants/constants';

export const Permissions = (...permissions: string[]) =>
  SetMetadata(Constants.PERMISSIONS, permissions);

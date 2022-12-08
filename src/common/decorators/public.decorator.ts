import { SetMetadata } from '@nestjs/common';
import { Constants } from '../constants/constants';

export const Public = () => SetMetadata(Constants.PUBLIC, true);

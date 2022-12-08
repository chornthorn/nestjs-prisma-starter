import { SetMetadata } from '@nestjs/common';

export const CanGenerate = () => SetMetadata('can_generate', true);

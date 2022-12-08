import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  role: string;
}

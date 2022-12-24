import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender, Role, Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullNameEn: string;

  @ApiProperty({ example: 'ចន ដូ' })
  @IsString()
  fullNameKh: string;

  @ApiProperty({ enum: Gender, default: Gender.Other, required: false })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: Status, default: Status.Active, required: false })
  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @ApiProperty({ enum: Role, default: Role.User, required: false })
  @IsEnum(Role)
  @IsOptional()
  role: Role;
}

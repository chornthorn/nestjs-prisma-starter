import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender, Role, Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullNameEn: string;

  @ApiProperty()
  @IsString()
  fullNameKh: string;

  @ApiProperty({ enum: Gender, required: false, default: Gender.Other })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: Role, required: false })
  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @ApiProperty({ enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role: Role;
}

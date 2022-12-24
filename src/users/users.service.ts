import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userFounded = await this.prismaService.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (userFounded) {
      throw new BadRequestException('Username already exists');
    }

    const userEntity = await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
        fullNameEn: createUserDto.fullNameEn,
        fullNameKh: createUserDto.fullNameKh,
        gender: createUserDto.gender,
        role: createUserDto.role,
      },
    });
    if (!userEntity) {
      throw new BadRequestException("Can't create user");
    }
    // remove password from response
    delete userEntity.password;
    return userEntity;
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // find user by username
  async findOneByUsername(username: string) {
    return await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        username: updateUserDto.username,
        password: updateUserDto.password,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found or can not update');
    }
    return user;
  }

  async remove(id: string) {
    const userFounded = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!userFounded) {
      throw new NotFoundException('User not found');
    }

    const user = await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('Delete user failed');
    }
    return 'Delete user successfully';
  }
}

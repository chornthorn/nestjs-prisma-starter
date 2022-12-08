import { BadRequestException, Injectable } from '@nestjs/common';
import { UtilityHelper } from '../common/utilities/utility.helper';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // check if email already exists
    const userExists = await this.prismaService.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (userExists) {
      throw new BadRequestException('Username already exists');
    }

    const userEntity = await this.prismaService.user.create({
      data: createUserDto,
    });
    if (!userEntity) {
      throw new BadRequestException('User not created');
    }
    // remove password from response
    const { password, ...user } = userEntity;
    return user;
  }

  async findAll() {
    const users = await this.prismaService.user.findMany();
    // remove password from response
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findOne(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async findOneByUsername(username: string) {
    return await this.prismaService.user.findUnique({
      where: { username },
    });
  }

  // validate username
  async validateUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new BadRequestException('Username not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // user can't update username
    const { username, ...updateData } = updateUserDto;

    // update user
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        ...updateData,
        resetToken: null,
      },
    });

    if (!updatedUser) {
      throw new BadRequestException('User not updated');
    }

    // remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const deletedUser = await this.prismaService.user.delete({
      where: { id },
    });

    if (!deletedUser) {
      throw new BadRequestException('User not deleted');
    }
    return 'User deleted successfully';
  }

  // change password from old password
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { id, oldPassword, newPassword } = changePasswordDto;
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // compare password
    const isPasswordHashed = await UtilityHelper.compareString(
      oldPassword,
      user.password,
    );

    if (!isPasswordHashed) {
      throw new BadRequestException('Old password is incorrect');
    }

    // check if new password is same as old password
    const isSamePassword = await UtilityHelper.compareString(
      newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password cannot be same as old password',
      );
    }

    // hash new password
    const hashedPassword = await UtilityHelper.hasString(newPassword);

    if (!hashedPassword) {
      throw new BadRequestException('Something went wrong');
    }

    // update password
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    if (!updatedUser) {
      throw new BadRequestException('Password not updated');
    }
    return 'Password updated successfully ';
  }

  // request password reset
  async requestPasswordReset(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new BadRequestException('You are not registered');
    }

    // generate reset token string
    const resetToken = UtilityHelper.generateRandomString(32);

    if (!resetToken) {
      throw new BadRequestException('Something went wrong');
    }

    // update reset token in db
    const updatedUser = await this.prismaService.user.update({
      where: { username },
      data: { resetToken: resetToken },
    });

    if (!updatedUser) {
      throw new BadRequestException('Update reset token failed');
    }

    // send reset token to response
    return { resetToken };
  }

  // reset password from reset token
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { username, resetToken, password } = resetPasswordDto;
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // check if reset token is correct
    if (resetToken !== user.resetToken) {
      throw new BadRequestException('Reset token is invalid or expired');
    }

    // hash new password
    const hashedPassword = await UtilityHelper.hasString(password);

    if (!hashedPassword) {
      throw new BadRequestException('Something went wrong');
    }

    // update password
    const updatedUser = await this.prismaService.user.update({
      where: { username },
      data: { password: hashedPassword, resetToken: null },
    });

    if (!updatedUser) {
      throw new BadRequestException('Password not updated');
    }

    return 'Password updated successfully. Please login';
  }
}

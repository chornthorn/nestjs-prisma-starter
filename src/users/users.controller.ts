import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Roles, RoleType } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(RoleType.USER)
  @UseInterceptors(TransformInterceptor)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(TransformInterceptor)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // change password
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('change-password')
  changePassword(
    @Param('id') id: string,
    @Body() changePassword: ChangePasswordDto,
    @CurrentUserId() userId: string,
  ) {
    return this.usersService.changePassword({
      id: userId,
      ...changePassword,
    });
  }

  // request password reset
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('request-reset-password')
  requestPasswordReset(@Body('username') username: string) {
    return this.usersService.requestPasswordReset(username);
  }

  //reset password
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Get('username/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.validateUsername(username);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseInterceptors(TransformInterceptor)
  @Patch()
  update(@CurrentUserId() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseInterceptors(TransformInterceptor)
  @Delete()
  remove(@CurrentUserId() id: string) {
    return this.usersService.remove(id);
  }
}

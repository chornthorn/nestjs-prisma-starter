import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // refresh token
  @Public()
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('refresh-token')
  async refreshToken(@CurrentUser() user) {
    return this.authService.refreshToken(user.username);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('logout')
  async logout(@CurrentUser() user) {
    return 'Logout successfully';
  }
}
